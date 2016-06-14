///	<reference path="../../libs/createjs/createjs.d.ts" />

import {Component, ViewChild, Input, ElementRef} from '@angular/core';
import {AnimPreviewComponent} from "./anim-preview.component";
import {PropertiesComponent} from "./property.component";
import {ImageListComponent} from "./image-list.component";
import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";
import {PresetType} from "../type/preset-type";
import {PresetWeb} from "../preset/preset-web";
import {PresetLine} from "../preset/preset-line";
import {LineStampValidator} from "../validators/LineStampValidator";

declare function require(value:String):any;

@Component({
	selector: 'my-app',
	template: `
    <div class="app-component"  #myComponent>		
		<div class="mod-setting p-a-1">

			<!-- 拡大率 -->
			<div class="form-group row m-b-1">
				<label for="inputPassword" class="col-sm-3 form-control-label">用途</label>
				<div class="col-sm-9">
					<select class="c-select m-b-1" style="width:100%" #optionSelecter (change)="handlePresetChange($event.target.value)">
						<option value="0">LINEアニメ−ションスタンプ</option>
						<option value="1">webページ用アニメ−ション</option>
					</select>
				</div>
			</div>

			<properties [animationOptionData]="animationOptionData" #properties></properties>
			<hr />
			<button (click)="generateAnimImage()" class="btn btn-primary center-block">アニメ画像を保存する</button>
		</div>
		
		<div class="mod-preview bg-inverse">
			<anim-preview [animationOptionData]="animationOptionData" #animePreview></anim-preview>
			
			<!-- <button (click)="openDirectories()">open</button> -->
			<image-list #imageList  (imageUpdateEvent)="imageUpdateEvent()"></image-list>
		</div>
	</div>

	<div class="mod-statusbar bg-success">
		<a href="https://ics.media/" target="_blank">ICS</a>
	</div>
	
	<dialog style="display: none;">
		<img src="imgs/loading.gif" />
	</dialog>
  `,
	directives: [AnimPreviewComponent, PropertiesComponent, ImageListComponent],
	styleUrls: ['./styles/app.css']
})
export class AppComponent {

	@Input() animationOptionData:AnimationImageOptions;
	@ViewChild("properties") propertiesComponent:PropertiesComponent;
	@ViewChild("imageList") imageListComponent:ImageListComponent;
	@ViewChild("animePreview") animePreviewComponent:AnimPreviewComponent;
	@ViewChild("myComponent") myComponent:ElementRef;
	@ViewChild("optionSelecter") optionSelecterComponent:ElementRef;

	private temporaryPath:string;
	private selectedPath:string;
	private selectedDirectory:string;
	private selectedBaseName:string;

	ngOnInit() {
		this.animationOptionData = new AnimationImageOptions();

		// はじめはLINEスタンプのプリセットにする
		PresetLine.setPreset(this.animationOptionData);

		// TODO 前回起動時のプリセットは覚えておきたい

		//	保存先の指定返却
		const ipc = require('electron').ipcRenderer;
		ipc.on('selected-save-image', (event:any, path:string) => {
			this._exportImages(path);
		});

		ipc.on('unlock-ui', (event:any) => {
			this._hideLockDialog();
		})

		//	テンポラリパス生成
		const remote = require('electron').remote;
		const app = remote.app;
		const path = require('path');

		this.temporaryPath = path.join(app.getPath('temp'), "a-img-generator");
	}

	ngAfterViewInit() {

		const component = this.myComponent.nativeElement;
		component.addEventListener("dragover", (event:DragEvent)=> {
			this._handleDragOver(event);
		});

		component.addEventListener("drop", (event:DragEvent)=> {
			this.imageListComponent.handleDrop(event);
		});
	}

	private _handleDragOver(event:DragEvent) {
		event.preventDefault();
	}

	private handlePresetChange(presetMode:string) {

		switch (Number(presetMode)) {
			case PresetType.LINE:
				PresetLine.setPreset(this.animationOptionData);
				break;
			case PresetType.WEB:
				PresetWeb.setPreset(this.animationOptionData);
				break;
		}
	}

	private imageUpdateEvent() {
		this.animePreviewComponent.setItems(this.imageListComponent.items);
	}

	private generateAnimImage() {
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-save-dialog', "line");
		this._showLockDialog();
	}

	/**
	 * 作業用フォルダーのクリーンアップ
	 * @returns {Promise<any>}
	 * @private
	 */
	private _cleanTemporary():Promise<any> {
		return new Promise(((resolve:Function, reject:Function) => {

			const del = require('del');
			const path = require('path');
			const pngTemporary = path.join(this.temporaryPath, "*.*");

			del([pngTemporary], {force: true}).then((paths:string[]) => {
				const fs = require('fs');

				let stat:any = fs.statSync(this.temporaryPath);

				// フォルダーが存在していなければ
				if (stat.isDirectory() == false) {
					// フォルダーを作成
					fs.mkdirSync(this.temporaryPath);
				}
				console.log("clean-temporary:success");
				resolve();
			});
		}
	}

	private _exportImages(path:string) {

		this.selectedPath = path;
		const pathArr = path.split("/");
		this.selectedBaseName = pathArr.pop().split(".").shift();
		this.selectedDirectory = pathArr.join("/");

		this._cleanTemporary()
			.then(() => {
				return this._copyAll();
			})
			.then(function (results) { // 結果は配列にまとまって帰ってくる ['a', 'b', 'c']
				return results.map(function (result) {
					return result;
				});
			})
			.then(() => {
				// APNG書き出しが有効になっている場合
				if (this.animationOptionData.enabledExportApng == true) {
					return this._generateApng();
				}
			})
			.then(() => {
				// WebP書き出しが有効になっている場合
				if (this.animationOptionData.enabledExportWebp == true) {
					return this._generateWebp();
				}
			})
			.then(()=> {
				// APNGとWebP画像の両方書き出しが有効になっている場合
				if (this.animationOptionData.enabledExportHtml == true) {
					this._generateHtml();
				}
			})
			.then(()=> {
				/* some process */
				this._hideLockDialog();

				// エクスプローラーで開くでも、まだいいかも
				const {shell} = require('electron');
				shell.showItemInFolder(this.selectedPath);
			})
			.catch(()=> {
				// どれか一つでも失敗すれば呼ばれる
				this._hideLockDialog();
				alert("エラーが発生しました。");
			});
	}

	private _copyAll() {

		const fs = require('fs');

		return Promise.all(this.imageListComponent.items.map((item) => {
			return new Promise((resolve, reject) => {

				const path = require('path');
				const src = item.imagePath;

				const destination:string = path.join(this.temporaryPath, `frame${item.frameNumber}.png`);

				const r = fs.createReadStream(src);
				const w = fs.createWriteStream(destination);

				r.on("error", (err:any) => {
					reject(err);
				});
				w.on("error", (err:any) => {
					reject(err);
				});
				w.on("close", (ex:any) => {
					resolve();
				});

				r.pipe(w);
			})
		}))
	}

	/**
	 * モダールダイアログを開きます。
	 * @private
	 */
	private _showLockDialog() {
		const dialog:any = document.querySelector('dialog');
		dialog.showModal();
		dialog.style["display"] = "flex"; // こんな書き方をする必要があるのか…

		createjs.Ticker.paused = true; // 効かない…
	}

	/**
	 * モダールダイアログを閉じます。
	 * @private
	 */
	private _hideLockDialog() {
		const dialog:any = document.querySelector('dialog');
		dialog.close();
		dialog.style["display"] = "none"; // こんな書き方をする必要があるのか…

		createjs.Ticker.paused = false; // 効かない…
	}

	/**
	 * APNG画像を保存します。
	 * @returns {Promise<T>}
	 * @private
	 */
	private _generateApng():Promise<any> {
		return new Promise(((resolve:Function, reject:Function) => {
			const remote = require('electron').remote;
			const path = require('path');
			const app = remote.app;
			const appPath:string = app.getAppPath();

			const exec = require('child_process').execFile;
			const pngPath = path.join(this.temporaryPath, "frame*.png");

			const compressOptions = this.getCompressOption(this.animationOptionData.compression);
			const loopOption = "-l" + ( this.animationOptionData.noLoop ? 0 : this.animationOptionData.loop - 1 );
			const options = [
				`${this.selectedDirectory}/${this.selectedBaseName}.png`,
				pngPath,
				"1",
				this.animationOptionData.fps,
				compressOptions,
				loopOption];

			exec(`${appPath}/bin/apngasm`, options, (err:any, stdout:any, stderr:any) => {

				if (!err) {
					// TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
					//exec(`/Applications/Safari.app`, [this.apngPath]);

					if (this.animationOptionData.preset == PresetType.LINE) {
						const validateArr = LineStampValidator.validate(this.selectedPath, this.animationOptionData);

						if (validateArr.length > 0) {
							alert(validateArr.join("\n\n"));
						}
					}
					resolve();
				} else {
					console.error(stderr);
					reject();
				}
			});
		}));

	}

	/**
	 * WEBP アニメーション画像を作ります。
	 * @returns {Promise<T>}
	 * @private
	 */
	private _generateWebp():Promise<any> {
		return new Promise(((resolve:Function, reject:Function) => {
			const remote = require('electron').remote;
			const path = require('path');
			const app = remote.app;
			const appPath:string = app.getAppPath();

			const execFile = require('child_process').execFile;
			const pngPath = path.join(this.temporaryPath);

			const options:string[] = [];
			const frameMs = Math.round(1000 / this.animationOptionData.fps);

			const pngFiles:string[] = [];
			for (let i = 0; i < this.imageListComponent.items.length; i++) {
				// なんかおかしい
				options.push(`-frame`);
				options.push(`${pngPath}/frame${i}.png.webp`);
				options.push(`+${frameMs}+0+0+1`);
				pngFiles.push(`${pngPath}/frame${i}.png`);
			}
			if (this.animationOptionData.noLoop == false) {
				options.push(`-loop`);
				options.push(`${this.animationOptionData.loop - 1}`);
			}
			options.push(`-o`);
			options.push(`${this.selectedDirectory}/${this.selectedBaseName}.webp`);

			this._convertPng2Webps(pngFiles).then(()=> {
				execFile(`${appPath}/bin/webpmux`, options, (err:string, stdout:string, stderr:string) => {
					if (!err) {
						resolve();
					} else {
						console.error(stderr);
						reject();
					}
				});
			}).catch(()=> {
				reject();
			});
		}));

	}

	private _convertPng2Webps(pngPaths:string[]):Promise<any> {
		const promises:Promise<any>[] = [];
		for (let i = 0; i < pngPaths.length; i++) {
			promises.push(this._convertPng2Webp(pngPaths[i]));
		}

		return new Promise(((resolve:Function, reject:Function)=> {
			Promise.all(promises).then(()=> {
				resolve();
			}).catch(()=> {
				reject();
			})
		}));
	}

	private _convertPng2Webp(filePath:string):Promise<any> {
		const remote = require('electron').remote;
		const appPath:string = remote.app.getAppPath();
		const execFile = require('child_process').execFile;

		return new Promise(((resolve:Function, reject:Function)=> {
			execFile(`${appPath}/bin/cwebp`, [filePath, `-o`, `${filePath}.webp`],
				(err:any, stdout:any, stderr:any) => {
					if (!err) {
						resolve();
					} else {
						reject();
						console.error(stderr);
					}
				});
		}));
	}

	/**
	 * HTMLファイルを作成します。
	 * @private
	 */
	private _generateHtml():void {

		const fs = require('fs');

		const fileName:string = this.selectedBaseName;

		let imageElement:string;

		if (this.animationOptionData.enabledExportApng && this.animationOptionData.enabledExportWebp) {
			imageElement = `
    <!-- Chrome と Firefox と Safari で再生可能 (IE, Edge ではアニメは再生できません) -->	
    <picture>
	  <!-- Chrome 用 -->
      <source type="image/webp" srcset="${fileName}.webp" />
      <!-- Firefox, Safari 用 -->
      <img src="${fileName}.png" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />
    </picture>`;
		} else if (this.animationOptionData.enabledExportApng) {
			imageElement = `
	<!-- Firefox と Safari で再生可能 (Chrome, IE, Edge ではアニメは再生できません) -->
    <img src="${fileName}.png" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />`;
		} else if (this.animationOptionData.enabledExportWebp) {
			imageElement = `
	<!-- Chrome で再生可能 (IE, Edge, Firefox, Safari では表示できません) -->
    <img src="${fileName}.webp" width="${this.animationOptionData.imageInfo.width}" height="${this.animationOptionData.imageInfo.height}" alt="" />`;
		} else {
			return;
		}

		let data = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
  	${imageElement}
  	
  </body>
</html>`;

		fs.writeFileSync(`${this.selectedDirectory}/${this.selectedBaseName}.html`, data);
	}

	private getCompressOption(type:CompressionType) {
		switch (type) {
			case CompressionType.zlib:
				return "-z0";
			case CompressionType.zip7:
				return "-z1";
			case CompressionType.Zopfli:
				return "-z2";
		}
	}

	private openDirectories() {
		this.imageListComponent.openDirectories();
	}

}



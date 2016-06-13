///	<reference path="../../libs/createjs/createjs.d.ts" />

import {Component, ViewChild, Input, ElementRef} from '@angular/core';
import {AnimPreviewComponent} from "./anim-preview.component";
import {PropertiesComponent} from "./property.component";
import {ImageListComponent} from "./image-list.component";
import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";

declare function require(value:String):any;

@Component({
	selector: 'my-app',
	template: `
    <div class="app-component"  #myComponent>		
		<div class="mod-setting p-a-1">

			<!-- 拡大率 -->
			<div class="form-group row m-b-1">
				<label for="inputPassword" class="col-sm-4 form-control-label">プリセット</label>
				<div class="col-sm-8">
					<select class="c-select m-b-1" style="width:100%">
						<option value="line">LINEスタンプ</option>
						<option value="web">Webアニメ画像</option>
					</select>
				</div>
			</div>

			<properties [animationOptionData]="animationOptionData" #properties></properties>
			<hr />
			<button (click)="generateAPNG()" class="btn btn-primary center-block">アニメ画像を保存する</button>
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

	private temporaryPath:string;
	private apngPath:string;

	ngOnInit() {
		this.animationOptionData = new AnimationImageOptions();
		this.animationOptionData.compression = CompressionType.zlib;
		this.animationOptionData.iterations = 15;
		this.animationOptionData.loop = 1;
		this.animationOptionData.fps = 30;
		this.animationOptionData.noLoop = true;

		//	保存先の指定返却
		const ipc = require('electron').ipcRenderer;
		ipc.on('selected-save-image', (event:any, path:string) => {
			this._deletePNG();
			this.apngPath = path;
		});

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

	imageUpdateEvent() {
		this.animePreviewComponent.setItems(this.imageListComponent.items);
	}

	generateAPNG() {
		const complessOption = this.getCompressOption(this.animationOptionData.compression);
		console.log("--------------options------------");
		console.log("noLoop:" + this.animationOptionData.noLoop);
		console.log("loop:" + this.animationOptionData.loop);
		console.log("fps:" + this.animationOptionData.fps);
		console.log("compress:" + complessOption);
		console.log("---------------------------------");

		const ipc = require('electron').ipcRenderer;
		ipc.send('open-save-dialog');
	}

	_deletePNG() {
		const del = require('del');
		const path = require('path');
		const pngTemporary = path.join(this.temporaryPath, "*.*");
		console.log(pngTemporary);

		del([pngTemporary], {force: true}).then((paths:string[]) => {
			console.log('Deleted files and folders:\n', paths.join('\n'));

			const fs = require('fs');

			fs.mkdir(this.temporaryPath, ()=> {
				this._copyPNG();
			})
		});
	}

	_copyPNG() {

		this._copyAll()
				.then(function (results) { // 結果は配列にまとまって帰ってくる ['a', 'b', 'c']
					return results.map(function (result) {
						console.log("★★★★★★★★★★ _copyPNG (1) ★★★★★★★★★");
						console.log(result);
						return result;
					});
				})
				.then(() => {
					console.log("★★★★★★★★★★ _copyPNG (2) ★★★★★★★★★");
					this._generateAPNG();

					// if Webアニメ画像書き出しモードであれば
					this._generateWebp();
				})
				.catch(()=> {
					alert("エラーが発生しました。");
				}); // どれか一つでも失敗すれば呼ばれる

	}

	_copyAll() {

		const fs = require('fs');

		return Promise.all(this.imageListComponent.items.map((item) => {
			return new Promise((resolve, reject) => {

				const path = require('path');
				const src = item.imagePath;
				console.log(src);

				const dest = path.join(this.temporaryPath, `frame${item.frameNumber}.png`);

				console.log(dest);
				var r = fs.createReadStream(src),
					w = fs.createWriteStream(dest);
				r.on("error", function (err:any) {
					reject(err);
				});
				w.on("error", function (err:any) {
					reject(err);
				});
				w.on("close", function (ex:any) {
					resolve();
				});
				r.pipe(w);
			})
		}))
	}

	_generateAPNG() {
		const remote = require('electron').remote;
		const path = require('path');
		const app = remote.app;
		const appPath:string = app.getAppPath();

		const exec = require('child_process').execFile;
		const pngPath = path.join(this.temporaryPath, "frame*.png");

		const compressOptions = this.getCompressOption(this.animationOptionData.compression);
		const loopOption = "-l"+( this.animationOptionData.noLoop ? 0 : this.animationOptionData.loop - 1 );
		const options = [this.apngPath, pngPath, "1", this.animationOptionData.fps, compressOptions, loopOption];

		let dialog:any = document.querySelector('dialog');
		dialog.showModal();
		dialog.style["display"] = "flex"; // こんな書き方をする必要があるのか…
		createjs.Ticker.paused = true; // 効かない…

		exec(`${appPath}/bin/apngasm`, options, (err:any, stdout:any, stderr:any) => {
			/* some process */
			dialog.close();
			dialog.style["display"] = "none"; // こんな書き方をする必要があるのか…
			createjs.Ticker.paused = false; // 効かない…

			console.log(err, stdout, stderr);
			if (!err) {
				// TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
				//exec(`/Applications/Safari.app`, [this.apngPath]);

				// エクスプローラーで開くでも、まだいいかも
				const {shell} = require('electron');
				shell.showItemInFolder(this.apngPath);
			} else {
				alert("書き出し失敗");
			}
		});
	}

	/**
	 * WEBP アニメーション画像を作ります。
	 * @private
   	*/
	private _generateWebp(){

		console.log("★_generateWebp");

		const remote = require('electron').remote;
		const path = require('path');
		const app = remote.app;
		const appPath:string = app.getAppPath();

		console.log(appPath);

		const execFile = require('child_process').execFile;
		console.log(`${appPath}/bin/webpmux`);
		const pngPath = path.join(this.temporaryPath);

		const options:string[] = [];
		const frameMs = Math.round(1000 / this.animationOptionData.fps);

		const pngFiles:string[] = [];
		for(let i=0; i<this.imageListComponent.items.length; i++){
			// なんかおかしい
			options.push(`-frame`);
			options.push(`${pngPath}/frame${i}.png.webp`);
			options.push(`+${frameMs}+0+0+1`);
			pngFiles.push(`${pngPath}/frame${i}.png`);
		}
		if(this.animationOptionData.noLoop == false){
			options.push(`-loop`);
			options.push(`${this.animationOptionData.loop - 1}`);
		}
		options.push(`-o`);
		options.push(`${this.apngPath}.webp`);
		console.log("options:" + options);

		/// $ webpmux -frame 1.webp +500+0+0+0 -frame 2.webp +500+0+0+0 -frame 3.webp +500+0+0+0 -frame 4.webp +500+0+0+0 -frame 5.webp +500+0+0+0 -o animation.webp

		console.log("★ pngFiles")
		console.log(pngFiles);
		this._convertPng2Webps(pngFiles).then(()=>{
			execFile(`${appPath}/bin/webpmux`, options, (err:string, stdout:string, stderr:string) => {

				console.log(err, stdout, stderr);
				if (!err) {
				} else {
					console.error(stderr);
				}
			});
		});
	}

	private _convertPng2Webps(pngPaths:string[]):Promise<any>{
		const promises:Promise<any>[] = [];
		for(let i=0; i<pngPaths.length; i++){
			promises.push(this._convertPng2Webp(pngPaths[i]));
		}

		return new Promise(((resolve:Function, reject:Function)=>{
			Promise.race(promises).then(()=>{
				resolve();
			}).catch(()=>{
				reject();
			})
		}));
	}

	private _convertPng2Webp(filePath:string):Promise<any> {
		const remote = require('electron').remote;
		const appPath:string = remote.app.getAppPath();
		const exec = require('child_process').exec;

		return new Promise(((resolve:Function, reject:Function)=>{
			exec(`"${appPath}/bin/cwebp" "${filePath}" -o "${filePath}.webp"`,
					(err:any, stdout:any, stderr:any) => {
						console.log("cwebp コマンドの結果の出力");
						console.log(stdout);
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
	private _generateHtml(){
		// TODO
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

	openDirectories() {
		this.imageListComponent.openDirectories();
	}

}

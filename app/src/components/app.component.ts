import {Component, ViewChild, Input} from '@angular/core';
import {AnimePreviewComponent} from "./anime-preview.component";
import {PropertiesComponent} from "./property.component";
import {ImageListComponent} from "./image-list.component";
import {ImagePreviewComponent} from "./image-preview.component";
import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";

declare function require(value:String):any;

@Component({
	selector: 'my-app',
	template: `
    <div class="app-component">		
		<div class="mod-setting">			
			<properties [animationOptionData]="animationOptionData" #properties></properties>
			<button (click)="generateAPNG()" class="btn btn-primary">変換する</button>
		</div>
		
		<div class="mod-preview">
    		<image-preview></image-preview>
			<anime-preview [animationOptionData]="animationOptionData"></anime-preview>
			
			<!-- <button (click)="openDirectories()">open</button> -->
			<image-list #imageList></image-list>
		</div>
		
	</div>
  `,
	directives: [ImagePreviewComponent, AnimePreviewComponent, PropertiesComponent, ImageListComponent],
	styleUrls: ['./styles/app.css']
})
export class AppComponent {

	@Input() animationOptionData:AnimationImageOptions;
	@ViewChild("properties") propertiesComponent:PropertiesComponent;
	@ViewChild("imageList") imageListComponent:ImageListComponent;

	temporaryPath:string;
	apngPath:string;

	ngOnInit() {
		this.animationOptionData = new AnimationImageOptions();
		this.animationOptionData.compression = CompressionType.zip7;
		this.animationOptionData.iterations = 15;
		this.animationOptionData.loop = 0;

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

	generateAPNG() {
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
					console.log(result);
					return result;
				});
			})
			.then(() => {
				this._generateAPNG();
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

		console.log(appPath);

		const exec = require('child_process').execFile;
		console.log(`${appPath}/bin/apngasm`);
		const pngPath = path.join(this.temporaryPath, "frame*.png");

		exec(`${appPath}/bin/apngasm`, [this.apngPath, pngPath], function (err:any, stdout:any, stderr:any) {
			/* some process */
			console.log("apngasm");
			console.log(err, stdout, stderr);
			if (!err) {
				alert("書き出し成功!");
			} else {
				alert("書き出し失敗");
			}
		});
	}

	openDirectories() {
		this.imageListComponent.openDirectories();
	}

	constructor() {
	}
}

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
			<properties [animationOptionData]="animationOptionData" #properties></properties>
			<hr />
			<button (click)="generateAPNG()" class="btn btn-primary center-block">アニメ画像を保存する</button>
		</div>
		
		<div class="mod-preview bg-inverse p-a-1">
			<anim-preview [animationOptionData]="animationOptionData" #animePreview></anim-preview>
			
			<!-- <button (click)="openDirectories()">open</button> -->
			<image-list #imageList  (imageUpdateEvent)="imageUpdateEvent()"></image-list>
		</div>
	</div>
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
	private elementRef:ElementRef;
	private currentElement:HTMLElement;

	ngOnInit() {
		this.animationOptionData = new AnimationImageOptions();
		this.animationOptionData.compression = CompressionType.zip7;
		this.animationOptionData.iterations = 15;
		this.animationOptionData.loop = 0;
		this.animationOptionData.fps = 30;

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

		const complessOption = this.getCompressOption(this.animationOptionData.compression);
		const loopOption = "-l"+( this.animationOptionData.noLoop ? 0 : this.animationOptionData.loop );
		const options = [this.apngPath, pngPath, "1", this.animationOptionData.fps, complessOption, loopOption];
		console.log(options);

		exec(`${appPath}/bin/apngasm`, options, function (err:any, stdout:any, stderr:any) {
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

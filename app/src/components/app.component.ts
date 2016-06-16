///	<reference path="../../libs/createjs/createjs.d.ts" />

import {Component, ViewChild, Input, ElementRef} from "@angular/core";
import {AnimPreviewComponent} from "./anim-preview.component";
import {PropertiesComponent} from "./property.component";
import {AnimationImageOptions} from "../data/animation-image-options";
import {PresetType} from "../type/preset-type";
import {PresetWeb} from "../preset/preset-web";
import {PresetLine} from "../preset/preset-line";
import {ProcessExportImage} from "../process/process-export-images";
import {AppConfig} from "../config/app-config";
import {ImageData} from "../data/image-data";

declare function require(value:String):any;

@Component({
	selector: 'my-app',
	template: `
    <div class="app-component" #myComponent [ngClass]="{isDragOver : _isDragover == true}">		
		<div class="mod-setting p-a-1">

			<!-- 拡大率 -->
			<div class="form-group row m-b-1">
				<label for="inputPassword" class="col-sm-3 form-control-label">用途</label>
				<div class="col-sm-9">
					<select class="c-select m-b-1"
					        style="width:100%"
					        #optionSelecter
					        (change)="handlePresetChange($event.target.value)">
						<option value="0" [selected]="presetMode==0">LINEアニメ−ションスタンプ</option>
						<option value="1" [selected]="presetMode==1">webページ用アニメ−ション</option>
					</select>
				</div>
			</div>

			<properties [animationOptionData]="animationOptionData"></properties>
			<hr />
			<button (click)="generateAnimImage()" 
				      class="btn btn-primary-outline center-block"
				      [ngClass]="{disabled: !isImageSelected}" >
					        アニメ画像を保存する
			</button>
		</div>
		
		<div class="mod-preview bg-inverse">
			<anim-preview [animationOptionData]="animationOptionData"
			              [items]="items"
			              (clickFileSelectButtonEvent)="handleClickFileSelectButton();">
			</anim-preview>
		</div>
	</div>

	<div class="mod-statusbar bg-primary">
		<div class="container-fluid p-l-0 p-r-0">
			<div class="col-sm-6 text-sm-left">バージョン {{appConfig.version}}</div>
			<div class="col-sm-6 text-sm-right">
				<a href="https://ics.media/" target="_blank">開発会社について</a>
				<a href="https://www.facebook.com/icswebjp" target="_blank"><i class="fa fa-facebook"></i></a>
				<a href="https://twitter.com/icsweb" target="_blank"><i class="fa fa-twitter"></i></a>
				<a href="http://goo.gl/forms/5DUI1UnTUXR6AmCw2" target="_blank"><i class="fa fa-smile-o"></i></a>
			</div>
		</div>
	</div>
	
	
	<dialog style="display: none;">
		<img src="imgs/preloader.webp" width="52" height="52" />
	</dialog>
  `,
	directives: [AnimPreviewComponent, PropertiesComponent],
	styleUrls: ['./styles/component-app.css']
})
export class AppComponent {

	private get PRESET_ID():string {
		return 'preset_id';
	}

	private exportImagesProcess:ProcessExportImage;
	private isImageSelected:boolean;
	private presetMode:number;

	private openingDirectories:boolean;
	private items:ImageData[] = [];

	private appConfig:AppConfig = new AppConfig();
	private _isDragover:boolean = false;

	@Input() animationOptionData:AnimationImageOptions;

	@ViewChild("myComponent") myComponent:ElementRef;
	@ViewChild("optionSelecter") optionSelecterComponent:ElementRef;

	ngOnInit() {
		this.animationOptionData = new AnimationImageOptions();

		this.isImageSelected = false;

		this.exportImagesProcess = new ProcessExportImage();

		// 初回プリセットの設定
		this.presetMode = Number(localStorage.getItem(this.PRESET_ID));
		this.changePreset(this.presetMode);

		//	保存先の指定返却
		const ipc = require('electron').ipcRenderer;
		ipc.on('selected-save-image', (event:any, path:string) => {
			this._exportImages(path);
		});
		ipc.on('unlock-ui', (event:any) => {
			this._hideLockDialog();
		});

		ipc.on('selected-open-images', (event:any, filePathList:string[]) => {
			this._selectedImages(filePathList);
		});

		ipc.on('unlock-select-ui', (event:any, filePathList:string[]) => {
			console.log("unlockUI");
			this.openingDirectories = false;
		});
	}

	ngAfterViewInit() {

		const component = this.myComponent.nativeElement;
		component.addEventListener("dragover", (event:DragEvent)=> {
			this._isDragover = true;
			event.preventDefault();
		});

		component.addEventListener("dragout", (event:DragEvent)=> {
			this._isDragover = false;
		});

		component.addEventListener("drop", (event:DragEvent)=> {
			this._isDragover = false;
			this.handleDrop(event);
		});
	}

	private openDirectories() {
		if (this.openingDirectories) {
			return;
		}
		this.openingDirectories = true;
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-file-dialog');
	}

	private _selectedImages(filePathList:string[]) {
		this.openingDirectories = false;
		this.setFilePathList(filePathList);
	}


	private handleDrop(event:DragEvent) {
		var path = require('path');

		const length = event.dataTransfer.files ? event.dataTransfer.files.length : 0;

		//	再度アイテムがドロップされたらリセットするように調整
		this.items = [];

		for (let i = 0; i < length; i++) {
			const file:any = event.dataTransfer.files[i];
			const filePath = file.path;

			if (path.extname(filePath) == ".png") {
				path.dirname(filePath);

				const item:ImageData = new ImageData();
				item.imageBaseName = path.basename(filePath);
				item.imagePath = filePath;
				item.frameNumber = this.items.length;

				this.items.push(item);
			}
		}

		this.numbering();

		this.setItems(this.items);

		event.preventDefault();
	}


	private handlePresetChange(presetMode:string) {

		localStorage.setItem(this.PRESET_ID, presetMode);
		this.presetMode = Number(presetMode);

		this.changePreset(this.presetMode);
	}

	private changePreset(presetMode:number) {
		switch (presetMode) {
			case PresetType.LINE:
				PresetLine.setPreset(this.animationOptionData);
				break;
			case PresetType.WEB:
				PresetWeb.setPreset(this.animationOptionData);
				break;
		}
	}

	private generateAnimImage() {

		//	画像が選択されていないので保存しない。
		if (!this.isImageSelected) {
			return;
		}

		if (this.animationOptionData.enabledExportApng == false
			&& this.animationOptionData.enabledExportWebp == false) {
			alert("出力画像の形式を選択ください。");
			return;
		}


		let type = (this.animationOptionData.enabledExportWebp && !this.animationOptionData.enabledExportApng)
			? "web"
			: "line";

		const ipc = require('electron').ipcRenderer;
		ipc.send('open-save-dialog', type);
		this._showLockDialog();
	}

	private _exportImages(path:string) {
		this.exportImagesProcess.exec(path, this.items, this.animationOptionData)
			.then(() => {
				this._hideLockDialog();
			}).catch(() => {
			this._hideLockDialog();
			alert(this.exportImagesProcess.errorMessage);
		});

	}

	/**
	 * モダールダイアログを開きます。
	 * @private
	 */
	private _showLockDialog() {
		const dialog:any = document.querySelector('dialog');
		dialog.showModal();
		dialog.style["display"] = "flex"; // こんな書き方をする必要があるのか…
		document.body.style.cursor = "progress";

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
		document.body.style.cursor = "auto";

		createjs.Ticker.paused = false; // 効かない…
	}


	private handleClickFileSelectButton():void {
		if (this.openingDirectories === true) {
			return;
		}
		this.openingDirectories = true;
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-file-dialog');
	}


	private setFilePathList(filePathList:string[]):void {

		var path = require('path');

		const length = filePathList ? filePathList.length : 0;

		//	再度アイテムがドロップされたらリセットするように調整
		this.items = [];

		for (let i = 0; i < length; i++) {
			const filePath = filePathList[i];

			if (path.extname(filePath) == ".png") {
				path.dirname(filePath);

				const item:ImageData = new ImageData();
				item.imageBaseName = path.basename(filePath);
				item.imagePath = filePath;
				item.frameNumber = this.items.length;

				this.items.push(item);
			}
		}
		this.numbering();

		this.setItems(this.items);

	}

	/**
	 * 再ナンバリングする。
	 */
	private numbering():void {

		this.items.sort(function (a, b) {
			const aRes = a.imageBaseName.match(/\d+/g);
			const bRes = b.imageBaseName.match(/\d+/g);

			const aNum = aRes.length >= 1 ? parseInt(aRes.pop()) : 0;
			const bNum = bRes.length >= 1 ? parseInt(bRes.pop()) : 0;

			if (aNum < bNum) return -1;
			if (aNum > bNum) return 1;
			return 0;
		});

		const length = this.items.length;
		for (let i = 0; i < length; i++) {
			this.items[i].frameNumber = i;
		}
	}

	private setItems(items:ImageData[]):void {
		this.items = items;
		if (items.length >= 1) {
			this.checkImageSize(items[0].imagePath);
			this.animationOptionData.imageInfo.length = items.length;
		}
		this.isImageSelected = this.items.length >= 1;
	}


	private checkImageSize(path:string):void {
		let image = new Image();
		image.onload = ()=> {
			// 情報の更新
			this.animationOptionData.imageInfo.width = image.width;
			this.animationOptionData.imageInfo.height = image.height;
		};
		image.src = path;
	}
}



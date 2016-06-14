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
import {ProcessExportImage} from "../process/process-export-images";

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

	private exportImagesProcess:ProcessExportImage;
	@Input() animationOptionData:AnimationImageOptions;
	@ViewChild("properties") propertiesComponent:PropertiesComponent;
	@ViewChild("imageList") imageListComponent:ImageListComponent;
	@ViewChild("animePreview") animePreviewComponent:AnimPreviewComponent;
	@ViewChild("myComponent") myComponent:ElementRef;
	@ViewChild("optionSelecter") optionSelecterComponent:ElementRef;

	ngOnInit() {
		this.animationOptionData = new AnimationImageOptions();

		// はじめはLINEスタンプのプリセットにする
		PresetLine.setPreset(this.animationOptionData);

		this.exportImagesProcess = new ProcessExportImage();

		// TODO 前回起動時のプリセットは覚えておきたい

		//	保存先の指定返却
		const ipc = require('electron').ipcRenderer;
		ipc.on('selected-save-image', (event:any, path:string) => {
			this._exportImages(path);
		});

		ipc.on('unlock-ui', (event:any) => {
			this._hideLockDialog();
		})

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

	private _exportImages(path:string) {

		this.exportImagesProcess.exec(path, this.imageListComponent.items, this.animationOptionData).then(() => {
			this._hideLockDialog();
		}).catch(() => {
			this._hideLockDialog();
			alert("エラーが発生しました。");
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

	private openDirectories() {
		this.imageListComponent.openDirectories();
	}

}



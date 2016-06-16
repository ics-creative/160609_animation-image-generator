///<reference path="../../libs/createjs/createjs.d.ts" />

import {Component, Input, EventEmitter} from "@angular/core";
import {AnimationImageOptions} from "../data/animation-image-options";
import {ImageData} from "../data/image-data";

declare function require(value:String):any;

@Component({
	selector: 'anim-preview',
	template: `

	<div class="please-drag-here" *ngIf="items.length == 0">
		<div class="text-xs-center">
			<h4>ここに連番画像(PNG)ファイルをドロップ</h4>
			<div><small>または</small></div>
			<button class="btn btn-primary m-t-1" [ngClass]="{disabled: openingDirectories == true}" (click)="openDirectories()">ファイルを選択</button>
		</div>
	</div>

	<div class="anim-preview p-a-1" *ngIf="items.length > 0">
		<p>
		
			フレームサイズ <span class="label label-success">W {{imageW}} × H {{imageH}} px</span> 
			/ 総フレーム数 <span class="label label-success">{{items.length}}</span>
			<span *ngIf="animationOptionData.noLoop == false">
				/ 再生時間 <span class="label label-success">{{items.length * animationOptionData.loop / animationOptionData.fps}}秒</span>
			</span>
		</p>
		
		<div class="preview-area m-t-1">
			<div [ngStyle]="{ 'zoom' : scaleValue }" >
				<img data-src="{{imagePath}}">
			</div>
		
			<div class="m-t-1">
				<button class="btn btn-secondary-outline btn-sm" [ngClass]="{disabled: playing == true}" (click)="resume();"><i class="fa fa-play"></i></button>
				<button class="btn btn-secondary-outline btn-sm" [ngClass]="{disabled: playing == false}" (click)="pause();"><i class="fa fa-stop"></i></button>
				<button class="btn btn-secondary-outline btn-sm"
				 				[ngClass]="{disabled: currentFrame == 0 && currentLoopCount == 0 }"
				 				(click)="gotoAndStop(0);">
					<i class="fa fa-step-backward"></i>
				</button>
				
				<span class="m-l-1">表示倍率</span>
				<!-- 拡大率 -->
				<select class="c-select mod-zoom-select" #selectScale (change)="selectScaleValue(selectScale.value)">
					<option value="0.25">25%</option>
					<option value="0.5">50%</option>
					<option value="1.0" selected>100%</option>
					<option value="2.0">200%</option>
				</select>
				
				<button class="btn btn-secondary-outline btn-sm m-l-1" [ngClass]="{disabled: openingDirectories == true}" (click)="openDirectories()">ファイルを再選択</button>
			</div>
		</div>
		
		<p class="m-t-1">コマ画像プレビュー</p>
		<div>			
			<div *ngIf="items.length >= 1" >
				<div *ngFor="let item of items; let i = index" class="frame-image-container" [ngClass]="{active: currentFrame == i}">
					<img data-src="{{item.imagePath}}" class="frame-image img-fluid" />
				</div>
			</div>
		</div>
	</div>
  `,
	events: ["imageUpdateEvent"],
	styleUrls: ['./styles/anim-preview.css'],
})

export class AnimPreviewComponent {
	@Input() imagePath:string;
	@Input() animationOptionData:AnimationImageOptions;

	public items:ImageData[];
	private playing:boolean;
	private currentFrame:number;
	private currentLoopCount:number;
	private imageW:number;
	private imageH:number;
	private openingDirectories:boolean;
	private imageUpdateEvent = new EventEmitter();

	private scaleValue:number;

	private selectScaleValue(scaleValue:number) {
		this.scaleValue = scaleValue;
	}

	ngOnInit() {
		this.items = [];

		createjs.Ticker.framerate = this.animationOptionData.fps;
		createjs.Ticker.on("tick", this.loop, this);

		const ipc = require('electron').ipcRenderer;

		ipc.on('selected-open-images', (event:any, filePathList:string[]) => {
			this._selectedImages(filePathList);
		});

		ipc.on('unlock-select-ui', (event:any, filePathList:string[]) => {
			console.log("unlockUI");
			this.openingDirectories = false;
		});
	}

	private _selectedImages(filePathList:string[]) {
		this.openingDirectories = false;
		this.setFilePathList(filePathList);
	}

	public setItems(items:ImageData[]) {
		this.items = items;
		if (items.length >= 1) {
			this.imagePath = this.items[0].imagePath;
			this.currentFrame = 0;
			this.currentLoopCount = 0;
			this.playing = true;

			this.checkImageSize(this.imagePath);

			this.animationOptionData.imageInfo.length = items.length;
		}

		this.imageUpdateEvent.emit(null);
	}

	private updateAnimation() {

		this.currentFrame++;
		if (this.items.length <= this.currentFrame) {

			this.currentLoopCount += 1;

			// 再生ループ回数を超えたら
			if (this.currentLoopCount >= this.animationOptionData.loop) {

				if (this.animationOptionData.noLoop == false) {
					this.playing = false;
					this.currentFrame = this.items.length - 1;
				} else {
					this.currentFrame = 0;
				}
			} else {
				this.currentFrame = 0;
			}
		}
		this.imagePath = this.items[this.currentFrame].imagePath;
	}

	private loop() {
		createjs.Ticker.framerate = this.animationOptionData.fps;

		if (!this.items || !this.playing) {
			this.playing = false;
		}

		if (this.playing == true) {
			this.updateAnimation();
		}
	}

	openDirectories() {
		if (this.openingDirectories) {
			return;
		}
		this.openingDirectories = true;
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-file-dialog');
	}

	private checkImageSize(path:string):void {
		let image = new Image();
		image.onload = ()=> {
			this.imageW = image.width;
			this.imageH = image.height;

			// 情報の更新
			this.animationOptionData.imageInfo.width = image.width;
			this.animationOptionData.imageInfo.height = image.height;
		};
		image.src = path;
	}

	private resume():void {
		if (this.items) {
			this.playing = true;

			this.currentFrame = 0;
			this.currentLoopCount = 0;
		}
	}

	private pause():void {
		if (this.items) {
			this.playing = false;
		}
	}

	/**
	 * 指定したフレームにタイムラインを移動し、停止します。
	 * @param frame
	 */
	private gotoAndStop(frame:number):void{
		if (this.items) {
			this.playing = false;
			this.currentFrame = frame;
			this.currentLoopCount = 0;
		}
	}

	private setFilePathList(filePathList:string[]) {

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

	public handleDrop(event:DragEvent) {
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

	/**
	 * 再ナンバリングする。
	 */
	private numbering() {

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

}
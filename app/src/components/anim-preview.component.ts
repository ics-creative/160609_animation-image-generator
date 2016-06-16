///<reference path="../../libs/createjs/createjs.d.ts" />

import {Component, Input, EventEmitter, OnChanges} from "@angular/core";
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
			<button class="btn btn-primary m-t-1"
			        [ngClass]="{disabled: openingDirectories == true}"
			        (click)="openDirectories()">ファイルを選択</button>
		</div>
	</div>

	<div class="anim-preview p-a-1" *ngIf="items.length > 0">
		<p>
			フレームサイズ <span class="label label-success">W {{animationOptionData.imageInfo.width}} × H {{animationOptionData.imageInfo.height}} px</span> 
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
				<button class="btn btn-secondary-outline btn-sm"
				        [ngClass]="{disabled: playing == true}"
				        (click)="resume();">
					<i class="fa fa-play"></i>
				</button>
				<button class="btn btn-secondary-outline btn-sm"
				        [ngClass]="{disabled: playing == false}"
				        (click)="pause();">
					<i class="fa fa-stop"></i>
				</button>
				<button class="btn btn-secondary-outline btn-sm"
				 				[ngClass]="{disabled: currentFrame == 0 && currentLoopCount == 0 }"
				 				(click)="gotoAndStop(0);">
					<i class="fa fa-step-backward"></i>
				</button>
				
				<span class="m-l-1">表示倍率</span>
				<!-- 拡大率 -->
				<select class="c-select mod-zoom-select"
				        #selectScale
				        (change)="selectScaleValue(selectScale.value)">
					<option value="0.25">25%</option>
					<option value="0.5">50%</option>
					<option value="1.0" selected>100%</option>
					<option value="2.0">200%</option>
				</select>
				
				<button class="btn btn-secondary-outline btn-sm m-l-1" 
					[ngClass]="{disabled: openingDirectories == true}" 
						(click)="openDirectories()">ファイルを再選択</button>
			</div>
		</div>
		
		<p class="m-t-1">コマ画像プレビュー</p>
		<div>			
			<div *ngIf="items.length >= 1" >
				<div *ngFor="let item of items; let i = index"
				     class="frame-image-container"
				     [ngClass]="{active: currentFrame == i}"
				     (click)="gotoAndStop(i);"
				     >
					<img data-src="{{item.imagePath}}" class="frame-image img-fluid" />
				</div>
			</div>
		</div>
	</div>
  `,
	events: ["clickFileSelectButtonEvent"],
	styleUrls: ['./styles/anim-preview.css'],
})

export class AnimPreviewComponent implements OnChanges {
	@Input() imagePath:string;
	@Input() animationOptionData:AnimationImageOptions;
	@Input() items:ImageData[];

	/** ファイル選択ダイアログのイベントです。 */
	private clickFileSelectButtonEvent = new EventEmitter();

	private playing:boolean = false;
	private currentFrame:number = 0;
	private currentLoopCount:number = 0;
	private scaleValue:number = 1.0;

	private selectScaleValue(scaleValue:number):void {
		this.scaleValue = scaleValue;
	}

	ngOnInit() {
		createjs.Ticker.framerate = this.animationOptionData.fps;
		createjs.Ticker.on("tick", this.loop, this);
	}

	/** 値の変更時を監視するライフサイクルイベント */
	ngOnChanges() {
		console.log("AnimPreviewComponent : ngOnChanges()");

		// 要素が存在すれば、初期値を設定する
		if (this.items && this.items.length > 0) {
			this.imagePath = this.items[0].imagePath;
			this.currentFrame = 0;
			this.currentLoopCount = 0;
			this.playing = true;
		}
	}


	private openDirectories():void {
		this.clickFileSelectButtonEvent.emit(null);
	}

	private updateAnimation():void {
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

	private loop():void {
		createjs.Ticker.framerate = this.animationOptionData.fps;

		if (!this.items || !this.playing) {
			this.playing = false;
		}

		if (this.playing == true) {
			this.updateAnimation();
		}
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
	private gotoAndStop(frame:number):void {
		if (this.items) {
			this.playing = false;
			this.currentFrame = frame;
			this.currentLoopCount = 0;

			this.imagePath = this.items[this.currentFrame].imagePath;
		}
	}
}
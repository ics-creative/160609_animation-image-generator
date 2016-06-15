import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";
import {ImageData} from "../data/image-data";

///<reference path="../../libs/createjs/createjs.d.ts" />

@Component({
	selector: 'anim-preview',
	template: `

	<div class="please-drag-here" *ngIf="items.length == 0">
		<div class="text-xs-center">
			<h4>ここに連番画像(PNG)ファイルをドロップ</h4>
			<div><small>または</small></div>
			<button class="btn btn-default m-t-1">ファイルを選択</button>
		</div>
	</div>

	<div class="anim-preview p-a-1" *ngIf="items.length > 0">
		<p>アニメーションプレビュー</p>
		<figcaption class="figure-caption">
			フレームサイズ <span class="label label-default">W {{imageW}} × H {{imageH}} px</span> 
			/ 総フレーム数 <span class="label label-default">{{items.length}}</span>
			<span *ngIf="animationOptionData.noLoop == false">
				/ 再生時間 <span class="label label-default">{{items.length * animationOptionData.loop / animationOptionData.fps}}秒</span>
			</span>

			<!-- 拡大率 -->
			<select class="c-select mod-zoom-select" #selectScale>
				<option value="0.25">25%</option>
				<option value="0.5">50%</option>
				<option value="1.0" selected>100%</option>
				<option value="2.0">200%</option>
			</select>
		</figcaption>
	
		
		<div class="preview-area m-t-1">
			<div [ngStyle]="{ 'transform':'scale(' + selectScale.value + ')' }" >
				<img data-src="{{imagePath}}">
			</div>
		
			<div class="m-t-1" *ngIf="animationOptionData.noLoop == false">
				<button class="btn btn-primary btn-sm" [ngClass]="{disabled: playing == true}" (click)="resume();">再生</button>
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
	styleUrls: ['./styles/anim-preview.css'],
})

export class AnimPreviewComponent {
	@Input() imagePath:string;
	@Input() animationOptionData:AnimationImageOptions;

	private items:ImageData[];
	private playing:boolean;
	private currentFrame:number;
	private currentLoopCount:number;
	private imageW:number;
	private imageH:number;

	ngOnInit() {
		this.items = [];
		this.canvasScale = 1;

		createjs.Ticker.framerate = this.animationOptionData.fps;
		createjs.Ticker.on("tick", this.loop, this);
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

	private resume() {
		if (this.items) {
			this.playing = true;

			this.currentFrame = 0;
			this.currentLoopCount = 0;
		}
	}

}
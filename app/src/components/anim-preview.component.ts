import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";
import {ImageData} from "../data/image-data";

////<reference path="../../libs/createjs/createjs.d.ts" />

@Component({
	selector: 'anim-preview',
	template: `

	<div class="please-drag-here" *ngIf="items.length == 0">

		<p>ここに連番画像(PNG)をドラッグください</p>

	</div>

	<div class="anim-preview p-a-1" *ngIf="items.length > 0">
		<p>アニメーションプレビュー</p>
		<figcaption class="figure-caption">
			フレームサイズ <span class="label label-default">W {{imageW}} × H {{imageH}} px</span> 
			/ 総フレーム数 <span class="label label-default">{{items.length}}</span>
			<span *ngIf="animationOptionData.noLoop == false">
				/ 再生時間 <span class="label label-default">{{items.length * animationOptionData.fps * animationOptionData.loop / 1000}}秒</span>
			</span>
		</figcaption>
		
		<!-- 拡大率 -->
		<select class="c-select">
			<option value="0.25">25%</option>
			<option value="0.5">50%</option>
			<option value="1.0" selected>100%</option>
			<option value="2.0" selected>200%</option>
		</select>

		<div class="preview-area m-t-1">
			<div >
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
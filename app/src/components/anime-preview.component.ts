import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";
import {ImageData} from "../data/image-data";

@Component({
	selector: 'anime-preview',
	template: `
	<p>アニメーションプレビュー</p>
	<figcaption class="figure-caption">フレームサイズ <span class="label label-default">W {{imageW}} × H {{imageH}} px</span> / 総フレーム数 <span class="label label-default">{{items.length}}</span></figcaption>
    <div class="anim-preview m-t-1">
    	<div *ngIf="items.length <= 0" class="empty-image">
			   No Image
		</div>
    	<div *ngIf="items.length > 0">
    		<img data-src="{{imagePath}}">
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
	
  `,
	styleUrls: ['./styles/anim-preview.css'],
})

export class AnimePreviewComponent {
	@Input() imagePath:string;
	@Input() animationOptionData:AnimationImageOptions;

	private items:ImageData[];
	private playing:boolean;
	private currentFrame:number;
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
			this.animeBasetime = Date.now();
			this.playing = true;

			let image = new Image();
			image.onload = ()=>{
				this.imageW = image.width;
				this.imageH = image.height;
			};
			image.src = this.imagePath;
		}
	}

	private anime() {

		this.currentFrame++;
		if (this.items.length <= this.currentFrame) {
			this.currentFrame = 0;
		}
		this.imagePath = this.items[this.currentFrame].imagePath;

	}

	private loop() {
		createjs.Ticker.framerate = this.animationOptionData.fps;

		if (!this.items || !this.playing) {
			console.log("endloop");
			this.playing = false;
			return;
		}

		this.anime();
	}
}
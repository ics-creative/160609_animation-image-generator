import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";
import {ImageData} from "../data/image-data";

@Component({
	selector: 'anime-preview',
	template: `
    <div>
    	<h2>アニメーションプレビュー</h2>
    	<div *ngIf="items.length <= 0 " class="empty-image">
			   No Image
			</div>
    	<div *ngIf="items.length > 0 " class="exits-image">
    		<img data-src="{{imagePath}}" alt="Generic placeholder image">
    	</div>
    <div class="anim-preview">
    	<canvas width="320" height="320"></canvas>
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
	private animeBasetime:number;
	private animeFPS:number;

	ngOnInit() {
		this.items = [];

	}

	public  setItems(items:ImageData[]) {
		this.items = items;
		if (items.length >= 1) {
			this.imagePath = this.items[0].imagePath;
			this.currentFrame = 0;
			this.animeBasetime = Date.now();
			this.animeFPS = 1000 / this.animationOptionData.fps;
			this.playing = true;

			this.loop();
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
		if (!this.items || !this.playing) {
			console.log("endloop");
			this.playing = false;
			return;
		}
		const now = Date.now();
		const check = now - this.animeBasetime;
		if (check / this.animeFPS >= 1) {
			this.animeBasetime = now;
			this.anime();
		}

		requestAnimationFrame(()=> {
			this.loop();
		});
	}
}
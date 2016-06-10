import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";

@Component({
	selector: 'anime-preview',
	template: `
    <div>
    	<h2>アニメーションプレビュー</h2>
		</div>
  `
})
export class AnimePreviewComponent {
	@Input() animationOptionData:AnimationImageOptions;

}
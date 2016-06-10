import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";

@Component({
	selector: 'anime-preview',
	template: `
    <div class="anim-preview">
    	<canvas width="320" height="320"></canvas>
	</div>
  `,
	styleUrls: ['./styles/anim-preview.css'],
})

export class AnimePreviewComponent {
	@Input() animationOptionData:AnimationImageOptions;
}
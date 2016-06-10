import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";

@Component({
	selector: 'anime-preview',
	template: `
    <div class="anim-preview">
    	<canvas></canvas>
	</div>
  `,
	styleUrls: ['./styles/anim-preview.css'],
})

export class AnimePreviewComponent {
	@Input() animationOptionData:AnimationImageOptions;
}
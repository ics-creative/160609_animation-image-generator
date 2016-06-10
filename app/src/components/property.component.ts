import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";

@Component({
	selector: 'properties',
	template: `
    <div>
    	<h2>プロパティ</h2>
			
		</div>
  `
})
export class PropertiesComponent {
	@Input() animationOptionData:AnimationImageOptions;

}
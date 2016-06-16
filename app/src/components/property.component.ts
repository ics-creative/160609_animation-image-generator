import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";
import {CompressionType} from "../type/compression-type";

declare function require(value:String):any;

@Component({
	selector: 'properties',
	templateUrl: "./src/components-html/property.component.html",
	styleUrls: ['./styles/component-property.css']
})
export class PropertiesComponent {
	@Input() animationOptionData:AnimationImageOptions;
}
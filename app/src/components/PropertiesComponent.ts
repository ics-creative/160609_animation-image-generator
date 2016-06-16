import {Component, Input} from "@angular/core";
import {AnimationImageOptions} from "../data/AnimationImageOptions";

declare function require(value:String):any;

@Component({
	selector: 'properties',
	templateUrl: "./src/components-html/PropertiesComponent.html",
	styleUrls: ['./styles/component-property.css']
})

export class PropertiesComponent  {
	@Input() animationOptionData:AnimationImageOptions;
}


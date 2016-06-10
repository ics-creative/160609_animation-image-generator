import {Component, ViewChild, Input} from '@angular/core';
import {AnimePreviewComponent} from "./anime-preview.component";
import {PropertiesComponent} from "./property.component";
import {ImageListComponent} from "./image-list.component";
import {ImagePreviewComponent} from "./image-preview.component";
import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";

declare function require(value:String):any;

@Component({
	selector: 'my-app',
	template: `
    <div class="app-component">
    	<div>
			<!-- <button (click)="openDirectories()">open</button> -->
			<image-list #imageList></image-list>
		</div>
		<div>
			<image-preview></image-preview>
			<anime-preview [animationOptionData]="animationOptionData"></anime-preview>
			<properties [animationOptionData]="animationOptionData" #properties></properties>
			<button (click)="generateAPNG()" class="btn btn-primary">変換する</button>
		</div>
	</div>
  `,
	directives: [ImagePreviewComponent, AnimePreviewComponent, PropertiesComponent, ImageListComponent],
	styleUrls: ['./styles/app.css']
})
export class AppComponent {

	@Input() animationOptionData:AnimationImageOptions;
	@ViewChild("properties") propertiesComponent:PropertiesComponent;
	@ViewChild("imageList") imageListComponent:ImageListComponent;

	ngOnInit() {
		this.animationOptionData = new AnimationImageOptions();
		this.animationOptionData.compression = CompressionType.zip7;
		this.animationOptionData.iterations = 15;
		this.animationOptionData.loop = 0;
	}

	generateAPNG() {
		this.propertiesComponent.generateAPNG();
	}

	openDirectories() {
		this.imageListComponent.openDirectories();
	}

	constructor() {
	}
}

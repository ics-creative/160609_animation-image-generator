import {Component, ViewChild, Input} from '@angular/core';
import {AnimePreviewComponent} from "./anime-preview.component";
import {PropertiesComponent} from "./property.component";
import {ImageListComponent} from "./image-list.component";
import {ImagePreviewComponent} from "./image-preview.component";

declare function require(value:String):any;

@Component({
	selector: 'my-app',
	template: `
    
    <div class="app-component">
    	<div>
				<button (click)="openDirectories()">open</button>
				<image-list #imageList></image-list>
			</div>
			<div>
				<image-preview></image-preview>
				<anime-preview></anime-preview>
				<properties #properties></properties>
				<button (click)="generateAPNG()">generate apng</button>
			</div>
		</div>
    
  `,
	directives: [ImagePreviewComponent,AnimePreviewComponent, PropertiesComponent, ImageListComponent],
	styleUrls: ['./styles/app.css']
})
export class AppComponent {

	@ViewChild("properties") propertiesComponent:PropertiesComponent;
	@ViewChild("imageList") imageListComponent:ImageListComponent;

	ngOnInit() {
		this._cancelDragAndDrop();
		const ipc = require('electron').ipcRenderer;
	}

	generateAPNG() {
		this.propertiesComponent.generateAPNG();
	}

	openDirectories() {
		this.imageListComponent.openDirectories();
	}

	constructor() {
	}

	/**
	 * ドラッグ&ドロップの動作を阻止する
	 */
	private _cancelDragAndDrop() {
		document.addEventListener("dragover", (event:DragEvent)=> {
			this._handleDragOver(event);
		});

		document.addEventListener("drop", (event:DragEvent)=> {
			this._handleDrop(event);
		});
	}

	private _handleDragOver(event:DragEvent) {
		event.preventDefault();
	}

	private _handleDrop(event:DragEvent) {
		event.preventDefault();
	}
}

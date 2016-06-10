import {Component, ViewChild, Input} from '@angular/core';
import {ImageData} from '../data/image-data';

declare function require(value:String):any;

@Component({
	selector: 'image-list',
	template: `
		<div #dropArea>
			<div *ngIf="items.length <= 0 " class="drop-empty drop-area image-drop-area bg-inverse">
			    Drag to Image (*.png)
			</div>
			
			<ul *ngIf="items.length >= 1" class="list-group" >
				<li *ngFor="let item of items" class="list-group-item">
					<div class="media">
						<a class="media-left" href="#">
							<img class="media-object" data-src="..." alt="Generic placeholder image">
						</a>
						<div class="media-body">
							<p class="media-heading">{{ item.imageBaseName }}</p>
						</div>
					</div>
				</li>
			</ul>
		</div>
  `,
	styleUrls: ['./styles/item-list.css'],
})
export class ImageListComponent {

	@Input() items:ImageData[];
	@ViewChild("dropArea") dropArea;

	ngOnInit() {
		this.items = [];
	}

	openDirectories() {
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-file-dialog')
	}

	ngAfterViewInit() {
		const ipc = require('electron').ipcRenderer;
		ipc.on('selected-directory', (event:any, path:string) => {
			//this.items.push(path);
		});

		const dropAreaDivElement:HTMLDivElement = this.dropArea.nativeElement;

		dropAreaDivElement.addEventListener("dragover", (event:DragEvent)=> {
			this._handleDragOver(event);
		});

		dropAreaDivElement.addEventListener("drop", (event:DragEvent)=> {
			this._handleDrop(event);
		});

	}

	private _handleDragOver(event:DragEvent) {

		event.preventDefault();
	}

	private _handleDrop(event:DragEvent) {
		var path = require('path');

		const length = event.dataTransfer.files ? event.dataTransfer.files.length : 0;

		for (let i = 0; i < length; i++) {
			const file = event.dataTransfer.files[0];
			const filePath = file.path;
			if (path.extname(filePath) == ".png") {
				path.dirname(filePath);

				const item:ImageData = new ImageData();
				item.imageBaseName = path.basename(filePath);
				item.imagePath = filePath;
				this.items.push(item);
			}
		}

		event.preventDefault();
	}
}
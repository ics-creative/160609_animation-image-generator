import {Component, ViewChild, Input} from '@angular/core';

@Component({
	selector: 'image-list',
	template: `
    <div #dropArea class="drop-area image-drop-area" >
    	<div *ngIf="items"></div>
			<li *ngFor="let item of items">
				<div class="view">
					<label>{{ item }}</label>
				</div>
			</li>
    </div>
  `,
	styleUrls: ['./styles/item-list.css'],
})
export class ImageListComponent {

	@Input() items:string[];
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
			this.items.push(path);
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
		event.preventDefault();
	}
}
import {Component, ViewChild, Input, EventEmitter} from '@angular/core';
import {ImageData} from '../data/image-data';

declare function require(value:String):any;

@Component({
	selector: 'image-list',
	template: `
		
  `,
	styleUrls: ['./styles/item-list.css'],
	events: [
		"imageUpdateEvent"
	]
})
export class ImageListComponent {

	@Input() items:ImageData[];

	private imageUpdateEvent = new EventEmitter();

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

	}

	public handleDrop(event:DragEvent) {
		var path = require('path');

		const length = event.dataTransfer.files ? event.dataTransfer.files.length : 0;

		for (let i = 0; i < length; i++) {
			const file:any = event.dataTransfer.files[i];
			const filePath = file.path;

			if (path.extname(filePath) == ".png") {
				path.dirname(filePath);

				const item:ImageData = new ImageData();
				item.imageBaseName = path.basename(filePath);
				item.imagePath = filePath;
				item.frameNumber = this.items.length;

				this.items.push(item);
			}
		}

		this.numbering();

		this.imageUpdateEvent.emit(null);

		event.preventDefault();
	}

	/**
	 * 再ナンバリングする。
	 */
	private numbering() {

		this.items.sort(function (a, b) {
			const aRes = a.imageBaseName.match(/\d+/g);
			const bRes = b.imageBaseName.match(/\d+/g);

			const aNum = aRes.length >= 1 ? parseInt(aRes.pop()) : 0;
			const bNum = bRes.length >= 1 ? parseInt(bRes.pop()) : 0;

			if (aNum < bNum) return -1;
			if (aNum > bNum) return 1;
			return 0;
		});

		const length = this.items.length;
		for (let i = 0; i < length; i++) {
			this.items[i].frameNumber = i;
		}
	}
}
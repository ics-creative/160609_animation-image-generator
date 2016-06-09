import {Component, ViewChild, Input} from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
    <h1>連番画像からのアニメーション制作ツール</h1>
    <button (click)="openDirectories()">open</button>
    <button (click)="generateAPNG()">generate apng</button>
    <div>
			<li *ngFor="#item of items">
				<div class="view">
					<label>{{ item }} </label>
				</div>
			</li>
    </div>
  `
})
export class AppComponent {

	@Input() items:string[];

	ngOnInit() {
		this._cancelDragAndDrop();
		this.items = ["piyo", "hiyo"];

	}

	generateAPNG() {
		const exec = require('child_process').exec;
		exec('./bin/apngasm', function(err:any, stdout:any, stderr:any){
			/* some process */
			console.log(err,stdout,stderr);
		});

	}

	openDirectories() {
		const ipc = require('electron').ipcRenderer;
		ipc.send('open-file-dialog')
	}

	ngAfterViewInit() {

		const ipc = require('electron').ipcRenderer;
		ipc.on('selected-directory', (event:Event, path:String) => {
			this.items.push(path);
		});
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

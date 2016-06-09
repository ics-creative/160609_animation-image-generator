import {Component, ViewChild, Input} from '@angular/core';

declare function require(value:String): any;

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
    
    <form>
      <div>
        <label for="name">APNG</label>
        <input type="text" #apngPath>
      </div>
      <div>
        <label for="name">PNG</label>
        <input type="text" #pngPath>
      </div>
   </form>
  `
})
export class AppComponent {

	@Input() items:string[];
	@ViewChild("apngPath") apngPath;
	@ViewChild("pngPath") pngPath;

	ngOnInit() {
		this._cancelDragAndDrop();
		this.items = ["piyo", "hiyo"];

		const ipc = require('electron').ipcRenderer;
	}

	generateAPNG() {

		const remote = require('electron').remote;
		const app = remote.app;
		const path:string = app.getAppPath();

		console.log(path);

		const exec = require('child_process').execFile;
		console.log( `${path}/bin/apngasm`);
		const apngPath = this.apngPath.nativeElement.value;
		const pngPath = this.pngPath.nativeElement.value;

		exec(`${path}/bin/apngasm`, [apngPath,pngPath], function(err:any, stdout:any, stderr:any){
			/* some process */
			console.log("apngasm");
			console.log(err,stdout,stderr);
		});

		//const ipc = require('electron').ipcRenderer;
		//ipc.send('generate-apng');


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

import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";

declare function require(value:String):any;

@Component({
	selector: 'properties',
	template: `
    <div>
    	<h2>プロパティ</h2>
		
		<div>
			<label for="name">PNG</label>
			<input type="text" #pngPath>
		</div>
	</div>
  `
})
export class PropertiesComponent {
	@Input() animationOptionData:AnimationImageOptions;

	@ViewChild("pngPath") pngPath;

	ngOnInit(){

		const ipc = require('electron').ipcRenderer;
		ipc.on('selected-save-image', (event:any, path:string) => {
			this._generateAPNG(path);
		});
	}

	generateAPNG() {

		const ipc = require('electron').ipcRenderer;
		ipc.send('open-save-dialog')


	}
	_generateAPNG(apngPath){

		const remote = require('electron').remote;
		const app = remote.app;
		const path:string = app.getAppPath();

		console.log(path);

		const exec = require('child_process').execFile;
		console.log(`${path}/bin/apngasm`);
		const pngPath = this.pngPath.nativeElement.value;

		exec(`${path}/bin/apngasm`, [apngPath, pngPath], function (err:any, stdout:any, stderr:any) {
			/* some process */
			console.log("apngasm");
			console.log(err, stdout, stderr);
		});
	}
}
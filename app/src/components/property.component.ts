import {Component, ViewChild, Input} from '@angular/core';

@Component({
	selector: 'properties',
	template: `
    <div>
    	<h2>プロパティ</h2>
				
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
		</div>
  `
})
export class PropertiesComponent {

	@ViewChild("apngPath") apngPath;
	@ViewChild("pngPath") pngPath;

	generateAPNG() {

		const remote = require('electron').remote;
		const app = remote.app;
		const path:string = app.getAppPath();

		console.log(path);

		const exec = require('child_process').execFile;
		console.log(`${path}/bin/apngasm`);
		const apngPath = this.apngPath.nativeElement.value;
		const pngPath = this.pngPath.nativeElement.value;

		exec(`${path}/bin/apngasm`, [apngPath, pngPath], function (err:any, stdout:any, stderr:any) {
			/* some process */
			console.log("apngasm");
			console.log(err, stdout, stderr);
		});
	}
}
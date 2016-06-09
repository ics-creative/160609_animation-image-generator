import {Component} from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
    <h1>連番画像からのアニメーション制作ツール</h1>
    <button id="select-directory">open</button>
    <div id="selected-file"></div>
  `
})
export class AppComponent implements ngOnInit{
	ngOnInit() {
		this._cancelDragAndDrop();
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

	/**
	 * -  const ipc = require('electron').ipcRenderer;
	 +import {bootstrap} from '@angular/platform-browser-dynamic';
	 +import {Component} from '@angular/core';

	 -  const selectDirBtn = document.getElementById('select-directory')
	 -  selectDirBtn.addEventListener('click', function (event) {
-		ipc.send('open-file-dialog')
+@Component({
+	selector: 'my-app',
+	template: `
+    <h1>Hello Worldですね</h1>
+  `
 })
-
-	ipc.on('selected-directory', function (event, path) {
-		document.getElementById('selected-file').innerHTML = `You selected: ${path}`
-	});

	 */

}

import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/AppComponent'
import {enableProdMode} from "@angular/platform-browser/src/facade/lang";

// 起動コード
window.addEventListener("DOMContentLoaded", ()=> {
	// ドラッグ&ドロップの動作を阻止します。
	document.addEventListener("dragover", (event:DragEvent) => {
		event.preventDefault();
	});
	document.addEventListener("drop", (event:DragEvent) => {
		event.preventDefault();
	});

	setImmediate(()=> {
		enableProdMode();
		bootstrap(AppComponent);
	});
});

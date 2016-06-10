import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app.component'

bootstrap(AppComponent);


window.addEventListener("load", onLoad);

function onLoad(){
	_cancelDragAndDrop();
}

/**
 * ドラッグ&ドロップの動作を阻止する
 */
function _cancelDragAndDrop() {
	document.addEventListener("dragover", _handleDragOver);
	document.addEventListener("drop", _handleDrop);
}

function _handleDragOver(event:DragEvent) {
	event.preventDefault();
}


function _handleDrop(event:DragEvent) {
	event.preventDefault();
}
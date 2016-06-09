import {Component} from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
    <h1>連番画像からのアニメーション制作ツール</h1>
    <button id="select-directory">open</button>
    <div id="selected-file"></div>
  `
})
export class AppComponent {
}

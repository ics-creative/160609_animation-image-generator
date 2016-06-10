import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";

declare function require(value:String):any;

@Component({
	selector: 'properties',
	template: `
    <div>		
		<ul class="nav nav-tabs">
		  <li class="nav-item">
			<a class="nav-link active" href="#tab1" data-toggle="tab">アニメーション設定</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="#tab2" data-toggle="tab">画質設定</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="#tab3" data-toggle="tab">Another link</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="#tab4" data-toggle="tab">Disabled</a>
		  </li>
		</ul>
		
		<div id="myTabContent" class="tab-content">
			<div class="tab-pane active" id="tab1">
				<p><label>フレームレート<input type="number" value="30"></label></p>
				
				<p><label>ループ<input type="checkbox" name="riyu" value="3"></label></p>
				<p><label>ループ回数<input type="number" value="1"></label></p>
			</div>
			<div class="tab-pane" id="tab2">
				<h1>圧縮方式</h1>
				<p>zlib</p>
				<p>7zip <input type="number" value="1"></p>
				<p>zopfli <input type="number" value="1"></p>
			</div>
			<div class="tab-pane" id="tab3">
				<p>コンテンツ3</p>
			</div>
			<div class="tab-pane" id="tab4">
				<p>コンテンツ4</p>
			</div>
		</div>
	</div>
  `
})
export class PropertiesComponent {
	@Input() animationOptionData:AnimationImageOptions;
}
import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";

declare function require(value:String):any;

@Component({
	selector: 'properties',
	template: `
    <div>		
		<ul class="nav nav-tabs">
		  <li class="nav-item">
			<a class="nav-link active" href="#tab1" data-toggle="tab">Active</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="#tab2" data-toggle="tab">Link</a>
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
				<p>コンテンツ1</p>
			</div>
			<div class="tab-pane" id="tab2">
				<p>コンテンツ2</p>
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
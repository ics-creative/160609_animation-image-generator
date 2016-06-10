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
		</ul>
		
		<div id="myTabContent" class="tab-content p-x-2">
			<div class="tab-pane active" id="tab1">
				<div class="form-group row">
					<label class="col-sm-6 form-control-label">フレームレート</label>
					<div class="col-sm-6">
						<input type="number" class="form-control" [(ngModel)]="animationOptionData.fps" min="1" max="60">
					</div>
				</div>
				<div class="form-group row">
					<label for="inputPassword" class="col-sm-6 form-control-label">ループ設定</label>
					<div class="col-sm-6">
						<div class="checkbox">
							<label>
								<input type="checkbox"> 無限ループ
							</label>
						</div>
					</div>
				</div>
				
				<div class="form-group row">
					<label for="inputPassword" class="col-sm-6 form-control-label">ループ回数</label>
					<div class="col-sm-6">
						<input type="number" class="form-control" value="0" min="0">
					</div>
				</div>
			
			</div>
			<div class="tab-pane" id="tab2">
			
				<h4>最適化オプション</h4>
			
				<div class="checkbox">
					<label>
						<input type="checkbox"> PNG事前圧縮を利用
					</label>
				</div>
			
				<h4>圧縮設定</h4>
				<div class="c-inputs-stacked">
					<label class="c-input c-radio">
						<input id="radioStacked2" name="radio-stacked" type="radio">
						<span class="c-indicator"></span>
						zopfli (容量:小)
					</label>
					<label class="c-input c-radio">
						<input id="radioStacked2" name="radio-stacked" type="radio">
						<span class="c-indicator"></span>
						7zip (容量:中)
					</label>
					<label class="c-input c-radio">
						<input id="radioStacked1" name="radio-stacked" type="radio">
						<span class="c-indicator"></span>
						zlib (容量:大)
					</label>
				</div>

			</div>
		</div>
	</div>
  `
})
export class PropertiesComponent {
	@Input() animationOptionData:AnimationImageOptions;
}
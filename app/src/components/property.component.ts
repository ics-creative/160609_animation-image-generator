import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";
import {CompressionType} from "../type/compression-type";

declare function require(value:String):any;

@Component({
	selector: 'properties',
	template: `
    <div>
		<ul class="nav nav-tabs">
		  <li class="nav-item">
			<a class="nav-link active" href="#tab1" data-toggle="tab">アニメ−ション設定</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="#tab2" data-toggle="tab">画質設定</a>
		  </li>
		</ul>
		
		<div id="myTabContent" class="tab-content p-x-1 m-t-1">
			<div class="tab-pane active" id="tab1">
				
				<div class="form-group row">
					<label class="col-sm-6 form-control-label">フレームレート<br>(FPS)</label>
					<div class="col-sm-6">
						<input type="number" class="form-control" [(ngModel)]="animationOptionData.fps" min="5" max="20" *ngIf="animationOptionData.preset == 0">
						<input type="number" class="form-control" [(ngModel)]="animationOptionData.fps" min="1" max="60" *ngIf="animationOptionData.preset == 1">
					</div>
				</div>
				
				<div class="form-group row" *ngIf="animationOptionData.preset == 1">
					<label for="inputPassword" class="col-sm-6 form-control-label">ループ設定</label>
					<div class="col-sm-6">
						<div class="checkbox">
							<label>
								<input type="checkbox" class="form-control" [(ngModel)]="animationOptionData.noLoop">無限ループ
							</label>
						</div>
					</div>
				</div>
				
				<div class="form-group row" *ngIf="animationOptionData.noLoop == false">
					<label for="inputPassword" class="col-sm-6 form-control-label">ループ回数</label>
					<div class="col-sm-6">
						<input type="number" class="form-control" [(ngModel)]="animationOptionData.loop" min="1" max="4" *ngIf="animationOptionData.preset == 0">
						<input type="number" class="form-control" [(ngModel)]="animationOptionData.loop" min="1" *ngIf="animationOptionData.preset == 1">
					</div>
				</div>
			
			</div>
			<div class="tab-pane" id="tab2">
			
				<h6>最適化オプション</h6>
				
				<div class="checkbox" *ngIf="animationOptionData.preset == 1">
					<label>
						<input type="checkbox" [(ngModel)]="animationOptionData.enabledExportApng"> APNG書き出し
					</label>
				</div>
			
				<div class="checkbox">
					<label>
						<input type="checkbox" [(ngModel)]="animationOptionData.enabledPngCompress"> PNG事前圧縮を利用
					</label>
				</div>
			
				<h6>圧縮設定</h6>
				<div class="c-inputs-stacked">
					<label class="c-input c-radio">
						<input id="radioStacked2" name="radio-stacked" type="radio" (click)="animationOptionData.compression=3">
						<span class="c-indicator"></span>
						zopfli (容量:小)
					</label>
					<label class="c-input c-radio">
						<input id="radioStacked2" name="radio-stacked" type="radio" (click)="animationOptionData.compression=2">
						<span class="c-indicator"></span>
						7zip (容量:中)
					</label>
					<label class="c-input c-radio">
						<input id="radioStacked1" name="radio-stacked" type="radio"  (click)="animationOptionData.compression=1">
						<span class="c-indicator"></span>
						zlib (容量:大)
					</label>
				</div>
				
				<div *ngIf="animationOptionData.preset == 1">
					<div class="checkbox">
						<label>
							<input type="checkbox" [(ngModel)]="animationOptionData.enabledExportWebp"> WebP書き出し
						</label>
					</div>
					
					<div class="checkbox">
						<label>
							<input type="checkbox" [(ngModel)]="animationOptionData.enabledExportHtml"> HTML書き出し
						</label>
					</div>
				</div>

			</div>
		</div>
	</div>
  `
})
export class PropertiesComponent {
	@Input() animationOptionData:AnimationImageOptions;

}
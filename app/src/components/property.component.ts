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
		    <!-- ホントは a 要素を使うべきだが、ドラッグできる不都合があったので span 要素で回避。href 属性はご愛嬌で・・・ -->
			  <span class="nav-link active" href="#tab1" data-toggle="tab">アニメ−ション設定</span>
		  </li>
		  <li class="nav-item">
			  <span class="nav-link" href="#tab2" data-toggle="tab">画質設定</span>
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
					<div class="col-sm-6" >
						<div class="checkbox">
							<label>
								<input type="checkbox" [(ngModel)]="animationOptionData.noLoop"> 無限ループ
							</label>
						</div>
					</div>
				</div>
				
				<div class="form-group row" *ngIf="animationOptionData.noLoop == false">
					<label for="inputPassword" class="col-sm-6 form-control-label">ループ回数</label>
					<div class="col-sm-6" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">
						<input type="number" class="form-control" [(ngModel)]="animationOptionData.loop" min="1" max="4" *ngIf="animationOptionData.preset == 0">
						<input type="number" class="form-control" [(ngModel)]="animationOptionData.loop" min="1" *ngIf="animationOptionData.preset == 1">
					</div>
				</div>
			
			</div>
			<div class="tab-pane" id="tab2">
							
				<div class="checkbox" *ngIf="animationOptionData.preset == 1">
					<label>
						<input type="checkbox" [(ngModel)]="animationOptionData.enabledExportApng"> APNGファイル出力
					</label>
				</div>
			
				<div *ngIf="animationOptionData.enabledExportApng == true" class="card card-block">
					<div class="checkbox">
						<label>
							<input type="checkbox" [(ngModel)]="animationOptionData.enabledPngCompress"> 容量最適化
						</label>
					</div>
				
					<h6>圧縮方式</h6>
					<div class="c-inputs-stacked">
						<label class="c-input c-radio">
							<input id="radioStacked2" name="radio-stacked" type="radio" (click)="animationOptionData.compression=3" [checked]="animationOptionData.compression==3">
							<span class="c-indicator"></span>
							zopfli (容量:小)
						</label>
						<label class="c-input c-radio">
							<input id="radioStacked2" name="radio-stacked" type="radio" (click)="animationOptionData.compression=2" [checked]="animationOptionData.compression==2">
							<span class="c-indicator"></span>
							7zip (容量:中)
						</label>
						<label class="c-input c-radio">
							<input id="radioStacked1" name="radio-stacked" type="radio" (click)="animationOptionData.compression=1" [checked]="animationOptionData.compression==1">
							<span class="c-indicator"></span>
							zlib (容量:大)
						</label>
					</div>
				</div>
				
				<div *ngIf="animationOptionData.preset == 1">
					<div class="checkbox">
						<label>
							<input type="checkbox" [(ngModel)]="animationOptionData.enabledExportWebp"> WebPファイル出力
						</label>
					</div>
					
					<div *ngIf="animationOptionData.enabledExportWebp == true" class="card card-block">
					<div class="checkbox">
						<label>
							<input type="checkbox" [(ngModel)]="animationOptionData.enabledWebpCompress"> 容量最適化
						</label>
					</div>
				</div>
					
					<div class="checkbox">
						<label>
							<input type="checkbox" [(ngModel)]="animationOptionData.enabledExportHtml"> HTMLファイル出力
						</label>
					</div>
				</div>

			</div>
		</div>
	</div>
  `,
	styleUrls: ['./styles/component-property.css']
})
export class PropertiesComponent {
	@Input() animationOptionData:AnimationImageOptions;

}
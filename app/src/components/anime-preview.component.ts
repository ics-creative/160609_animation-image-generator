///<reference path="../../libs/createjs/createjs.d.ts" />

import {Component, ViewChild, Input} from '@angular/core';
import {AnimationImageOptions} from "../data/animation-image-options";
import {AfterViewInit} from '@angular/core';
import {DoCheck} from '@angular/core';

@Component({
	selector: 'anime-preview',
	template: `
    <div class="anim-preview">
    	<canvas #myCanvas width="320" height="320"></canvas>
	</div>
  `,
	styleUrls: ['./styles/anim-preview.css'],
})

export class AnimePreviewComponentt implements AfterViewInit, DoCheck {
	@Input() animationOptionData:AnimationImageOptions;

	@ViewChild("myCanvas") myCanvas:any;

	private stage:createjs.Stage;

	/** 表示生成後に発生するライフサイクルイベント */
	ngAfterViewInit() {
		// 参照をとれる
		let canvas = this.myCanvas.nativeElement;
		this.stage = new createjs.Stage(canvas);

		let shape = new createjs.Shape();
		shape.graphics.beginFill("red").drawRect(0, 0, 100, 100);
		stage.addChild(shape);

		createjs.Ticker.on("tick", this.tick, this);
	}

	/** 値の変更時を監視するライフサイクルイベント */
	ngDoCheck() {
		createjs.Ticker.framerate = 30;
	}

	private tick() {
		this.stage.update();
	}
}
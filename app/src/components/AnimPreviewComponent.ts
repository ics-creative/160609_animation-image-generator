///<reference path="../../libs/createjs/createjs.d.ts" />

import {Component, Input, EventEmitter, OnChanges} from "@angular/core";
import {AnimationImageOptions} from "../data/AnimationImageOptions";
import {ImageData} from "../data/ImageData";
import {LineStampValidator} from "../validators/LineStampValidator";
import {PresetType} from "../type/PresetType";
import {LocaleData} from "../i18n/locale-data";

declare function require(value:String):any;

@Component({
	selector: 'anim-preview',
	templateUrl: "./src/components-html/AnimPreviewComponent.html",
	events: ["clickFileSelectButtonEvent"],
	styleUrls: ['./styles/component-anim-preview.css'],
})

export class AnimPreviewComponent implements OnChanges {
	@Input() imagePath:string;
	@Input() animationOptionData:AnimationImageOptions;
	@Input() items:ImageData[];

	/** ファイル選択ダイアログのイベントです。 */
	private clickFileSelectButtonEvent = new EventEmitter();

	private playing:boolean = false;
	private currentFrame:number = 0;
	private currentLoopCount:number = 0;
	private scaleValue:number = 1.0;

	private isValidFrameSize:boolean = true;
	private isValidFrameLength:boolean = true;
	private isValidTime:boolean = true;

	constructor(private localeData:LocaleData){
	}
	
	private selectScaleValue(scaleValue:number):void {
		this.scaleValue = scaleValue;
	}

	ngOnInit() {
		createjs.Ticker.framerate = this.animationOptionData.fps;
		createjs.Ticker.on("tick", this.loop, this);
	}

	/** 値の変更時を監視するライフサイクルイベント */
	ngOnChanges() {
		// 要素が存在すれば、初期値を設定する
		if (this.items && this.items.length > 0) {
			this.imagePath = this.items[0].imagePath;
			this.currentFrame = 0;
			this.currentLoopCount = 0;
			this.playing = true;
		}
	}


	private openDirectories():void {
		this.clickFileSelectButtonEvent.emit(null);
	}

	private updateAnimation():void {
		this.currentFrame++;
		if (this.items.length <= this.currentFrame) {

			this.currentLoopCount += 1;

			// 再生ループ回数を超えたら
			if (this.currentLoopCount >= this.animationOptionData.loop) {

				if (this.animationOptionData.noLoop == false) {
					this.playing = false;
					this.currentFrame = this.items.length - 1;
				} else {
					this.currentFrame = 0;
				}
			} else {
				this.currentFrame = 0;
			}
		}
		this.imagePath = this.items[this.currentFrame].imagePath;
	}

	private loop():void {
		createjs.Ticker.framerate = this.animationOptionData.fps;

		// ここでバリデートするのは間違っていると思うが・・・・
		if (this.animationOptionData.preset == PresetType.LINE) {
			this.isValidFrameSize = LineStampValidator.validateFrameMaxSize(this.animationOptionData) && LineStampValidator.validateFrameMinSize(this.animationOptionData);
			this.isValidFrameLength = LineStampValidator.validateFrameLength(this.animationOptionData);
			this.isValidTime = LineStampValidator.validateTime(this.animationOptionData);
		} else {
			this.isValidFrameSize = true;
			this.isValidFrameLength = true;
			this.isValidTime = true;
		}


		if (!this.items || !this.playing) {
			this.playing = false;
		}

		if (this.playing == true && createjs.Ticker.paused === false) {
			this.updateAnimation();
		}
	}

	private resume():void {
		if (this.items) {
			this.playing = true;

			this.currentFrame = 0;
			this.currentLoopCount = 0;
		}
	}

	private pause():void {
		if (this.items) {
			this.playing = false;
		}
	}

	/**
	 * 指定したフレームにタイムラインを移動し、停止します。
	 * @param frame
	 */
	private gotoAndStop(frame:number):void {
		if (this.items) {
			this.playing = false;
			this.currentFrame = frame;
			this.currentLoopCount = 0;

			this.imagePath = this.items[this.currentFrame].imagePath;
		}
	}

	private check():boolean {
		return false;
	}
}
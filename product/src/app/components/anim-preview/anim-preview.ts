/// <reference path="../../../../node_modules/@types/createjs/index.d.ts" />
/// <reference path="../../../../node_modules/@types/jquery/index.d.ts" />

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { LineStampValidator } from '../../validators/LineStampValidator';
import { LocaleData } from '../../i18n/locale-data';
import { PresetType } from '../../../../common-src/type/PresetType';
import { ImageData } from '../../../../common-src/data/image-data';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';

declare function require(value: String): any;

@Component({
  selector: 'anim-preview',
  templateUrl: './anim-preview.html',
  styleUrls: ['./anim-preview.scss']
})
/**
 * アニメーションのプレビュー領域のコンポーネントです。
 */
export class AnimPreviewComponent implements OnChanges, OnInit {
  @Input()
  imagePath: string;

  @Input()
  animationOptionData: AnimationImageOptions;

  @Input()
  items: ImageData[];

  /** ファイル選択ダイアログのイベントです。 */
  @Output()
  public clickFileSelectButtonEvent = new EventEmitter();

  private playing = false;
  private currentFrame = 0;
  private currentLoopCount = 0;
  private scaleValue = 1.0;

  private isValidFrameSize = true;
  private isValidFrameLength = true;
  private isValidTime = true;

  private cacheClearStamp = '';

  constructor(private localeData: LocaleData) {}

  private selectScaleValue(scaleValue: number): void {
    this.scaleValue = scaleValue;
  }

  ngOnInit() {
    createjs.Ticker.framerate = this.animationOptionData.fps;
    createjs.Ticker.on('tick', this.loop, this);
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

    this.cacheClearStamp = Date.now() + '';
  }

  private openDirectories(): void {
    this.clickFileSelectButtonEvent.emit(null);
  }

  private updateAnimation(): void {
    this.currentFrame++;
    if (this.items.length <= this.currentFrame) {
      this.currentLoopCount += 1;

      // 再生ループ回数を超えたら
      if (this.currentLoopCount >= this.animationOptionData.loop) {
        if (this.animationOptionData.noLoop === false) {
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

  private loop(): void {
    createjs.Ticker.framerate = this.animationOptionData.fps;

    // ここでバリデートするのは間違っていると思うが・・・・
    if (this.animationOptionData.preset === PresetType.LINE) {
      this.isValidFrameSize =
        LineStampValidator.validateFrameMaxSize(this.animationOptionData) &&
        LineStampValidator.validateFrameMinSize(this.animationOptionData);
      this.isValidFrameLength = LineStampValidator.validateFrameLength(
        this.animationOptionData
      );
      this.isValidTime = LineStampValidator.validateTime(
        this.animationOptionData
      );
    } else {
      this.isValidFrameSize = true;
      this.isValidFrameLength = true;
      this.isValidTime = true;
    }

    if (!this.items || !this.playing) {
      this.playing = false;
    }

    if (this.playing === true && createjs.Ticker.paused === false) {
      this.updateAnimation();
    }
  }

  private resume(): void {
    if (this.items) {
      this.playing = true;

      this.currentFrame = 0;
      this.currentLoopCount = 0;
    }
  }

  private pause(): void {
    if (this.items) {
      this.playing = false;
    }
  }

  /**
   * 指定したフレームにタイムラインを移動し、停止します。
   * @param frame
   */
  private gotoAndStop(frame: number): void {
    if (this.items) {
      this.playing = false;
      this.currentFrame = frame;
      this.currentLoopCount = 0;

      this.imagePath = this.items[this.currentFrame].imagePath;
    }
  }

  private check(): boolean {
    return false;
  }
}

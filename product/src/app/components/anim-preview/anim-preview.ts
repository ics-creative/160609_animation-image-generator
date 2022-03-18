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
import { PresetType } from '../../../../common-src/type/PresetType';
import { ImageData } from '../../../../common-src/data/image-data';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import {
  validateLineStamp,
  validateLineStampNoError
} from '../../../../common-src/validators/validateLineStamp';
import { localeData } from 'app/i18n/locale-manager';
import { ImageValidatorResult } from '../../../../common-src/type/ImageValidator';
import { LineValidationType } from '../../../../common-src/type/LineValidationType';

@Component({
  selector: 'app-anim-preview',
  templateUrl: './anim-preview.html',
  styleUrls: ['./anim-preview.scss']
})
/**
 * アニメーションのプレビュー領域のコンポーネントです。
 */
export class AnimPreviewComponent implements OnChanges, OnInit {
  @Input()
  animationOptionData = new AnimationImageOptions();

  @Input()
  items: ImageData[] = [];

  @Input()
  openingDirectories = false;

  /** ファイル選択ダイアログのイベントです。 */
  @Output()
  public clickFileSelectButtonEvent = new EventEmitter();

  imagePath = '';
  playing = false;
  currentFrame = 0;
  currentLoopCount = 0;
  scaleValue = 1.0;
  validationErrors: ImageValidatorResult = validateLineStampNoError();
  cacheClearStamp = '';
  localeData = localeData;

  constructor() {}

  selectScaleValue(scaleValue: string): void {
    this.scaleValue = Number(scaleValue);
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

  openDirectories(): void {
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
      // TODO: バリデーションの種類をUIで指定できるようにする
      this.validationErrors = validateLineStamp(LineValidationType.ANIMATION_STAMP, this.animationOptionData);
    } else {
      this.validationErrors = validateLineStampNoError();
    }

    if (!this.items || !this.playing) {
      this.playing = false;
    }

    if (this.playing === true && createjs.Ticker.paused === false) {
      this.updateAnimation();
    }
  }

  resume(): void {
    if (this.items) {
      this.playing = true;

      this.currentFrame = 0;
      this.currentLoopCount = 0;
    }
  }

  pause(): void {
    if (this.items) {
      this.playing = false;
    }
  }

  /**
   * 指定したフレームにタイムラインを移動し、停止します。
   *
   * @param frame
   */
  gotoAndStop(frame: number): void {
    if (this.items) {
      this.playing = false;
      this.currentFrame = frame;
      this.currentLoopCount = 0;

      this.imagePath = this.items[this.currentFrame].imagePath;
    }
  }
}

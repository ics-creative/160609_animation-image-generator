import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { localeData } from 'app/i18n/locale-manager';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { CompressionType } from '../../../../common-src/type/CompressionType';
import { ImageExportMode } from '../../../../common-src/type/ImageExportMode';
import { Tooltip } from '../../../../common-src/type/TooltipType';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.html',
  styleUrls: ['./properties.scss']
})
/**
 * 画面左側のプロパティー領域のコンポーネントです。
 */
export class PropertiesComponent {
  @Input()
  animationOptionData = new AnimationImageOptions();

  @Output()
  buttonPos = new EventEmitter<{ x: number; y: number }>();

  @Output()
  showTooltipEvent = new EventEmitter<Tooltip>();

  @Output()
  changeAnimationOptionEvent = new EventEmitter<AnimationImageOptions>();

  @ViewChild('tooltipOptimizeElement')
  tooltipOptimizeElement: ElementRef | undefined;

  @ViewChild('tooltipCompressionElement')
  tooltipCompressionElement: ElementRef | undefined;

  @ViewChild('tooltipOptimizeWebPElement')
  tooltipOptimizeWebPElement: ElementRef | undefined;

  // クラス名を.html内から使用できるようにする
  ImageExportMode = ImageExportMode;
  CompressionType = CompressionType;

  localeData = localeData;

  constructor() {}

  avoidBlankLoopNum() {
    // ループ回数が0やnull、負数の場合は1に補正
    if (!(this.animationOptionData.loop > 0)) {
      this.animationOptionData.loop = 1;
    }
  }

  avoidBlankFpsNum() {
    // FPS回数が0やnull、負数の場合は1に補正
    if (!(this.animationOptionData.fps > 0)) {
      this.animationOptionData.fps = 1;
    }
  }

  showTooltipOptimize() {
    this.showTooltipEvent.emit(Tooltip.OPTIMIZE);
    this.buttonPos.emit({
      x: this.tooltipOptimizeElement?.nativeElement.getBoundingClientRect().x,
      y: this.tooltipOptimizeElement?.nativeElement.getBoundingClientRect().y
    });
  }

  showTooltipCompression() {
    this.showTooltipEvent.emit(Tooltip.COMPRESSION);
    this.buttonPos.emit({
      x: this.tooltipCompressionElement?.nativeElement.getBoundingClientRect()
        .x,
      y: this.tooltipCompressionElement?.nativeElement.getBoundingClientRect().y
    });
  }

  showTooltipOptimizeWebP() {
    this.showTooltipEvent.emit(Tooltip.OPTIMIZE);
    this.buttonPos.emit({
      x: this.tooltipOptimizeWebPElement?.nativeElement.getBoundingClientRect()
        .x,
      y: this.tooltipOptimizeWebPElement?.nativeElement.getBoundingClientRect()
        .y
    });
  }

  changeAnimationOption() {
    this.changeAnimationOptionEvent.emit(this.animationOptionData);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { localeData } from 'app/i18n/locale-manager';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { CompressionType } from '../../../../common-src/type/CompressionType';
import { PresetType } from '../../../../common-src/type/PresetType';
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
  showTooltipEvent = new EventEmitter<Tooltip>();

  PresetType = PresetType;
  CompressionType = CompressionType;
  localeData = localeData;

  constructor() {}

  avoidBlankLoopNum() {
    // ループ回数が0やnullの場合は1に補正
    if (!this.animationOptionData.loop) {
      this.animationOptionData.loop = 1;
    }
  }

  showTooltip() {
    this.showTooltipEvent.emit(Tooltip.OPTIMISE);
  }
}

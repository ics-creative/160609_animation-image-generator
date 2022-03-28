import {Component, EventEmitter, Input, Output} from '@angular/core';
import { localeData } from 'app/i18n/locale-manager';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { CompressionType } from '../../../../common-src/type/CompressionType';
import { PresetType } from '../../../../common-src/type/PresetType';

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
  showTooltipEvent = new EventEmitter<string>()

  PresetType = PresetType;
  CompressionType = CompressionType;
  localeData = localeData;

  constructor() {}

  showTooltip(){
    console.log("showTooltip")
    this.showTooltipEvent.emit("optimise")
  }
}

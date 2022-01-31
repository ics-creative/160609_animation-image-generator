import { Component, Input } from '@angular/core';
import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { PresetType } from '../../../../common-src/type/PresetType';
import { LocaleData } from '../../i18n/locale-data';

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
  animationOptionData: AnimationImageOptions;

  PresetType = PresetType;

  constructor(public localeData: LocaleData) {}
}

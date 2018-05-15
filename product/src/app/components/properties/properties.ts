import { Component, Input } from '@angular/core';
import { AnimationImageOptions } from '../../data/animation-image-option';
import { LocaleData } from '../../i18n/locale-data';

@Component({
  selector: 'properties',
  templateUrl: './properties.html',
  styleUrls: ['./properties.scss']
})
/**
 * 画面左側のプロパティー領域のコンポーネントです。
 */
export class PropertiesComponent {
  @Input() animationOptionData: AnimationImageOptions;

  constructor(public localeData: LocaleData) {}
}

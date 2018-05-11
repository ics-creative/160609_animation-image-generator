import { Component, Input } from '@angular/core';
import { AnimationImageOptions } from '../../data/animation-image-option';
import { LocaleData } from '../../i18n/locale-data';

declare function require(value: String): any;

@Component({
  selector: 'properties',
  templateUrl: './properties.html',
  styleUrls: ['./properties.css']
})
export class PropertiesComponent {
  @Input() animationOptionData: AnimationImageOptions;

  constructor(public localeData: LocaleData) {}
}

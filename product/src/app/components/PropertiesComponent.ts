import { Component, Input } from '@angular/core';
import { AnimationImageOptions } from '../data/AnimationImageOptions';
import { LocaleData } from '../i18n/locale-data';

declare function require(value: String): any;

@Component({
  selector: 'properties',
  templateUrl: '../components-html/PropertiesComponent.html',
  styleUrls: ['../../assets/styles/component-property.css']
})
export class PropertiesComponent {
  @Input() animationOptionData: AnimationImageOptions;

  constructor(public localeData: LocaleData) {}
}

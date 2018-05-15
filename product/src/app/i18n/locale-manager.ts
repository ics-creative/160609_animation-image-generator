import { LocaleData } from './locale-data';
import { LocaleJaData } from './locale-ja';
import { LocaleEnData } from './locale-en';

/**
 * 言語を切り替える機能を有したクラスです。
 */
export class LocaleManager {
  public applyClientLocale(localeData: LocaleData): void {
    const locale = this.checkLocale();
    let lData: LocaleData;

    switch (locale) {
      case 'ja':
        lData = new LocaleJaData();
        break;
      case 'en':
      default:
        lData = new LocaleEnData();
        break;
    }
    this.changeLocale(localeData, lData);
  }

  public checkLocale(): string {
    const ua = window.navigator.userAgent.toLowerCase();
    const nav = <any>navigator;
    try {
      // chrome
      if (ua.indexOf('chrome') !== -1) {
        return (nav.browserLanguage || nav.language || nav.userLanguage).substr(
          0,
          2
        );
      } else {
        return (nav.browserLanguage || nav.language || nav.userLanguage).substr(
          0,
          2
        );
      }
    } catch (e) {
      return undefined;
    }
  }

  public changeLocale(master: LocaleData, selectedLocale: LocaleData): void {
    for (const key in selectedLocale) {
      if (Reflect.has(selectedLocale, key) === true) {
        const val: any = <any>Reflect.get(selectedLocale, key);
        Reflect.set(master, key, val);
      }
    }
  }
}

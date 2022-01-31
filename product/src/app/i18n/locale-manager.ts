import { LocaleData } from './locale-data';
import { LocaleJaData } from './locale-ja';
import { LocaleEnData } from './locale-en';

/**
 * ユーザーの言語を判定します。
 * 日本語(ja)以外の場合はすべて英語(en)と判定します
 */
const getLocale = (): 'ja' | 'en' => {
  const nav = navigator;
  return nav.language.startsWith('ja') ? 'ja' : 'en';
};

/**
 * 言語を切り替える機能を有したクラスです。
 */
export class LocaleManager {
  public applyClientLocale(localeData: LocaleData): void {
    const lData = getLocale() === 'ja' ? new LocaleJaData() : new LocaleEnData();
    this.changeLocale(localeData, lData);
  }

  private changeLocale(master: LocaleData, selectedLocale: LocaleData): void {
    // TODO: 言語マスタの適用はもっと簡略化＆型安全にする
    for (const key in selectedLocale) {
      if (Reflect.has(selectedLocale, key) === true) {
        const val = Reflect.get(selectedLocale, key);
        if (typeof val === 'string') {
          Reflect.set(master, key, val);
        }
      }
    }
  }
}

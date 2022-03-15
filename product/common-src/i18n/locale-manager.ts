import { ILocaleData } from './locale-data.interface';
import { localeDataEn } from './localeDataEn';
import { localeDataJa } from './localeDataJa';

let data: ILocaleData = localeDataEn;

/**
 * メッセージの言語を切り替えます。デフォルトは英語です。
 * ※ このモジュールはsrc-commonにあるため、メインとレンダラーの両プロセスから利用できますが
 *   setLangはそれぞれのプロセスから行う必要があります
 *
 * @param lang 
 */
export const setLang = (lang: 'ja' | 'en') => {
  data = lang === 'ja' ? localeDataJa : localeDataEn;
}

/**
 * メッセージ定義を取得します。メッセージの言語を切り替えるにはsetLangを使用します。
 */
export const getLocaleData = () => data;
import { localeDataFor } from "../../../common-src/i18n/getLocaleData";

/**
 * ユーザーの言語を判定します。
 * 日本語(ja)以外の場合はすべて英語(en)と判定します
 */
const getLocale = (): 'ja' | 'en' => {
  const nav = navigator;
  return nav.language.startsWith('ja') ? 'ja' : 'en';
};

export const localeData = localeDataFor(getLocale())

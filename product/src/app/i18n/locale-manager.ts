import { getLocaleData, setLang } from "../../../common-src/i18n/locale-manager";

// レンダラープロセス側でメッセージ定義の言語を切り替えるモジュールです
// レンダラー側では初期化時点で言語が取得できるため、メッセージ定義は静的に参照できます。

/**
 * ユーザーの言語を判定します。
 * 日本語(ja)以外の場合はすべて英語(en)と判定します
 */
const getLocale = (): 'ja' | 'en' => {
  const nav = navigator;
  return nav.language.startsWith('ja') ? 'ja' : 'en';
};

setLang(getLocale())
export const localeData = getLocaleData()

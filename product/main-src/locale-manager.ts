import { app } from 'electron';
import { getLocaleData, setLang } from '../common-src/i18n/locale-manager';

// メインプロセス側でメッセージ定義の言語を切り替えるモジュールです
// メインプロセスではアプリの初期化完了までは言語設定を取得できないため、
// メッセージ定義は関数として提供されます。
// 初期化完了前にアクセスするとフォールバックとして英語メッセージを返します。

//  初期化が完了した時の処理
app.on('ready', () => {
  const lang = app.getLocale().startsWith('ja') ? 'ja' : 'en';
  setLang(lang)
});

/**
 * ローカライズされたメッセージデータを返します。
 * electronアプリの初期化完了(ready)前に呼び出された場合はフォールバックとして英語メッセージを返します
 */
export const localeData = () => getLocaleData();

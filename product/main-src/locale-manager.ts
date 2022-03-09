import { app } from 'electron';
import { localeDataFor } from '../common-src/i18n/getLocaleData';

let data = localeDataFor('en');

//  初期化が完了した時の処理
app.on('ready', () => {
  const lang = app.getLocale().startsWith('ja') ? 'ja' : 'en';
  data = localeDataFor(lang);
});

/**
 * ローカライズされたメッセージデータを返します。
 * electronアプリの初期化完了(ready)前に呼び出された場合はフォールバックとして英語メッセージを返します
 */
export const localeData = () => data;

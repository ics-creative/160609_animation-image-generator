const version = '3.0'
/**
 * アプリケーションの情報を提供します。
 */
export const AppConfig = {
  /** アプリケーションのバージョン番号を示します。 */
  version: version,
  /** アナリティクス用のバージョン表記です。 */
  analyticsUrl: `https://ics-web.jp/projects/animation-image-tool/?v=${version}`,
  /** （ローカライズされていない）アプリケーション名です */
  appName: 'Animation Image Converter'
} as const;

/**
 * 画像出力方法を定義したENUMです。
 */
export enum ImageExportMode {
  LINE = 'line',
  WEB = 'web'
}

/** 画像出力方法名とID(number)の対応表 */
const IMAGE_EXPORT_MODE_NUM = {
  [ImageExportMode.LINE]: 0,
  [ImageExportMode.WEB]: 1
} as const;

/**
 * 数値を画像出力方法名に変換します。
 * この機能は画像出力方法をnumber型で入出力する古い機能との互換性確保のために残されています。
 * 必要な場合のみ使用してください。
 *
 * @param num
 * @returns
 */
export const numberToMode = (num: number) => {
  if (num === IMAGE_EXPORT_MODE_NUM[ImageExportMode.LINE]) return ImageExportMode.LINE;
  if (num === IMAGE_EXPORT_MODE_NUM[ImageExportMode.WEB]) return ImageExportMode.WEB;
  return undefined;
};

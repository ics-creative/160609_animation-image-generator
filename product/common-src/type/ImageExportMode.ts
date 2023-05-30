/**
 * プリセットオプションを定義したENUMです。
 */
export enum ImageExportMode {
  LINE = 'line',
  WEB = 'web'
}

/** Preset名とID(number)の対応表 */
const PRESET_NUM = {
  [ImageExportMode.LINE]: 0,
  [ImageExportMode.WEB]: 1
} as const;

/**
 * presetを数値に変換します。
 * この機能はpresetをnumber型で入出力する古い機能との互換性確保のために残されています。
 * 必要な場合のみ使用してください。
 *
 * @param preset
 */
export const presetToNumber = (preset: ImageExportMode) => PRESET_NUM[preset];

/**
 * 数値をpreset名に変換します。
 * この機能はpresetをnumber型で入出力する古い機能との互換性確保のために残されています。
 * 必要な場合のみ使用してください。
 *
 * @param presetNum
 * @returns
 */
export const numberToPreset = (presetNum: number) => {
  if (presetNum === PRESET_NUM[ImageExportMode.LINE]) return ImageExportMode.LINE;
  if (presetNum === PRESET_NUM[ImageExportMode.WEB]) return ImageExportMode.WEB;
  return undefined;
};

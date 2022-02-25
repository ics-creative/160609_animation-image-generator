/**
 * プリセットオプションを定義したENUMです。
 */
export enum PresetType {
  LINE = 'line',
  WEB = 'web'
}

/** Preset名とID(number)の対応表 */
const PRESET_NUM = {
  [PresetType.LINE]: 0,
  [PresetType.WEB]: 1
} as const;

/**
 * presetを数値に変換します。
 * この機能はpresetをnumber型で入出力する古い機能との互換性確保のために残されています。
 * 必要な場合のみ使用してください。
 *
 * @param preset
 */
export const presetToNumber = (preset: PresetType) => PRESET_NUM[preset];

/**
 * 数値をpreset名に変換します。
 * この機能はpresetをnumber型で入出力する古い機能との互換性確保のために残されています。
 * 必要な場合のみ使用してください。
 *
 * @param presetNum
 * @returns
 */
export const numberToPreset = (presetNum: number) => {
  if (presetNum === PRESET_NUM[PresetType.LINE]) return PresetType.LINE;
  if (presetNum === PRESET_NUM[PresetType.WEB]) return PresetType.WEB;
  return undefined;
};

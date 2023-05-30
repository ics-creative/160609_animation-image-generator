import {
  ImageExportMode,
  numberToPreset,
  presetToNumber
} from '../../../../common-src/type/ImageExportMode';

const PRESET_ID = 'preset_id';
export const loadPresetConfig = (): ImageExportMode => {
  const presetNum = Number(localStorage.getItem(PRESET_ID));
  return numberToPreset(presetNum) ?? ImageExportMode.LINE;
};
export const savePresetConfig = (preset: ImageExportMode) => {
  localStorage.setItem(PRESET_ID, String(presetToNumber(preset)));
};

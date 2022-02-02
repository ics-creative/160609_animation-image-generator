import {
  PresetType,
  numberToPreset,
  presetToNumber
} from '../../../../common-src/type/PresetType';

const PRESET_ID = 'preset_id';
export const loadPresetConfig = (): PresetType => {
  const presetNum = Number(localStorage.getItem(PRESET_ID));
  return numberToPreset(presetNum) ?? PresetType.LINE;
};
export const savePresetConfig = (preset: PresetType) => {
  localStorage.setItem(PRESET_ID, String(presetToNumber(preset)));
};

import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import {
  ImageExportMode,
  numberToPreset,
  presetToNumber
} from '../../../../common-src/type/ImageExportMode';

const PRESET_ID = 'preset_id';
export const loadImageExportMode = (): ImageExportMode => {
  const presetNum = Number(localStorage.getItem(PRESET_ID));
  return numberToPreset(presetNum) ?? ImageExportMode.LINE;
};
export const saveImageExportMode = (preset: ImageExportMode) => {
  localStorage.setItem(PRESET_ID, String(presetToNumber(preset)));
};

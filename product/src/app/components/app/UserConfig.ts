import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import {
  ImageExportMode,
  numberToMode,
  modeToNumber
} from '../../../../common-src/type/ImageExportMode';

const IMAGE_EXPORT_MODE = 'preset_id';
export const loadImageExportMode = (): ImageExportMode => {
  const presetNum = Number(localStorage.getItem(IMAGE_EXPORT_MODE));
  return numberToMode(presetNum) ?? ImageExportMode.LINE;
};
export const saveImageExportMode = (mode: ImageExportMode) => {
  localStorage.setItem(IMAGE_EXPORT_MODE, String(modeToNumber(mode)));
};

export const loadAnimationImageOptions = (imageExportMode: ImageExportMode) => {
  const value = localStorage.getItem(imageExportMode);
  return value ? JSON.parse(value) : undefined;
};

export const saveAnimationImageOptions = (data: AnimationImageOptions) => {
  localStorage.setItem(data.imageExportMode, JSON.stringify(data));
};

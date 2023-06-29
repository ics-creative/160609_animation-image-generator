import { AnimationImageOptions } from '../data/animation-image-option';
import { CompressionType } from '../type/CompressionType';
import { ImageExportMode } from '../type/ImageExportMode';
import { LineValidationType } from '../type/LineValidationType';

/**
 * LINEアニメーションスタンプのプリセット設定です。
 */
export class PresetLine {

  static getPresetVer1() {
    return {
      animationOption: PresetLine.getAnimationOptionVer1(),
      lineValidationType: LineValidationType.ANIMATION_STAMP,
    }
  }
  
  static getAnimationOptionVer1() {
    const data = new AnimationImageOptions();
    data.noLoop = false;
    data.loop = 4;
    // data.iterations = 15;
    data.fps = 20;
    data.compression = CompressionType.zlib;
    data.enabledPngCompress = true;

    data.enabledExportApng = true;
    data.enabledExportWebp = false;
    data.enabledExportHtml = false;

    data.imageExportMode = ImageExportMode.LINE;
    return data;
  }
}

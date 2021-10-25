import { AnimationImageOptions } from '../data/animation-image-option';
import { CompressionType } from '../type/CompressionType';
import { PresetType } from '../type/PresetType';

/**
 * LINEアニメーションスタンプのプリセット設定です。
 */
export class PresetLine {
  static setPreset(data: AnimationImageOptions) {
    data.noLoop = false;
    data.loop = 4;
    // data.iterations = 15;
    data.fps = 20;
    data.compression = CompressionType.zlib;
    data.enabledPngCompress = true;

    data.enabledExportApng = true;
    data.enabledExportWebp = false;
    data.enabledExportHtml = false;

    data.preset = PresetType.LINE;
  }
}

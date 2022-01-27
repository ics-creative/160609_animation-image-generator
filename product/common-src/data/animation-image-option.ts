import { CompressionType } from '../type/CompressionType';
import { PresetType } from '../type/PresetType';

/**
 * アニメーション画像のオプション指定を指定するクラスです。
 */
export class AnimationImageOptions {
  preset: PresetType = PresetType.WEB;

  noLoop = false;
  loop = 0;
  compression: CompressionType = CompressionType.zlib;
  fps = 30;
  enabledPngCompress = false;
  enabledWebpCompress = false;

  enabledExportApng = false;
  enabledExportWebp = false;
  enabledExportHtml = false;

  /** 画像の情報です。 */
  imageInfo = { 
    width: 0,
    height: 0,
    length: 0
  };
}

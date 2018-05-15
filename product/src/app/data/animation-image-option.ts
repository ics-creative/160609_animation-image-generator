import { CompressionType } from '../type/CompressionType';
import { PresetType } from '../type/PresetType';

/**
 * アニメーション画像のオプション指定を指定するクラスです。
 */
export class AnimationImageOptions {
  preset: PresetType;

  noLoop: boolean;
  loop: number;
  compression: CompressionType;

  iterations: number;
  fps: number;
  enabledPngCompress: boolean;
  enabledWebpCompress: boolean;

  enabledExportApng: boolean;
  enabledExportWebp: boolean;
  enabledExportHtml: boolean;

  /** 画像の情報です。 */
  imageInfo: { width: number; height: number; length: number } = {
    width: 0,
    height: 0,
    length: 0
  };
}

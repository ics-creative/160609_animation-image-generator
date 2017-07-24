import {CompressionType} from '../type/CompressionType';
import {AnimationImageOptions} from '../data/AnimationImageOptions';
import {PresetType} from '../type/PresetType';

/**
 * Webページ用アニメーションのプリセット設定です。
 */
export class PresetWeb {

	static setPreset(data: AnimationImageOptions) {
		data.noLoop = true;
		data.loop = 4;
		data.fps = 30;
		data.compression = CompressionType.zlib;
		data.enabledPngCompress = false;
		data.enabledWebpCompress = false;

		data.enabledExportApng = true;
		data.enabledExportWebp = true;
		data.enabledExportHtml = true;

		data.preset = PresetType.WEB;
	}
}

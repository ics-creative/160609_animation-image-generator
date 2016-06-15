import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";
import {PresetType} from "../type/preset-type";

export class PresetWeb {

	static setPreset(data:AnimationImageOptions) {
		data.noLoop = true;
		//data.loop = 1;
		//data.iterations = 15;
		data.fps = 30;
		data.compression = CompressionType.zip7;
		data.enabledPngCompress = true;

		data.enabledExportApng = true;
		data.enabledExportWebp = true;
		data.enabledExportHtml = true;

		data.preset = PresetType.WEB;
	}
}
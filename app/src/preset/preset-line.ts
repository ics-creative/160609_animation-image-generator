import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";
import {PresetType} from "../type/preset-type";

export class PresetLine {

	static setPreset(data:AnimationImageOptions) {
		//data.noLoop = false;
		//data.loop = 1;
		//data.iterations = 15;
		//data.fps = 15;
		data.compression = CompressionType.zip7;
		data.pngCompress = true;

		data.enabledExportApng = true;
		data.enabledExportWebp = false;
		data.enabledExportHtml = false;

		data.preset = PresetType.LINE;

	}
}
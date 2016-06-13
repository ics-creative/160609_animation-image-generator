import {CompressionType} from "../type/compression-type";
import {AnimationImageOptions} from "../data/animation-image-options";

export class PresetLine {

	static setPreset(data:AnimationImageOptions) {
		//data.noLoop = false;
		//data.loop = 1;
		//data.iterations = 15;
		//data.fps = 15;
		data.compression = CompressionType.zip7;
		data.pngCompress = true;

		data.exportAPNG = true;
		data.exportWebP = false;
		data.exportHTML = false;

	}
}
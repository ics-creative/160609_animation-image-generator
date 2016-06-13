import {CompressionType} from "../type/compression-type";
import {PresetType} from "../type/preset-type";

export class AnimationImageOptions {

	preset:PresetType;

	noLoop:boolean;
	loop:number;
	compression:CompressionType;
	iterations:number;
	fps:number;
	enabledPngCompress:boolean;

	enabledExportApng:boolean;
	enabledExportWebp:boolean;
	enabledExportHtml:boolean;

	/** 画像の情報です。 */
	imageInfo:{width:number, height:number, length:number} = {width: 0, height: 0, length: 0};
}
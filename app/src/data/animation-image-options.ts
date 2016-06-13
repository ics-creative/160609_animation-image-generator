import {CompressionType} from "../type/compression-type";
export class AnimationImageOptions{

	noLoop:boolean;
	loop:number;
	compression:CompressionType;
	iterations:number;
	fps:number;
	pngCompress:boolean;
	exportAPNG:boolean;
	exportWebP:boolean;

	exportHTML:boolean;
}
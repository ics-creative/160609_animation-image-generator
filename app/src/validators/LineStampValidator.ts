import {AnimationImageOptions} from "../data/AnimationImageOptions";

declare function require(value:String):any;

export class LineStampValidator {
	static validate(output:string, options:AnimationImageOptions):string[] {
		const validateArr:string[] = [];

		const fs = require('fs');
		const stat:{size:number} = fs.statSync(output);

		if (stat.size > 300 * 1024) {
			validateArr.push(`出力した画像の容量が300KBを超えました(現在は${Math.round(stat.size / 1000)}KBです)。`);
		}

		if (LineStampValidator.validateFrameLength(options) === false) {
			validateArr.push(`イラストは最低5~最大20枚で設定ください(現在は${options.imageInfo.length}枚です)。`);
		}

		if (options.noLoop == true) {
			validateArr.push(`ループ回数が無限になっています。再生時間に合わせてループの数を指定ください。`);
		} else {
			let playTime = options.imageInfo.length * options.loop / options.fps;
			if (LineStampValidator.validateTime(options) === false) {
				validateArr.push(`再生時間は1、2、3、4秒のいずれかで設定ください。現在の${Math.round(playTime * 100) / 100}秒は設定できません。`);
			}
		}

		if (LineStampValidator.validateFrameSize(options) === false) {
			validateArr.push(`画像サイズはW320×H270px以内で制作ください。現在の画像サイズはW${options.imageInfo.width}×H${options.imageInfo.height}pxです。`);
		}


		return validateArr;
	}

	static validateFrameSize(options:AnimationImageOptions):boolean {
		return !(options.imageInfo.width > 320 || options.imageInfo.height > 270);
	}

	static validateTime(options:AnimationImageOptions):boolean {
		let playTime = options.imageInfo.length * options.loop / options.fps;
		return [1, 2, 3, 4].indexOf(playTime) >= 0;
	}

	static validateFrameLength(options:AnimationImageOptions):boolean {
		return !(options.imageInfo.length < 5 || 20 < options.imageInfo.length);
	}
}
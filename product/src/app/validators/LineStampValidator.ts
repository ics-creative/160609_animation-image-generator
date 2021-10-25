import { ElectronService } from 'ngx-electron';
import { AnimationImageOptions } from '../../../common-src/data/animation-image-option';
import { LocaleData } from '../i18n/locale-data';

/**
 * LINEスタンプの規約に即しているかを検証するバリデーターです。
 */
export class LineStampValidator {
  static validate(
    output: string,
    options: AnimationImageOptions,
    localeData: LocaleData,
    _electronService: ElectronService
  ): string[] {
    const validateArr: string[] = [];

    const fs = _electronService.remote.require('fs');
    const stat: { size: number } = fs.statSync(output);

    if (stat.size > 300 * 1024) {
      const val = Math.round(stat.size / 1000);

      validateArr.push(localeData.VALIDATE_size.split('${1}').join(val + ''));
    }

    if (LineStampValidator.validateFrameLength(options) === false) {
      const val = options.imageInfo.length;

      validateArr.push(localeData.VALIDATE_amount.split('${1}').join(val + ''));
    }

    if (options.noLoop === true) {
      validateArr.push(localeData.VALIDATE_noLoop);
    } else {
      const playTime = (options.imageInfo.length * options.loop) / options.fps;
      if (LineStampValidator.validateTime(options) === false) {
        const val = Math.round(playTime * 100) / 100;
        validateArr.push(localeData.VALIDATE_time.split('${1}').join(val + ''));
      }
    }

    if (LineStampValidator.validateFrameMaxSize(options) === false) {
      const val1 = options.imageInfo.width;
      const val2 = options.imageInfo.height;

      validateArr.push(
        localeData.VALIDATE_maxSize.split('${1}')
          .join(val1 + '')
          .split('${2}')
          .join(val2 + '')
      );
    }

    if (LineStampValidator.validateFrameMinSize(options) === false) {
      const val1 = options.imageInfo.width;
      const val2 = options.imageInfo.height;

      validateArr.push(
        localeData.VALIDATE_minSize.split('${1}')
          .join(val1 + '')
          .split('${2}')
          .join(val2 + '')
      );
    }

    return validateArr;
  }

  static validateFrameMaxSize(options: AnimationImageOptions): boolean {
    return !(options.imageInfo.width > 320 || options.imageInfo.height > 270);
  }

  static validateFrameMinSize(options: AnimationImageOptions): boolean {
    let flag = true;

    if (options.imageInfo.width < 270 && options.imageInfo.height < 270) {
      // メイン画像判定
      if (options.imageInfo.width === 240 && options.imageInfo.height === 240) {
        // メイン画像のため無視する
      } else {
        flag = false;
      }
    }

    return flag;
  }

  static validateTime(options: AnimationImageOptions): boolean {
    const playTime = (options.imageInfo.length * options.loop) / options.fps;
    return [1, 2, 3, 4].indexOf(playTime) >= 0;
  }

  static validateFrameLength(options: AnimationImageOptions): boolean {
    return !(options.imageInfo.length < 5 || 20 < options.imageInfo.length);
  }
}

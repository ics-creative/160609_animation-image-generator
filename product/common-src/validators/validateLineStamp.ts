import { AnimationImageOptions } from '../data/animation-image-option';
import { ImageInfo } from '../data/image-info';
import { ImageValidatorResult } from '../type/ImageValidator';
import { LineValidationType } from '../type/LineValidationType';
import { lineImageValidators } from './lineImageValidators';

/**
 * LINEスタンプの規約に即しているかを検証するバリデーターです。
 */
export const validateLineStamp = (
  validationType: LineValidationType,
  imageInfo: ImageInfo,
  options: AnimationImageOptions,
  stat?: { size: number }
): ImageValidatorResult => {
  const validator = lineImageValidators[validationType];

  return {
    fileSizeError: stat ? validator.getFileSizeError(stat.size) : undefined,
    frameCountError: validator.getFrameCountError(imageInfo.length),
    loopCountError: validator.getLoopCountError(options.loop),
    durationError: validator.getDurationError(
      (imageInfo.length / options.fps) * options.loop
    ),
    imageSizeError: validator.getImageSizeError(
      imageInfo.width,
      imageInfo.height
    )
  };
};

/** バリデーションのエラーがなかったことを示す結果を返します */
export const validateLineStampNoError = (): ImageValidatorResult => ({
  fileSizeError: undefined,
  frameCountError: undefined,
  loopCountError: undefined,
  durationError: undefined,
  imageSizeError: undefined
});

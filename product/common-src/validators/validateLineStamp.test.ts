import { describe, expect, test } from 'vitest';
import { AnimationImageOptions } from '../data/animation-image-option';
import { LineValidationType } from '../type/LineValidationType';
import { ImageExportMode } from '../type/ImageExportMode';
import { lineImageValidators } from './lineImageValidators';
import { validateLineStamp } from './validateLineStamp';

describe('test linestamp validation', () => {
  // アニメーションスタンプ メイン

  test('should pass for min animation main', () => {
    const imageInfo = {width: 240, height: 240, length: 5};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    const result = validateLineStamp(LineValidationType.ANIMATION_MAIN, imageInfo, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max animation main', () => {
    const imageInfo = {width: 240, height: 240, length: 20};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 4;
    const result = validateLineStamp(LineValidationType.ANIMATION_MAIN, imageInfo, option, {size: 300 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // アニメーションスタンプ スタンプ

  test('should pass for min animation stamp', () => {
    const imageInfo = {width: 270, height: 270, length: 5};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    const result = validateLineStamp(
      LineValidationType.ANIMATION_STAMP,
      imageInfo,
      option
    );
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max animation stamp', () => {
    const imageInfo = {width: 320, height: 270, length: 20};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 4;
    const result = validateLineStamp(
      LineValidationType.ANIMATION_STAMP,
      imageInfo, option, {size: 300 * 1024}
    );
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // エフェクトスタンプ

  test('should pass for min effect stamp', () => {
    const imageInfo = {width: 200, height: 480, length: 5};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    const result = validateLineStamp(LineValidationType.EFFECT, imageInfo, option, {size: 500 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max effect stamp', () => {
    const imageInfo = {width: 480, height: 480, length: 20};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 3;
    const result = validateLineStamp(LineValidationType.EFFECT, imageInfo, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // ポップアップスタンプ

  test('should pass for min popup stamp', () => {
    const imageInfo = {width: 200, height: 480, length: 5};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    const result = validateLineStamp(LineValidationType.POPUP, imageInfo, option, {size: 500 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max popup stamp', () => {
    const imageInfo = {width: 480, height: 480, length: 20};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 3;
    const result = validateLineStamp(LineValidationType.POPUP, imageInfo, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // アニメーション絵文字

  test('should pass for min emoji', () => {
    const imageInfo = {width: 180, height: 180, length: 5};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    const result = validateLineStamp(LineValidationType.EMOJI, imageInfo, option, {size: 300 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max emoji', () => {
    const imageInfo = {width: 180, height: 180, length: 20};
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.imageExportMode = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 4;
    const result = validateLineStamp(LineValidationType.EMOJI, imageInfo, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });
});

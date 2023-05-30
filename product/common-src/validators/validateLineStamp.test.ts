import { describe, expect, test } from 'vitest';
import { AnimationImageOptions } from '../data/animation-image-option';
import { LineValidationType } from '../type/LineValidationType';
import { ImageExportMode } from '../type/ImageExportMode';
import { lineImageValidators } from './lineImageValidators';
import { validateLineStamp } from './validateLineStamp';

describe('test linestamp validation', () => {
  // アニメーションスタンプ メイン

  test('should pass for min animation main', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    option.imageInfo.width = 240;
    option.imageInfo.height = 240;
    option.imageInfo.length = 5;
    const result = validateLineStamp(LineValidationType.ANIMATION_MAIN, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max animation main', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 4;
    option.imageInfo.width = 240;
    option.imageInfo.height = 240;
    option.imageInfo.length = 20;
    const result = validateLineStamp(LineValidationType.ANIMATION_MAIN, option, {size: 300 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // アニメーションスタンプ スタンプ

  test('should pass for min animation stamp', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    option.imageInfo.width = 270;
    option.imageInfo.height = 270;
    option.imageInfo.length = 5;
    const result = validateLineStamp(
      LineValidationType.ANIMATION_STAMP,
      option
    );
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max animation stamp', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 4;
    option.imageInfo.width = 320;
    option.imageInfo.height = 270;
    option.imageInfo.length = 20;
    const result = validateLineStamp(
      LineValidationType.ANIMATION_STAMP,
      option, {size: 300 * 1024}
    );
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // エフェクトスタンプ

  test('should pass for min effect stamp', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    option.imageInfo.width = 200;
    option.imageInfo.height = 480;
    option.imageInfo.length = 5;
    const result = validateLineStamp(LineValidationType.EFFECT, option, {size: 500 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max effect stamp', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 3;
    option.imageInfo.width = 480;
    option.imageInfo.height = 480;
    option.imageInfo.length = 20;
    const result = validateLineStamp(LineValidationType.EFFECT, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // ポップアップスタンプ

  test('should pass for min popup stamp', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    option.imageInfo.width = 200;
    option.imageInfo.height = 480;
    option.imageInfo.length = 5;
    const result = validateLineStamp(LineValidationType.POPUP, option, {size: 500 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max popup stamp', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 3;
    option.imageInfo.width = 480;
    option.imageInfo.height = 480;
    option.imageInfo.length = 20;
    const result = validateLineStamp(LineValidationType.POPUP, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  // アニメーション絵文字

  test('should pass for min emoji', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 5;
    option.loop = 1;
    option.imageInfo.width = 180;
    option.imageInfo.height = 180;
    option.imageInfo.length = 5;
    const result = validateLineStamp(LineValidationType.EMOJI, option, {size: 300 * 1024});
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });

  test('should pass for max emoji', () => {
    const option: AnimationImageOptions = new AnimationImageOptions();
    option.preset = ImageExportMode.LINE;
    option.fps = 20;
    option.loop = 4;
    option.imageInfo.width = 180;
    option.imageInfo.height = 180;
    option.imageInfo.length = 20;
    const result = validateLineStamp(LineValidationType.EMOJI, option);
    const isValid = Object.values(result).every((r) => r === undefined);
    if (!isValid) {
      console.warn(result);
    }
    expect(isValid).toBe(true);
  });
});

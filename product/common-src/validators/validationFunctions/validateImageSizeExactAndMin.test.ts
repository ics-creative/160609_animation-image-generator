import { describe, expect, test } from 'vitest';
import { setLang } from '../../i18n/locale-manager';
import { validateImageSizeExactAndMin } from './validateImageSizeExactAndMin';

describe('test imagesize exact match validator', () => {
  test('should pass when equals to upper size', () => {
    const result = validateImageSizeExactAndMin(480, 480, 480, 200, 320);
    expect(result).toBe(undefined);
  });

  test('should pass when equals to lower width', () => {
    const result = validateImageSizeExactAndMin(200, 480, 480, 200, 320);
    expect(result).toBe(undefined);
  });

  test('should pass when equals to lower height', () => {
    const result = validateImageSizeExactAndMin(480, 320, 480, 200, 320);
    expect(result).toBe(undefined);
  });

  test('should fail when smaller than lower width', () => {
    const result = validateImageSizeExactAndMin(199, 480, 480, 200, 320);
    expect(result).not.toBe(undefined);
  });

  test('should pass when smaller to lower height', () => {
    const result = validateImageSizeExactAndMin(480, 319, 480, 200, 320);
    expect(result).not.toBe(undefined);
  });

  test('should fail when larger width than upper size', () => {
    const result = validateImageSizeExactAndMin(481, 480, 480, 200, 320);
    expect(result).not.toBe(undefined);
  });

  test('should fail when larger height than upper size', () => {
    const result = validateImageSizeExactAndMin(480, 481, 480, 200, 320);
    expect(result).not.toBe(undefined);
  });

  test('should return error message in ja', () => {
    setLang('ja');
    const result = validateImageSizeExactAndMin(199, 480, 480, 200, 320);
    expect(result?.message).toBe(
      `画像サイズはW480×H320〜480pxまたはW200〜480×H480pxのいずれかで制作ください。現在の画像サイズはW199×H480pxです。`
    );
  });

  test('should return error message in en', () => {
    setLang('en');
    const result = validateImageSizeExactAndMin(199, 480, 480, 200, 320);
    expect(result?.message).toBe(
      `Image size have to be either of W480 x H320 to 480px or W200 to 480 x H480px. Current size is W199 x H480px.`
    );
  });
});

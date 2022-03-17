import { describe, expect, test } from 'vitest';
import { setLang } from '../../i18n/locale-manager';
import { validateImageSizeMaxBothAndMinOneside } from './validateImageSizeMaxBothAndMinOneside';

describe('test imagesize exact match validator', () => {
  test('should pass when equals to upper size', () => {
    const result = validateImageSizeMaxBothAndMinOneside(320, 270, 320, 270, 200);
    expect(result).toBe(undefined);
  });

  test('should pass when equals to lower width', () => {
    const result = validateImageSizeMaxBothAndMinOneside(200, 1, 320, 270, 200);
    expect(result).toBe(undefined);
  });

  test('should pass when equals to lower height', () => {
    const result = validateImageSizeMaxBothAndMinOneside(1, 200, 320, 270, 200);
    expect(result).toBe(undefined);
  });

  test('should fail when larger than upper width', () => {
    const result = validateImageSizeMaxBothAndMinOneside(321, 270, 320, 270, 200);
    expect(result).not.toBe(undefined);
  });

  test('should fail when larger than upper height', () => {
    const result = validateImageSizeMaxBothAndMinOneside(320, 271, 320, 270, 200);
    expect(result).not.toBe(undefined);
  });

  test('should fail when smaller than lower size', () => {
    const result = validateImageSizeMaxBothAndMinOneside(199, 199, 320, 270, 200);
    expect(result).not.toBe(undefined);
  });

  test('should return error message in ja', () => {
    setLang('ja');
    const result = validateImageSizeMaxBothAndMinOneside(321, 270, 320, 270, 200);
    expect(result?.message).toBe(
      `画像サイズはW320×H270px以内かつ縦横どちらかは200px以上となるように制作ください。現在の画像サイズはW321×H270pxです。`
    );
  });

  test('should return error message in en', () => {
    setLang('en');
    const result = validateImageSizeMaxBothAndMinOneside(321, 270, 320, 270, 200);
    expect(result?.message).toBe(
      `Image size have to be within W320 x H270px and either W or H have to be larger then 200px. Current size is W321 x H270px.`
    );
  });
});

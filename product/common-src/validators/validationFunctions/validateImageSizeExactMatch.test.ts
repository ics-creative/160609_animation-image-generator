import { describe, expect, test } from 'vitest';
import { setLang } from '../../i18n/locale-manager';
import { validateImageSizeExactMatch } from './validateImageSizeExactMatch';

describe('test imagesize exact match validator', () => {
  test('should pass when equals to valid size', () => {
    const result = validateImageSizeExactMatch(320, 270, 320, 270);
    expect(result).toBe(undefined);
  });

  test('should fail when smaller width than valid size', () => {
    const result = validateImageSizeExactMatch(319, 270, 320, 270);
    expect(result).not.toBe(undefined);
  });

  test('should fail when smaller height than valid size', () => {
    const result = validateImageSizeExactMatch(320, 269, 320, 270);
    expect(result).not.toBe(undefined);
  });

  test('should fail when larger width than valid size', () => {
    const result = validateImageSizeExactMatch(321, 270, 320, 270);
    expect(result).not.toBe(undefined);
  });

  test('should fail when larger height than valid size', () => {
    const result = validateImageSizeExactMatch(320, 271, 320, 270);
    expect(result).not.toBe(undefined);
  });

  test('should return error message in ja', () => {
    setLang('ja');
    const result = validateImageSizeExactMatch(321, 269, 320, 270);
    expect(result?.message).toBe(
      `画像サイズはW320×H270pxで制作ください。現在の画像サイズはW321×H269pxです。`
    );
  });

  test('should return error message in en', () => {
    setLang('en');
    const result = validateImageSizeExactMatch(321, 269, 320, 270);
    expect(result?.message).toBe(
      `Image size have to be W320 x H270px. Current size is W321 x H269px.`
    );
  });
});

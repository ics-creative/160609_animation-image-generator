import { describe, expect, test } from 'vitest';
import { setLang } from '../../i18n/locale-manager';
import { validateFileSize } from './validateFileSize';

describe('test filesize validator', () => {
  test('should pass when equals to limit', () => {
    const SIZE10KB = 10 * 1024;
    const result = validateFileSize(SIZE10KB, SIZE10KB);
    expect(result).toBe(undefined);
  });

  test('should fail when 1byte over the limit', () => {
    const SIZE10KB = 10 * 1024;
    const result = validateFileSize(SIZE10KB + 1, SIZE10KB);
    expect(result).not.toBe(undefined);
  });

  test('should return error message in ja', () => {
    const SIZE10KB = 10 * 1024;
    setLang('ja');
    const result = validateFileSize(SIZE10KB + 1, SIZE10KB);
    expect(result?.message).toBe(`出力した画像の容量が10KBを超えました(現在は11KBです)。`);
  });

  test('should return error message in en', () => {
    const SIZE10KB = 10 * 1024;
    setLang('en');
    const result = validateFileSize(SIZE10KB + 1, SIZE10KB);
    expect(result?.message).toBe(`Size of the file is exceeded the limit (10KB). Current size is 11KB.`);
  });

});

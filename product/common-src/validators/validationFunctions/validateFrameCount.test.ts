import { describe, expect, test } from 'vitest';
import { setLang } from '../../i18n/locale-manager';
import { validateFrameCount } from './validateFrameCount';

describe('test framecount validator', () => {
  test('should pass when equals to lower limit', () => {
    const result = validateFrameCount(5, 5, 20);
    expect(result).toBe(undefined);
  });

  test('should pass when equals to upper limit', () => {
    const result = validateFrameCount(20, 5, 20);
    expect(result).toBe(undefined);
  });

  test('should fail when fewer than lower limit', () => {
    const result = validateFrameCount(4, 5, 20);
    expect(result).not.toBe(undefined);
  });

  test('should fail when more than upper limit', () => {
    const result = validateFrameCount(21, 5, 20);
    expect(result).not.toBe(undefined);
  });

  test('should return error message in ja', () => {
    setLang('ja');
    const result = validateFrameCount(1, 5, 20);
    expect(result?.message).toBe(
      `イラストは最低5~最大20枚で設定ください(現在は1枚です)。`
    );
  });

  test('should return error message in en', () => {
    setLang('en');
    const result = validateFrameCount(1, 5, 20);
    expect(result?.message).toBe(
      `Please set 5 to 20 illustrations. This file contains 1 illustrations.`
    );
  });
});

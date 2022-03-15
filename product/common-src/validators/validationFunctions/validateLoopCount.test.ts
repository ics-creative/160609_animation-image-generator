import { describe, expect, test } from 'vitest';
import { setLang } from '../../i18n/locale-manager';
import { validateLoopCount } from './validateLoopCount';

describe('test loopcount validator', () => {
  test('should pass when equals to lower limit', () => {
    const result = validateLoopCount(1, 1, 4);
    expect(result).toBe(undefined);
  });

  test('should pass when equals to upper limit', () => {
    const result = validateLoopCount(4, 1, 4);
    expect(result).toBe(undefined);
  });

  test('should fail when fewer than lower limit', () => {
    const result = validateLoopCount(0, 1, 4);
    expect(result).not.toBe(undefined);
  });

  test('should fail when more than upper limit', () => {
    const result = validateLoopCount(5, 1, 4);
    expect(result).not.toBe(undefined);
  });

  test('should return error message in ja', () => {
    setLang('ja');
    const result = validateLoopCount(5, 1, 4);
    expect(result?.message).toBe(
      `ループ回数は1〜4の間で指定してください(現在は5回です)。`
    );
  });

  test('should return error message in en', () => {
    setLang('en');
    const result = validateLoopCount(5, 1, 4);
    expect(result?.message).toBe(
      `Please set loop count from 1 to 4. Current setting is 5.`
    );
  });
});

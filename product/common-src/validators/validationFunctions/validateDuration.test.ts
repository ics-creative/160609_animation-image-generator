import { describe, expect, test } from 'vitest';
import { setLang } from '../../i18n/locale-manager';
import { validateDuration } from './validateDuration';

describe('test duration validator', () => {
  test('should pass with valid duration', () => {
    const result = validateDuration(2, [1, 2, 3]);
    expect(result).toBe(undefined);
  });

  test('should fail with invalid duration', () => {
    const result = validateDuration(2, [3, 4, 5]);
    expect(result).not.toBe(undefined);
  });

  test('should return error message in ja', () => {
    setLang('ja');
    const result = validateDuration(2, [3, 4, 5]);
    expect(result?.message).toBe(`再生時間は3、4、5秒のいずれかで設定ください。現在の2秒は設定できません。`);
  });

  test('should return error message in en', () => {
    setLang('en');
    const result = validateDuration(2, [3, 4, 5]);
    expect(result?.message).toBe(`Playback time have to be one of 3, 4, 5seconds. Current playback time is 2seconds.`);
  });

});

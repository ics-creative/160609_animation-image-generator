import { AnimationImageOptions } from '../../../../common-src/data/animation-image-option';
import { PresetLine } from '../../../../common-src/preset/preset-line';
import { PresetWeb } from '../../../../common-src/preset/preset-web';
import {
  ImageExportMode,
  numberToMode
} from '../../../../common-src/type/ImageExportMode';
import { LineValidationType } from '../../../../common-src/type/LineValidationType';

interface LineConfig {
  animationOption: AnimationImageOptions;
  lineValidationType: LineValidationType;
}
interface WebConfig {
  animationOption: AnimationImageOptions;
}

export interface UserConfigsVer0 {
  imageExportNumber: number;
}

export interface UserConfigsVer1 {
  version: number;
  imageExportMode: ImageExportMode;
  lineConfig: LineConfig;
  webConfig: WebConfig;
}

export type UserConfigs = UserConfigsVer1;

const USER_CONFIGS = 'user-configs'; // ユーザー設定
const OLD_USER_CONFIGS = 'preset_id'; // 旧バージョンの設定
const CURRENT_VERSION = 1;

export const loadUserConfigs = (): UserConfigs => {
  return migrationUserConfig();
};

export const saveUserConfigs = (data: UserConfigs) => {
  localStorage.setItem(USER_CONFIGS, JSON.stringify(data));
};

// 旧バージョンのユーザー設定を新バージョンに移行する
const migrationUserConfig = (): UserConfigs => {
  // 旧バージョンのユーザー設定を読み込む
  const imagePresetMode = localStorage.getItem(OLD_USER_CONFIGS);
  if (imagePresetMode) {
    localStorage.removeItem(OLD_USER_CONFIGS); // 旧バージョンの設定を削除する
    const configs = migrationUserConfigFromVer0({
      imageExportNumber: Number(imagePresetMode)
    });
    // 新バージョンの設定を保存する
    saveUserConfigs(configs);
    return configs;
  }

  const loadedUserConfig = localStorage.getItem(USER_CONFIGS);
  // UserConfigsが存在しない場合はプリセットを返す
  const userConfigs = loadedUserConfig
    ? JSON.parse(loadedUserConfig)
    : undefined;
  if (userConfigs === undefined) {
    const configs = {
      version: CURRENT_VERSION,
      imageExportMode: ImageExportMode.LINE,
      lineConfig: PresetLine.getPresetVer1(),
      webConfig: PresetWeb.getPresetVer1()
    };
    // 新バージョンの設定を保存する
    saveUserConfigs(configs);
    return configs;
  }

  // ver1以降マイグレーションが必要な場合ここで対応する

  return userConfigs;
};

/**
 * ver0設定から最新Ver設定に移行する
 * @param configVer0
 * @returns
 */
const migrationUserConfigFromVer0 = (
  configVer0: UserConfigsVer0
): UserConfigs => {
  return {
    version: CURRENT_VERSION,
    imageExportMode:
      numberToMode(configVer0.imageExportNumber) ?? ImageExportMode.LINE,
    lineConfig: PresetLine.getPresetVer1(),
    webConfig: PresetWeb.getPresetVer1()
  };
};

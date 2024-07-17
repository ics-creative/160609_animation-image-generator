const process = require('process');
const fs = require('fs');
const del = require('del');
const path = require('path');
const { copyRecursiveSync } = require('./copy-recursive-sync.js');

const { join, resolve } = require('path');
const electronPackager = require('@electron/packager');
const { makeUniversalApp } = require('@electron/universal');

const conf = require('./conf.js');
// platform : darwin, mas
const platformType = process.argv[3];
// sign: 開発バージョン development , リリースバージョン distribution
const signType = process.argv[4];

const appDirectoryX64 = `${conf.JP_NAME}-${platformType}-x64`;
const appDirectoryArm = `${conf.JP_NAME}-${platformType}-arm64`;
const appDirectoryUniversal = `${conf.JP_NAME}-${platformType}-universal`;
const appPathX64 = `${appDirectoryX64}/${conf.JP_NAME}.app`;
const appPathArm = `${appDirectoryArm}/${conf.JP_NAME}.app`;
const appPathUniversal = `${appDirectoryUniversal}/${conf.JP_NAME}.app`;
const certConfigPath = `../../cert/${signType}.json`;
const provisioningProfilePath = `../../cert/${signType}.provisionprofile`;

const loadCertConfig = () => {
  if (!fs.existsSync(certConfigPath)) return undefined;
  const signConfigStr = fs.readFileSync(certConfigPath, 'utf-8');
  return JSON.parse(signConfigStr);
};

const signConfig = loadCertConfig();

const execFlat = () => {
  console.log('start flat...');
  if (!signConfig) {
    console.error('No cert config. aborted.');
    return;
  }
  if (!signConfig.flat.enabled) {
    return;
  }
  
  const { flatAsync } = require('@electron/osx-sign');
  const pkg = `AnimationImageConverter_${signType}.pkg`;

  return flatAsync({
    app: appPathUniversal,
    identity: signConfig.flat.identity,
    pkg: `../${pkg}`,
    platform: platformType,
  }).catch((e) => {
    console.error(e);
    console.error('flat failure!');
  });
};

const execSign = () => {
  console.log('start sign...');
  if (!signConfig) {
    console.error(`No cert config found. aborted.
    Please place the config at "${path.join(__dirname, certConfigPath)}"`);
    return;
  }
  if (!fs.existsSync(provisioningProfilePath)) {
    console.error(`No provisioning profile found. aborted.
    Please place the config at "${path.join(
      __dirname,
      provisioningProfilePath
    )}"`);
    return;
  }
  const { signAsync } = require('@electron/osx-sign');

  return signAsync({
    app: appPathUniversal,
    platform: platformType,
    provisioningProfile: provisioningProfilePath,
    type: signType,
    identity: signConfig.sign.identity
  }).catch((e) => {
    console.error(e);
    console.error('sign failure!');
  });
};

const buildUniversal = async () => {
  // バッケージビルド設定（アーキテクチャ共通）
  const settings = {
    name: conf.JP_NAME,
    dir: conf.packageTmpPath.darwin,
    out: './',
    icon: './resources/app-icon/app.icons',
    platform: platformType,
    electronVersion: conf.ELECTRON_VERSION,
    overwrite: true,
    asar: false,
    extendInfo: './resources/dev/info.plist',
    appBundleId: signConfig?.bundleId,
    appVersion: conf.APP_VERSION,
    buildVersion: conf.BUILD_VERSION,
    appCopyright: conf.COPY_RIGHT
  };

  // x64, armそれぞれをビルド
  await electronPackager({ ...settings, arch: 'x64' });
  await electronPackager({ ...settings, arch: 'arm64' });

  // 一度binを削除
  // binのモジュールにはユニバーサル対応されていないものが含まれているため@electron/universalに渡せない
  // 一旦削除して、ユニバーサル化した後で再度コピーする（bin部分はarmマシンでもx64のRosseta2経由で動く）
  del.sync([`${appPathX64}/Contents/Resources/app/bin`]);
  del.sync([`${appPathArm}/Contents/Resources/app/bin`]);

  // ユニバーサルアプリの保存先フォルダを作成
  fs.mkdirSync(appDirectoryUniversal);
  // アプリ本体以外のファイルをコピー
  ['version', 'LICENSE', 'LICENSES.chromium.html'].map((name) =>
    fs.copyFileSync(
      join(appDirectoryX64, name),
      join(appDirectoryUniversal, name)
    )
  );

  // ユニバーサル化
  await makeUniversalApp({
    x64AppPath: resolve(appPathX64),
    arm64AppPath: resolve(appPathArm),
    outAppPath: resolve(appPathUniversal)
  });

  // 再度binをコピー
  copyRecursiveSync(
    `${conf.packageTmpPath.darwin}/bin/`,
    `${appPathUniversal}/Contents/Resources/app/bin/`
  );

  // x64, armの各ビルドを削除
  del.sync([`${appDirectoryX64}/**`]);
  del.sync([`${appDirectoryArm}/**`]);

  return appPathUniversal;
};

const main = async () => {
  // パッケージング前にフォルダを削除
  del.sync([`${appDirectoryX64}/**`]);
  del.sync([`${appDirectoryArm}/**`]);
  del.sync([`${appDirectoryUniversal}/**`]);

  const app = await buildUniversal();
  console.info('[electron-packager] success : ' + app);

  if (platformType === 'mas') {
  await execSign();
  await execFlat();
  }
};

main();

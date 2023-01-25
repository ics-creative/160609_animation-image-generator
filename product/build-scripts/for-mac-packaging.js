const process = require('process');
const fs = require('fs');
const cpx = require('cpx');
const del = require('del');
const { join, resolve } = require('path');
const electronPackager = require('electron-packager');
const { makeUniversalApp } = require('@electron/universal');

const conf = require('./conf.js');
// 開発バージョン:development , リリースバージョン:distribution
const signType = process.argv[3];

const appDirectoryX64 = `${conf.JP_NAME}-mas-x64`;
const appDirectoryArm = `${conf.JP_NAME}-mas-arm64`;
const appDirectoryUniversal = `${conf.JP_NAME}-mas-universal`;
const appPathX64 = `${appDirectoryX64}/${conf.JP_NAME}.app`;
const appPathArm = `${appDirectoryArm}/${conf.JP_NAME}.app`;
const appPathUniversal = `${appDirectoryUniversal}/${conf.JP_NAME}.app`;
const certConfigPath = `../../cert/${signType}.json`;

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
  const flat = require('electron-osx-sign').flat;
  const pkg = `AnimationImageConverter_${signType}.pkg`;

  return new Promise((resolve, reject) => {
    flat(
      {
        app: appPathUniversal,
        identity: signConfig.flat.identity,
        pkg: `../${pkg}`,
        platform: 'mas'
      },
      (err) => {
        if (err) {
          console.error(err);
          console.error('flat failure!');
          reject();
        } else {
          console.info('flat done!');
          resolve();
        }
      }
    );
  });
};

const execSign = () => {
  console.log('start sign...');
  if (!signConfig) {
    console.error('No cert config. aborted.');
    return;
  }
  const sign = require('electron-osx-sign');

  return new Promise((resolve, reject) => {
    sign(
      {
        app: appPathUniversal,
        entitlements: 'resources/dev/parent.plist',
        'entitlements-inherit': 'resources/dev/child.plist',
        platform: 'mas',
        'provisioning-profile': `../../cert/${signType}.provisionprofile`,
        type: signType,
        identity: signConfig.sign.identity
      },
      (err) => {
        if (err) {
          console.error(err);
          console.error('sign failure!');
          reject();
        } else {
          console.info('sign done!');
          resolve();
        }
      }
    );
  });
};

const buildUniversal = async () => {
  // バッケージビルド設定（アーキテクチャ共通）
  const settings = {
    name: conf.JP_NAME,
    dir: conf.packageTmpPath.darwin,
    out: './',
    icon: './resources/app-icon/app.icons',
    platform: 'mas',
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
  cpx.copySync(
    `${conf.packageTmpPath.darwin}/bin/*`,
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
  await execSign();
  await execFlat();
};

main();

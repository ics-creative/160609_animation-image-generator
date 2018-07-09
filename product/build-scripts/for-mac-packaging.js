// electron-packager ./tmp-release-mac 'アニメ画像に変換する君' --platform=mas --overwrite  --arch=x64 --app-bundle-id='media.ics.AnimationImageConverter'  --extend-info=dev/Info.plist  --version='1.2.3'  --app-version='1.2.0' --build-version='1.2.000' --icon='resources/app.icns' --overwrite
// electron-osx-flat 'アニメ画像に変換する君-mas-x64/アニメ画像に変換する君.app' --identity '3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)' --verbose --pkg AnimationImageConverter.pkg

const conf = require('./conf.js');

const appDirectory = `${conf.JP_NAME}-mas-x64`;
const appPath = `${appDirectory}/${conf.JP_NAME}.app`;

// 開発バージョン
// const signType = 'development' ;
// リリースバージョン
const signType = 'distribution' ;

function startFlat() {
  console.log('start flat...');
  const flat = require('electron-osx-sign').flat;

  const pkg = `AnimationImageConverter_${signType}.pkg`;

  flat(
    {
      'app': appPath,
      'identity': conf.sign.identity,
      'pkg': `../${pkg}`,
      'platform': 'mas'
    },
    function done(err) {
      if (err) {
        console.error(err);
        console.error('flat failure!');
        return;
      }
      console.info('flat done!');
    }
  );
}

function startSign() {
  console.log('start sign...');
  const sign = require('electron-osx-sign');

  sign(
    {
      'app': appPath,
      'entitlements': 'resources/dev/parent.plist',
      'entitlements-inherit': 'resources/dev/child.plist',
      'platform': 'mas',
      'provisioning-profile': `resources/cert/${signType}.provisionprofile`,
      'type' : signType
    },
    function (err) {
      if (err) {
        console.error(err);
        console.error('sign failure!');

        return;
      }
      startFlat();
    }
  );
}

// パッケージング前にフォルダを削除
require('del').sync([`${appDirectory}/**`]);

const electronPackager = require('electron-packager');
electronPackager(
  {
    'name': conf.JP_NAME,
    'dir': conf.packageTmpPath.darwin,
    'out': './',
    'icon': './resources/app.icons',
    'platform': 'mas',
    'arch': 'x64',
    'electronVersion': conf.ELECTRON_VERSION,
    'overwrite': true,
    'asar': false,
    'extendInfo': './resources/dev/info.plist',
    'appBundleId': conf.sign.bundleId,
    'appVersion': conf.APP_VERSION,
    'buildVersion': conf.BUILD_VERSION,
    'appCopyright': 'Copyright (C) 2018 ICS INC.'
  }
).then((appPaths) => {
  console.info('[electron-packager] success : ' + appPaths);
  // コードサイニング証明書を付与
  startSign();
}).catch((err) => {
  // エラーが発生したのでログを表示して終了
  console.error('[electron-packager] failure : ' + err);
});

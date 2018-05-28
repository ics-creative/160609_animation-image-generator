// electron-packager ./tmp-release-mac 'アニメ画像に変換する君' --platform=mas --overwrite  --arch=x64 --app-bundle-id='media.ics.AnimationImageConverter'  --extend-info=dev/Info.plist  --version='1.2.3'  --app-version='1.2.0' --build-version='1.2.000' --icon='resources/app.icns' --overwrite
// electron-osx-flat 'アニメ画像に変換する君-mas-x64/アニメ画像に変換する君.app' --identity '3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)' --verbose --pkg AnimationImageConverter.pkg

const conf = require('./conf.js');

const appDirectory = `${conf.JP_NAME}-mas-x64`;
const appPath = `${appDirectory}/${conf.JP_NAME}.app`;

function startFlat() {
  console.log('start flat...');
  const flat = require('electron-osx-sign').flat;
  flat(
    {
      'app': appPath,
      'identity': conf.sign.identity,
      'pkg': `../${conf.pkg}`,
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
      'provisioning-profile': 'resources/dev/provisioningProfiles.provisionprofile'
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
    'extendInfo': 'resources/dev/Info.plist',
    'appBundleId': conf.sign.bundleId,
    'appVersion': conf.APP_VERSION,
    'buildVersion': conf.BUILD_VERSION,
    'appCopyright': 'Copyright (C) 2017 ICS INC.'
  },
  function (err, appPaths) {
    // 完了時のコールバック
    if (err) {
      console.error(err);
      console.error('package failure!  ' + err);
      return;
    }
    console.info('package done!  ' + appPaths);

    startSign();
  }
);

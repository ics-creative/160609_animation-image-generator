// electron-packager ./tmp-release-mac 'アニメ画像に変換する君' --platform=mas --overwrite  --arch=x64 --app-bundle-id='media.ics.AnimationImageConverter'  --extend-info=dev/Info.plist  --version='1.2.3'  --app-version='1.2.0' --build-version='1.2.000' --icon='resources/app.icns' --overwrite
// electron-osx-flat 'アニメ画像に変換する君-mas-x64/アニメ画像に変換する君.app' --identity '3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)' --verbose --pkg AnimationImageConverter.pkg

const electronPackager = require('electron-packager');
const conf = require('./conf.js');

// ./tmp-release-win32 animation-image-converter --platform=win32 --arch=ia32 --overwrite --asar --icon=resources/app.ico
electronPackager(
  {
    name: conf.EN_NAME,
    dir: conf.packageTmpPath.win32,
    out: '../',
    icon: './resources/app.ico',
    platform: 'win32',
    arch: 'ia32',
    electronVersion: conf.ELECTRON_VERSION,
    overwrite: true,
    asar: false,
    appBundleId: conf.sign.bundleId,
    appVersion: conf.APP_VERSION,
    appCopyright: 'Copyright (C) 2017 ICS INC.'
  },
  function(err, appPaths) {
    // 完了時のコールバック
    if (err) console.log(err);
    console.log('Done: ' + appPaths);
  }
);

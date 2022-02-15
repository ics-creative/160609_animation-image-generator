// electron-packager ./tmp-release-mac 'アニメ画像に変換する君' --platform=mas --overwrite  --arch=x64 --app-bundle-id='media.ics.AnimationImageConverter'  --extend-info=dev/Info.plist  --version='1.2.3'  --app-version='1.2.0' --build-version='1.2.000' --icon='resources/app.icns' --overwrite
// electron-osx-flat 'アニメ画像に変換する君-mas-x64/アニメ画像に変換する君.app' --identity '3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)' --verbose --pkg AnimationImageConverter.pkg

const electronPackager = require('electron-packager');
const conf = require('./conf.js');

function convertWindowsStore() {
  const electronWindowsStore = require('electron-windows-store');

  electronWindowsStore({
    containerVirtualization: false,
    inputDirectory: '.',
    outputDirectory: '../windows-store',
    flatten: false,
    packageVersion: conf.APP_VERSION,
    packageName: 'AnimationImageConverter',
    packageDisplayName: conf.JP_NAME,
    packageDescription: conf.JP_DESCRIPTION,
    packageExecutable: `../animation-image-converter-win32-ia32/${conf.EN_NAME}.exe`,
    deploy: false,
    finalSay: function() {
      console.log('exit');
      return new Promise((resolve, reject) => resolve());
    }
  });
}

electronPackager({
  name: conf.EN_NAME,
  dir: conf.packageTmpPath.win32,
  out: '../',
  icon: './resources/app.ico',
  platform: 'win32',
  arch: 'ia32',
  electronVersion: conf.ELECTRON_VERSION,
  overwrite: true,
  asar: false,
  appVersion: conf.APP_VERSION,
  appCopyright: 'Copyright (C) 2018 ICS INC.'
})
  .then(appPaths => {
    console.info('[electron-packager] success : ' + appPaths);
    // コードサイニング証明書を付与
    convertWindowsStore();
  })
  .catch(err => {
    // エラーが発生したのでログを表示して終了
    console.error('[electron-packager] failure : ' + err);
  });

// electron-packager ./tmp-release-mac 'アニメ画像に変換する君' --platform=mas --overwrite  --arch=x64 --app-bundle-id='media.ics.AnimationImageConverter'  --extend-info=dev/Info.plist  --version='1.2.3'  --app-version='1.2.0' --build-version='1.2.000' --icon='resources/app.icns' --overwrite
// electron-osx-flat 'アニメ画像に変換する君-mas-x64/アニメ画像に変換する君.app' --identity '3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)' --verbose --pkg AnimationImageConverter.pkg

const electronPackager = require('electron-packager');
const conf = require('./conf.js');

function convertWindowsStore() {
  const electronWindowsStore = require('electron-windows-store');

  electronWindowsStore({
    containerVirtualization: false,
    inputDirectory: `../${conf.EN_NAME}-win32-ia32`,
    outputDirectory: '../windows-store',
    flatten: false,
    publisher: 'CN=C2CC10C5-FAD8-43B5-BD98-00BD859F41D5',
    packageVersion: conf.APP_VERSION_WINDOWS,
    packageName: 'AnimationImageConverter',
    packageDisplayName: conf.JP_NAME,
    packageDescription: conf.JP_DESCRIPTION,
    // Windows Kitへのパスは適宜自身の環境に合わせてください。
    windowsKit: 'C:/Program Files (x86)/Windows Kits/10/bin/10.0.22000.0/x64',
    deploy: false,
    finalSay: function () {
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
  appCopyright: conf.COPY_RIGHT
})
  .then((appPaths) => {
    console.info('[electron-packager] success : ' + appPaths);
    // コードサイニング証明書を付与
    convertWindowsStore();
  })
  .catch((err) => {
    // エラーが発生したのでログを表示して終了
    console.error('[electron-packager] failure : ' + err);
  });

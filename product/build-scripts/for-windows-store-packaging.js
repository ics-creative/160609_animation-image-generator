const electronPackager = require('electron-packager');
const conf = require('./conf.js');

function convertWindowsStore() {
  const electronWindowsStore = require('electron-windows-store');

  // パスはインストール先で変わるので環境変数から取得する
  if (!process.env.WINDOWS_KIT_PATH) {
    console.error(`[convert-windows-store] error : WINDOWS_KIT_PATH is not defined. Please set environment variable. 
      Example:'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\x64'`);
    return ;
  }

  electronWindowsStore({
    containerVirtualization: false,
    inputDirectory: `../${conf.EN_NAME}-win32-ia32`,
    outputDirectory: '../windows-store',
    flatten: false,
    assets: './resources/app-icon/win-icon',
    packageName: `${conf.EN_NAME}`,
    manifest: './AppXmanifest.xml',
    windowsKit: process.env.WINDOWS_KIT_PATH,
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
  icon: './resources/app-icon/app.ico',
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

const electronPackager = require('electron-packager');
const conf = require('./conf.js');

// .envから環境変数設定を取り込み
require('dotenv').config();

function convertWindowsStore() {
  const electronWindowsStore = require('electron-windows-store');

  // パスはインストール先で変わるので環境変数(or .env)から取得する
  if (!process.env.WINDOWS_KIT_PATH) {
    console.error(`[convert-windows-store] error : "WINDOWS_KIT_PATH" is not set.
    Please set WINDOWS_KIT_PATH to .env file.`);
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
      console.log('[convert-windows-store] exit');
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

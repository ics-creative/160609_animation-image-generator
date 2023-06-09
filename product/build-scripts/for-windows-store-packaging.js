const electronPackager = require('electron-packager');
const conf = require('./conf.js');

function convertWindowsStore() {
  const electronWindowsStore = require('electron-windows-store');

  electronWindowsStore({
    containerVirtualization: false,
    inputDirectory: `../${conf.EN_NAME}-win32-ia32`,
    outputDirectory: '../windows-store',
    flatten: false,
    assets: './resources/app-icon/win-icon',
    packageName: `${conf.EN_NAME}`,
    manifest: './AppXmanifest.xml',
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

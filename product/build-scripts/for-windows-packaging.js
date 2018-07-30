const electronPackager = require('electron-packager');
const conf = require('./conf.js');

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
    appCopyright: conf.COPY_RIGH
  }
).then((appPaths) => {
  console.info('[electron-packager] success : ' + appPaths);
}).catch((err) => {
  // エラーが発生したのでログを表示して終了
  console.error('[electron-packager] failure : ' + err);
});


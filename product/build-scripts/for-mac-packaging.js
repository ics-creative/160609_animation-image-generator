const process = require('process');
const conf = require('./conf.js');

const appDirectory = `${conf.JP_NAME}-mas-x64`;
const appPath = `${appDirectory}/${conf.JP_NAME}.app`;

// 開発バージョン:development , リリースバージョン:distribution
const signType = process.argv[3];

const signConfigStr = require('fs').readFileSync(`../../cert/${signType}.json`, 'utf-8');
const signConfig = JSON.parse(signConfigStr);

function startFlat() {
  console.log('start flat...');
  const flat = require('electron-osx-sign').flat;
  const pkg = `AnimationImageConverter_${signType}.pkg`;

  flat(
    {
      app: appPath,
      identity: signConfig.flat.identity,
      pkg: `../${pkg}`,
      platform: 'mas'
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
      'provisioning-profile': `../../cert/${signType}.provisionprofile`,
      'type': signType,
      'identity': signConfig.sign.identity
    },
    function (err) {
      if (err) {
        console.error(err);
        console.error('sign failure!');

        return;
      }
      if (signConfig.flat.enabled)
      {
        startFlat();
      }
    }
  );
}

// パッケージング前にフォルダを削除
require('del').sync([`${appDirectory}/**`]);

const electronPackager = require('electron-packager');
electronPackager({
  name: conf.JP_NAME,
  dir: conf.packageTmpPath.darwin,
  out: './',
  icon: './resources/app.icons',
  platform: 'mas',
  arch: 'x64',
  electronVersion: conf.ELECTRON_VERSION,
  overwrite: true,
  asar: false,
  extendInfo: './resources/dev/info.plist',
  appBundleId: signConfig.bundleId,
  appVersion: conf.APP_VERSION,
  buildVersion: conf.BUILD_VERSION,
  appCopyright: conf.COPY_RIGHT
})
  .then((appPaths) => {
    console.info('[electron-packager] success : ' + appPaths);
    // コードサイニング証明書を付与
    startSign();
  })
  .catch((err) => {
    // エラーが発生したのでログを表示して終了
    console.error('[electron-packager] failure : ' + err);
  });

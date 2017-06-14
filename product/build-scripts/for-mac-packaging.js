// electron-packager ./tmp-release-mac 'アニメ画像に変換する君' --platform=mas --overwrite  --arch=x64 --app-bundle-id='media.ics.AnimationImageConverter'  --extend-info=dev/Info.plist  --version='1.2.3'  --app-version='1.2.0' --build-version='1.2.000' --icon='resources/app.icns' --overwrite
// electron-osx-flat 'アニメ画像に変換する君-mas-x64/アニメ画像に変換する君.app' --identity '3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)' --verbose --pkg AnimationImageConverter.pkg

const electronPackager = require("electron-packager");
const conf = require("./conf.js");

electronPackager({
  "name": conf.JP_NAME,
  "dir": conf.packageTmpPath.darwin,
  "out": "../",
  "icon": "./resources/app.icons",
  "platform": "mas",
  "arch": "x64",
  "electronVersion": conf.ELECTRON_VERSION,
  "overwrite": true,
  "asar": false,
  "appBundleId": conf.sign.bundleId,
  "appVersion": conf.APP_VERSION,
  "appCopyright": "Copyright (C) 2017 ICS INC."
}, function (err, appPaths) {// 完了時のコールバック
  if (err) console.log(err);
  console.log("Done: " + appPaths);


  //electron-osx-sign '日本語アプリ名-x64-mas/日本語アプリ名.app' --entitlements='dev/parent.plist' --entitlements-inherit='dev/child.plist'

  const execSync = require('child_process').execSync;

  execSync(`electron-osx-sign ../${conf.JP_NAME}-mas-x64/${conf.JP_NAME}.app --entitlements='resources/dev/parent.plist' --entitlements-inherit='resources/dev/child.plist'`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
  });


  execSync(`electron-osx-flat ../${conf.JP_NAME}-mas-x64/${conf.JP_NAME}.app --identity '${conf.sign.identity}' --verbose --pkg '../${conf.pkg}'`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }
    console.log(stdout);
  });
});
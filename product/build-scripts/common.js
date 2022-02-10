const conf = require('./conf.js');
const mkdirp = require('mkdirp');
const del = require('del');
const execSync = require('child_process').execSync;
const path = require('path');
const cpx = require('cpx');

/**
 * パッケージ作成作業用の一時ディレクトリのパスを返します
 * @param {'win32' | 'darwin'} os
 * @returns {string}
 */
const getPackageTmpDir = (os) => {
  const tmp = conf.packageTmpPath[os];
  if (!tmp) {
    throw new Error(
      `OSの指定に誤りがあります。conf.packageTmpPath.${os}は定義されていません`
    );
  }
  return tmp;
};

const clearDist = () => {
  const dist = conf.distPath;
  if (!dist) {
    throw new Error('distディレクトリが未設定です');
  }
  del.sync(dist);
  mkdirp.sync(dist);
};

const clearPackageTmp = () => {
  const tmpDarwin = getPackageTmpDir('darwin');
  const tmpWin32 = getPackageTmpDir('win32');
  [tmpDarwin, tmpWin32].filter((dir) => dir).forEach((dir) => del.sync(dir));
};

/**
 * dist-configの内容をdistに同期します。
 * デバッグ起動やビルドの前に実行してください。
 */
const copyConfigToDist = () => {
  const from = conf.projectDistConfigPath;
  const to = conf.distPath;
  cpx.copySync(from + '/**', to);
};

/**
 * distに出力されたビルド済ファイルをプラットフォーム別のパッケージングに使用する一時フォルダーにコピーします。
 * 合わせて、copyBinaryAssetsを呼び出し、バイナリモジュールのコピーも行います。
 * ビルド後、パッケージ化前に実行してください。
 * @param {'win32' | 'darwin'} os
 */
const copyDistToPackgeTmp = (os) => {
  const from = conf.distPath;
  const to = getPackageTmpDir(os);

  del.sync([to]);
  console.log(`copy project sources: ${from} --> ${to}`);
  cpx.copySync(from + '/**', to);

  const binTo = path.join(getPackageTmpDir(os), 'bin');
  copyBinaryAssets(os, binTo);
};

/**
 * バイナリモジュールのコピーを行います。
 * @param {'win32' | 'darwin'} os
 * @param {string} to 出力先
 */
const copyBinaryAssets = (os, to) => {
  const from = './resources';
  const resources = conf.resourcesPath[os];
  del.sync([to]);
  mkdirp.sync(to);

  console.log(`copy binary modules: ${from} --> ${to}, platform=${os}`);
  const isWindows = os === 'win32';
  for (let i = 0; i < resources.length; i++) {
    const dest = path.join(to, resources[i].fileName);
    if (isWindows) {
      cpx.copySync(`${from}/${resources[i].path}`, to);
    } else {
      // パーミッションも同じままコピーしないといけないので、macのcpコマンドでコピーしている
      // 合わせてmac上では不要な拡張属性を落とす（com.apple.quarantineが残っていると起動できないため）
      execSync(
        `cp -P ./${from}/${resources[i].path} ${dest} && xattr -c ${dest}`,
        (err, stdout, stderr) => {
          if (err) {
            console.log(err);
          }
          console.log(stdout);
        }
      );
    }
  }

  console.log('exit!');
};

module.exports = {
  clearDist,
  clearPackageTmp,
  copyConfigToDist,
  copyDistToPackgeTmp,
  copyBinaryAssets
};

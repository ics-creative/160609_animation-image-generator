const conf = require('./conf.js');
const common = require('./common.js');

// 現在のOSに合わせてバイナリーモジュールをdistにコピーします
const isWin = process.platform === 'win32';
common.copyBinaryAssets(
  isWin ? 'win32' : 'darwin',
  `${conf.distPath}/bin`
);

// dist-configの内容をdistに同期します
common.copyConfigToDist();
const fs = require('fs');
const path = require('path');

/**
 * 再帰的にディレクトリとファイルをコピーします。
 * @param {string} src - コピー元のディレクトリパス
 * @param {string} dest - コピー先のディレクトリパス
 */
const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childFileName) => {
      copyRecursiveSync(
        path.join(src, childFileName),
        path.join(dest, childFileName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};
module.exports = { copyRecursiveSync };

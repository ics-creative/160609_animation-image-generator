const conf = require('./conf.js');
const mkdirp = require('mkdirp');
const del = require('del');
const execSync = require('child_process').execSync;
const path = require('path');
const cpx = require('cpx');

module.exports = {
  copyProjects: function(outPath) {
    del.sync([outPath]);

    console.log('copy sources...');
    cpx.copySync(conf.distPath + '/**', path.join(outPath, '/dist/'));
    cpx.copySync('dist-config/package.json', outPath);
    cpx.copySync('dist-config/preload.js', outPath);
    cpx.copySync('dist-config/main-src/**', path.join(outPath, '/main-src/'));
    cpx.copySync('dist-config/common-src/**', path.join(outPath, '/common-src/'));
    console.log(conf.distPath, outPath);
  },
  copyResources: function(resources, outPath) {
    const binaryDirectory = path.join(outPath);

    del.sync([binaryDirectory]);

    mkdirp.sync(binaryDirectory);

    console.log(binaryDirectory);

    const isWindows = process.platform === 'win32';

    for (let i = 0; i < resources.length; i++) {
      const dest = path.join(binaryDirectory, resources[i].fileName);
      if (isWindows) {
        cpx.copySync(`./resources/${resources[i].path}`, binaryDirectory);
      } else {
        // パーミッションも同じままコピーしないといけないので、macのcpコマンドでコピーしている
        // 合わせてmac上では不要な拡張属性を落とす（com.apple.quarantineが残っていると起動できないため）
        execSync(
          `cp -P ./resources/${resources[i].path} ${dest} && xattr -c ${dest}`,
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
  }
};

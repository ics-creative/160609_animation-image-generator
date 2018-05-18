const conf = require('./conf.js');
const mkdirp = require('mkdirp');
const del = require('del');
const execSync = require('child_process').execSync;
const path = require('path');
const cpx = require('cpx');

module.exports = {
  copyProjects: function(outPath) {
    del.sync([outPath]);

    cpx.copySync(conf.distPath + '/**', path.join(outPath, '/dist/'));
    cpx.copySync('dist-config/package.json', outPath);
    cpx.copySync('dist-config/main.js', outPath);
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
        execSync(
          `cp -P ./resources/${resources[i].path} ${dest}`,
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

const conf = require("./conf.js");
const mkdirp = require('mkdirp');
const del = require('del');
const execSync = require('child_process').execSync;
const binaryDirectory = conf.distPath;

module.exports = {
  copyResources: function (resources) {
    del.sync([binaryDirectory]);
    mkdirp.sync(binaryDirectory);
    
    for (let i = 0; i < resources.length; i++) {

      execSync(`cp -P ./resources/${resources[i].path} ${binaryDirectory}${resources[i].fileName}`, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
        }
        console.log(stdout);
      });
    }

    console.log("exit!");
  }
};
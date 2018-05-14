const conf = require('./conf.js');
const common = require('./common.js');
const path = require('path');

common.copyProjects(conf.packageTmpPath.win32);
common.copyResources(
  conf.resourcesPath.win32,
  path.join(conf.packageTmpPath.win32, conf.binPath)
);

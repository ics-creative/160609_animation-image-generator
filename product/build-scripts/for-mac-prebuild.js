const conf = require('./conf.js');
const common = require('./common.js');
const path = require('path');

common.copyProjects(conf.packageTmpPath.darwin);
common.copyResources(
  conf.resourcesPath.darwin,
  path.join(conf.packageTmpPath.darwin, conf.binPath)
);

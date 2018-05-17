const conf = require('./conf.js');
const common = require('./common.js');

common.copyResources(
  conf.resourcesPath.win32,
  `${conf.projectDistConfigPath}/bin`
);

common.copyResources(
  conf.resourcesPath.darwin,
  `${conf.projectDistConfigPath}/bin`
);

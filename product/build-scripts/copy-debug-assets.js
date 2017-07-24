const conf = require("./conf.js");
const common = require("./common.js");

common.copyResources(conf.resourcesPath.darwin, `${conf.projectSrcPath}/assets/bin`);
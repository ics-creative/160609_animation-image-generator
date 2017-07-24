const conf = require("./conf.js");
const common = require("./common.js");

common.copyResources(`${conf.projectSrcPath}/assets/bin`,conf.resourcesPath.darwin);
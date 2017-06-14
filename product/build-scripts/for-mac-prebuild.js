const conf = require("./conf.js");
const common = require("./common.js");

common.copyProjects(conf.packageTmpPath.darwin);
common.copyResources(conf.packageTmpPath.darwin,conf.resourcesPath.darwin);
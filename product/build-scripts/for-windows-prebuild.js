const conf = require("./conf.js");
const common = require("./common.js");

common.copyProjects(conf.packageTmpPath.win32);
common.copyResources(conf.packageTmpPath.win32,conf.resourcesPath.win32);
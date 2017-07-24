const conf = require("./conf.js");
const common = require("./common.js");
const path = require("path");

common.copyProjects(conf.packageTmpPath.darwin);
common.copyResources(path.join(conf.packageTmpPath.darwin, conf.binPath), conf.resourcesPath.darwin);
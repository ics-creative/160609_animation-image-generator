"use strict";
exports.__esModule = true;
exports.getExeExt = void 0;
var getExeExt = function () {
    var platform = require('os').platform();
    return platform === 'win32' ? '.exe' : '';
};
exports.getExeExt = getExeExt;

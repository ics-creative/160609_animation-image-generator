"use strict";
exports.__esModule = true;
exports.waitExecFile = void 0;
var child_process_1 = require("child_process");
/** execFileのPromiseラッパーです */
var waitExecFile = function (file, options) {
    return new Promise(function (resolve) {
        return (0, child_process_1.execFile)(file, options, function (err, stdout, stderr) {
            return resolve({ err: err, stdout: stdout, stderr: stderr });
        });
    });
};
exports.waitExecFile = waitExecFile;

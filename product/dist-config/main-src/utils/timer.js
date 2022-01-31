"use strict";
exports.__esModule = true;
exports.waitImmediate = void 0;
/** setImmediateのPromiseラッパーです */
var waitImmediate = function () {
    return new Promise(function (resolve) { return setImmediate(resolve); });
};
exports.waitImmediate = waitImmediate;

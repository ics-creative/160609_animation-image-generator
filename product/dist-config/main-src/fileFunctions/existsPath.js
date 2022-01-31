"use strict";
exports.__esModule = true;
exports.existsPath = void 0;
var fs = require("fs");
/** 指定したパスが存在すればそのパスを、存在しないならundefinedを返します */
var existsPath = function (f) {
    try {
        fs.statSync(f);
        return f;
    }
    catch (e) {
        return undefined;
    }
};
exports.existsPath = existsPath;

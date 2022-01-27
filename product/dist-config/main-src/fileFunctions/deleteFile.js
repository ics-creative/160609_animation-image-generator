"use strict";
exports.__esModule = true;
exports.deleteFile = void 0;
var fs = require("fs");
var path = require("path");
var deleteDirectory_1 = require("./deleteDirectory");
/**
 * ファイルを削除する処理です。
 * @param dir
 * @param file
 */
var deleteFile = function (dir, file) {
    return new Promise(function (resolve, reject) {
        var filePath = path.join(dir, file);
        fs.lstat(filePath, function (lstatErorr, stats) {
            if (lstatErorr) {
                return reject(lstatErorr);
            }
            if (stats.isDirectory()) {
                resolve((0, deleteDirectory_1.deleteDirectory)(filePath));
            }
            else {
                fs.unlink(filePath, function (unlinkError) {
                    if (unlinkError) {
                        return reject(unlinkError);
                    }
                    resolve();
                });
            }
        });
    });
};
exports.deleteFile = deleteFile;

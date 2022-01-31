"use strict";
exports.__esModule = true;
exports.deleteDirectory = void 0;
var fs = require("fs");
var deleteFile_1 = require("./deleteFile");
/**
 * ディレクトリーとその中身を削除する処理です。
 * @param dir
 */
var deleteDirectory = function (dir) {
    console.log('::delete-directory::');
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                return reject(err);
            }
            fs.readdir(dir, function (fsReadError, files) {
                if (fsReadError) {
                    return reject(fsReadError);
                }
                Promise.all(files.map(function (file) {
                    return (0, deleteFile_1.deleteFile)(dir, file);
                }))
                    .then(function () {
                    fs.rmdir(dir, function (fsRmError) {
                        if (fsRmError) {
                            return reject(fsRmError);
                        }
                        resolve();
                    });
                })["catch"](reject);
            });
        });
    });
};
exports.deleteDirectory = deleteDirectory;

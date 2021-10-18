"use strict";
exports.__esModule = true;
var File = /** @class */ (function () {
    function File(appTemporaryPath) {
        console.log('delete-file');
        var path = require('path');
        // 	テンポラリパス生成
        this.temporaryPath = path.join(appTemporaryPath, 'a-img-generator');
        this.temporaryCompressPath = path.join(appTemporaryPath, 'a-img-generator-compress');
    }
    File.prototype.setDefaultFileName = function (name) {
        this.lastSelectBaseName = name;
    };
    /**
     * ファイルを削除する処理です。
     * @param {string} dir
     * @param file
     * @returns {Promise<any>}
     */
    File.prototype.deleteFile = function (dir, file) {
        var _this = this;
        var fs = require('fs');
        var path = require('path');
        return new Promise(function (resolve, reject) {
            var filePath = path.join(dir, file);
            fs.lstat(filePath, function (lstatErorr, stats) {
                if (lstatErorr) {
                    return reject(lstatErorr);
                }
                if (stats.isDirectory()) {
                    resolve(_this.deleteDirectory(filePath));
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
    /**
     * ディレクトリーとその中身を削除する処理です。
     * @param {string} dir
     * @returns {Promise<any>}
     */
    File.prototype.deleteDirectory = function (dir) {
        var _this = this;
        console.log('::delete-directory::');
        var fs = require('fs');
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
                        return _this.deleteFile(dir, file);
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
    File.prototype.createDirectory = function (directory) {
        return new Promise(function (resolve, reject) {
            try {
                require('fs').mkdirSync(directory);
                resolve();
            }
            catch (e) {
                reject();
            }
        });
    };
    File.prototype.cleanTemporaryDirectory = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = require('path');
            var pngTemporary = path.join(_this.temporaryPath);
            var pngCompressTemporary = path.join(_this.temporaryCompressPath);
            _this.deleteDirectory(pngTemporary)["catch"](function () {
                console.log("\u30D5\u30A9\u30EB\u30C0\u3092\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002" + pngTemporary);
            })
                .then(function () {
                return _this.deleteDirectory(pngCompressTemporary);
            })["catch"](function () {
                console.log("\u30D5\u30A9\u30EB\u30C0\u3092\u524A\u9664\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002" + pngCompressTemporary);
            })
                .then(function () {
                // フォルダーを作成
                _this.createDirectory(_this.temporaryPath);
            })["catch"](function () {
                console.log("\u30D5\u30A9\u30EB\u30C0\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F " + _this.temporaryPath);
            })
                .then(function () {
                // フォルダーを作成
                _this.createDirectory(_this.temporaryCompressPath);
            })["catch"](function () {
                console.log("\u30D5\u30A9\u30EB\u30C0\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F " + _this.temporaryCompressPath);
            })
                .then(function () {
                console.log('clean-temporary : success');
                resolve();
            });
        });
    };
    File.prototype.copyTemporaryImage = function (frameNumber, imagePath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var fs = require('fs');
            var path = require('path');
            var src = imagePath;
            var destination = path.join(_this.temporaryPath, "frame" + frameNumber + ".png");
            var r = fs.createReadStream(src);
            var w = fs.createWriteStream(destination);
            r.on('error', function (err) {
                reject(err);
            });
            w.on('error', function (err) {
                reject(err);
            });
            w.on('close', function (ex) {
                resolve();
            });
            r.pipe(w);
        });
    };
    File.prototype.openSaveDialog = function (imageType, window, defaultSaveDirectory) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var title = '';
            var defaultPathName = '';
            var defaultPath = '';
            var extention = '';
            var lastBaseName = _this.lastSelectBaseName;
            console.log(lastBaseName);
            switch (imageType) {
                case 'png':
                    title = 'ファイルの保存先を選択';
                    defaultPathName = lastBaseName + ".png";
                    extention = 'png';
                    break;
                case 'webp':
                    title = 'ファイルの保存先を選択';
                    defaultPathName = lastBaseName + ".webp";
                    extention = 'webp';
                    break;
                case 'html':
                    title = 'ファイルの保存先を選択';
                    defaultPathName = lastBaseName + ".html";
                    extention = 'html';
                    break;
            }
            var dialog = require('electron').dialog;
            var fs = require('fs');
            try {
                fs.statSync(_this.lastSelectSaveDirectories);
            }
            catch (e) {
                // 	失敗したらパス修正
                _this.lastSelectSaveDirectories = defaultSaveDirectory;
            }
            var path = require('path');
            defaultPath = path.join(_this.lastSelectSaveDirectories, defaultPathName);
            dialog.showSaveDialog(window, {
                title: title,
                defaultPath: defaultPath,
                filters: [
                    {
                        name: imageType === 'html' ? 'html' : 'Images',
                        extensions: [extention]
                    }
                ]
            }, function (fileName) {
                if (fileName) {
                    _this.lastSelectSaveDirectories = path.dirname(fileName);
                    _this.lastSelectBaseName = path.basename(fileName, "." + imageType);
                    resolve({
                        result: true,
                        fileName: fileName,
                        lastDirectory: _this.lastSelectSaveDirectories
                    });
                }
                else {
                    resolve({ result: false });
                }
            });
        });
    };
    return File;
}());
exports["default"] = File;

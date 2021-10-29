"use strict";
exports.__esModule = true;
var error_type_1 = require("../common-src/error/error-type");
var CompressionType_1 = require("../common-src/type/CompressionType");
var PresetType_1 = require("../common-src/type/PresetType");
var LineStampValidator_1 = require("../common-src/validators/LineStampValidator");
var Error;
(function (Error) {
    Error.ENOENT_ERROR = 'ENOENT';
})(Error || (Error = {}));
var File = /** @class */ (function () {
    function File(appTemporaryPath, appPath, sendError, errorMessage, defaultSaveDirectory) {
        console.log('delete-file');
        var path = require('path');
        // 	テンポラリパス生成
        this.temporaryPath = path.join(appTemporaryPath, 'a-img-generator');
        this.temporaryCompressPath = path.join(appTemporaryPath, 'a-img-generator-compress');
        this.appPath = appPath;
        this.sendError = sendError;
        this.errorMessage = errorMessage;
        this.defaultSaveDirectory = defaultSaveDirectory;
    }
    File.prototype.setDefaultFileName = function (name) {
        this.lastSelectBaseName = name;
    };
    File.prototype.setMainWindow = function (window) {
        this.mainWindow = window;
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
    File.prototype.setLocaleData = function (localeData) {
        this.localeData = localeData;
    };
    File.prototype.getExeExt = function () {
        var platform = require('os').platform();
        return platform === 'win32' ? '.exe' : '';
    };
    File.prototype.exec = function (temporaryPath, version, itemList, animationOptionData) {
        var _this = this;
        this._version = version;
        // 	platformで実行先の拡張子を変える
        console.log(this.getExeExt());
        console.log(process.platform);
        var SHA256 = require('crypto-js/sha256');
        // お問い合わせコード生成
        this.inquiryCode = SHA256(require('os').platform + '/' + new Date().toString())
            .toString()
            .slice(0, 8);
        console.log(this.inquiryCode);
        // 	テンポラリパス生成
        var path = require('path');
        this.itemList = itemList;
        this.temporaryPath = path.join(temporaryPath, 'a-img-generator');
        this.temporaryCompressPath = path.join(temporaryPath, 'a-img-generator-compress');
        this.animationOptionData = animationOptionData;
        this.generateCancelPNG = false;
        this.generateCancelHTML = false;
        this.generateCancelWebP = false;
        this.errorCode = error_type_1.ErrorType.UNKNOWN; // 	デフォルトのエラーメッセージ
        this.errorDetail = ''; // 	追加のエラーメッセージ
        // PNG事前圧縮&APNGファイルを生成する
        var compressPNG = this.animationOptionData.enabledPngCompress &&
            this.animationOptionData.enabledExportApng;
        // 	最終的なテンポラリパスを設定する
        if (compressPNG) {
            this.temporaryLastPath = this.temporaryCompressPath;
        }
        else {
            this.temporaryLastPath = this.temporaryPath;
        }
        this.errorCode = error_type_1.ErrorType.TEMPORARY_CLEAN_ERROR;
        return this.cleanTemporaryDirectory()
            .then(function () {
            console.log('make_temporary');
            _this.errorCode = error_type_1.ErrorType.MAKE_TEMPORARY_ERROR;
            return _this._copyTemporaryDirectory();
        })
            .then(function () {
            if (compressPNG) {
                _this.errorCode = error_type_1.ErrorType.PNG_COMPRESS_ERROR;
                return _this._pngCompressAll();
            }
        })
            .then(function () {
            // APNG書き出しが有効になっている場合
            if (_this.animationOptionData.enabledExportApng === true) {
                // ひとまず謎エラーとしとく
                _this.errorCode = error_type_1.ErrorType.APNG_OTHER_ERORR;
                return _this.openSaveDialog('png', _this.mainWindow, _this.defaultSaveDirectory).then(function (fileName) {
                    if (fileName) {
                        return _this._generateApng(fileName);
                    }
                    else {
                        _this.generateCancelPNG = true;
                    }
                });
            }
        })
            .then(function () {
            // WebP書き出しが有効になっている場合
            if (_this.animationOptionData.enabledExportWebp === true) {
                return _this.openSaveDialog('webp', _this.mainWindow, _this.defaultSaveDirectory).then(function (fileName) {
                    if (fileName) {
                        return _this._generateWebp(fileName);
                    }
                    else {
                        _this.generateCancelWebP = true;
                    }
                });
            }
        })
            .then(function () {
            // APNGとWebP画像の両方書き出しが有効になっている場合
            if (_this.animationOptionData.enabledExportHtml === true) {
                // 	画像ファイルが保存されているか。
                if (!_this._imageFileSaved()) {
                    _this.generateCancelHTML = true;
                    alert('画像ファイルが保存されなかったため、HTMLの保存を行いませんでした。');
                    return;
                }
                _this.errorCode = error_type_1.ErrorType.HTML_ERROR;
                return _this.openSaveDialog('html', _this.mainWindow, _this.defaultSaveDirectory).then(function (fileName) {
                    if (fileName) {
                        return _this._generateHtml(fileName);
                    }
                    else {
                        _this.generateCancelHTML = true;
                    }
                });
            }
        })
            .then(function () {
            if (!((_this.animationOptionData.enabledExportHtml &&
                !_this.generateCancelHTML) ||
                _this._enableExportApng() ||
                _this._enableExportWebp())) {
                console.log('ファイルが一つも保存されませんでした');
                return Promise.resolve();
            }
            // エクスプローラーで開くでも、まだいいかも
            var shell = window.require('electron').shell;
            if (_this._enableExportHTML()) {
                shell.showItemInFolder(_this.selectedHTMLPath);
            }
            else if (_this._enableExportApng()) {
                shell.showItemInFolder(_this.selectedPNGPath);
            }
            else if (_this._enableExportWebp()) {
                // 	ここにこない可能性は高い
                shell.showItemInFolder(_this.selectedWebPPath);
            }
            return Promise.resolve();
        })["catch"](function (message) {
            // エラー内容の送信
            if (message) {
                console.error(message);
                _this.errorStack = message.stack;
                _this.sendError.exec(_this._version, _this.inquiryCode, 'ERROR', _this.errorCode.toString(), message.stack);
                _this.errorMessage.showErrorMessage(_this.errorCode, _this.inquiryCode, _this.errorDetail, _this.errorStack, _this.localeData.APP_NAME, _this.mainWindow);
            }
            return Promise.reject();
        });
    };
    /**
     * HTMLファイルを作成します。
     * @private
     */
    /* tslint:disable:quotemark */
    File.prototype._generateHtml = function (exportFilePath) {
        var fs = require('fs');
        var filePNGName = this._getApngPathRelativeHTML();
        var fileWebPName = this._getWebpPathReleativeHTML();
        var imageElement = "";
        var scriptElement1 = "";
        var scriptElement2 = "";
        if (this.animationOptionData.enabledExportApng &&
            this.animationOptionData.enabledExportWebp) {
            // tslint-disable-next-line quotemark
            imageElement = "\n    <!-- Chrome \u3068 Firefox \u3068 Safari \u3067\u518D\u751F\u53EF\u80FD (IE, Edge \u3067\u306F\u30A2\u30CB\u30E1\u306F\u518D\u751F\u3067\u304D\u307E\u305B\u3093) -->\n    <picture>\n\t  <!-- Chrome \u7528 -->\n      <source type=\"image/webp\" srcset=\"" + fileWebPName + "\" />\n      <!-- Firefox, Safari \u7528 -->\n      <img src=\"" + filePNGName + "\" width=\"" + this.animationOptionData.imageInfo.width + "\"\n      height=\"" + this.animationOptionData.imageInfo.height + "\" alt=\"\" class=\"apng-image\" />\n    </picture>";
            scriptElement1 = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js\"></script>";
            scriptElement2 = "\n    <script>\n      if(window.navigator.userAgent.indexOf(\"Chrome\") >= 0 && window.navigator.userAgent.indexOf(\"Edge\") == -1){\n        // Chrome \u306E\u5834\u5408\u306F WebP \u30D5\u30A1\u30A4\u30EB\u304C\u8868\u793A\u3055\u308C\u308B\n      }else{\n        // Chrome \u4EE5\u5916\u306E\u5834\u5408\u306F APNG \u5229\u7528\u53EF\u5426\u3092\u5224\u5B9A\u3059\u308B\n        APNG.ifNeeded().then(function () {\n          // APNG \u306B\u672A\u5BFE\u5FDC\u306E\u30D6\u30E9\u30A6\u30B6(\u4F8B\uFF1AIE, Edge)\u3067\u306F\u3001JS\u30E9\u30A4\u30D6\u30E9\u30EA\u300Capng-canvas\u300D\u306B\u3088\u308A\u8868\u793A\u53EF\u80FD\u306B\u3059\u308B\n          var images = document.querySelectorAll(\".apng-image\");\n          for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }\n        });\n      }\n    </script>";
        }
        else if (this.animationOptionData.enabledExportApng) {
            imageElement = "\n    <!-- Firefox \u3068 Safari \u3067\u518D\u751F\u53EF\u80FD (Chrome, IE, Edge \u3067\u306F\u30A2\u30CB\u30E1\u306F\u518D\u751F\u3067\u304D\u307E\u305B\u3093) -->\n    <img src=\"" + filePNGName + "\" width=\"" + this.animationOptionData.imageInfo.width + "\"\n    height=\"" + this.animationOptionData.imageInfo.height + "\" alt=\"\" class=\"apng-image\" />";
            scriptElement1 = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js\"></script>";
            scriptElement2 = "\n    <script>\n      // APNG \u306B\u672A\u5BFE\u5FDC\u306E\u30D6\u30E9\u30A6\u30B6(\u4F8B\uFF1AIE, Edge, Chrome)\u3067\u306F\u3001JS\u30E9\u30A4\u30D6\u30E9\u30EA\u300Capng-canvas\u300D\u306B\u3088\u308A\u8868\u793A\u53EF\u80FD\u306B\u3059\u308B\n      APNG.ifNeeded().then(function () {\n        var images = document.querySelectorAll(\".apng-image\");\n        for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }\n      });\n    </script>";
        }
        else if (this.animationOptionData.enabledExportWebp) {
            imageElement = "\n    <!-- Chrome \u3067\u518D\u751F\u53EF\u80FD (IE, Edge, Firefox, Safari \u3067\u306F\u8868\u793A\u3067\u304D\u307E\u305B\u3093) -->\n    <img src=\"" + fileWebPName + "\" width=\"" + this.animationOptionData.imageInfo.width + "\"\n    height=\"" + this.animationOptionData.imageInfo.height + "\" alt=\"\" />";
        }
        else {
            return;
        }
        // tslint:disable-next-line:max-line-length
        var backgroundImageUrl = 'https://raw.githubusercontent.com/ics-creative/160609_animation-image-generator/master/app/imgs/opacity.png';
        var data = "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n    <style>\n      /* \u78BA\u8A8D\u7528\u306ECSS */\n      body { background: #444; }\n      picture img, .apng-image\n      {\n        background: url(" + backgroundImageUrl + ");\n      }\n    </style>\n    " + scriptElement1 + "\n  </head>\n  <body>\n  \t" + imageElement + "\n  \t" + scriptElement2 + "\n  </body>\n</html>";
        fs.writeFileSync(exportFilePath, data);
    };
    File.prototype._getApngPathRelativeHTML = function () {
        if (this._enableExportApng()) {
            return require('path').relative(this.selectedHTMLDirectoryPath, this.selectedPNGPath);
        }
        return undefined;
    };
    File.prototype._enableExportHTML = function () {
        return (this.animationOptionData.enabledExportHtml && !this.generateCancelHTML);
    };
    File.prototype._enableExportApng = function () {
        return (this.animationOptionData.enabledExportApng && !this.generateCancelPNG);
    };
    File.prototype._enableExportWebp = function () {
        return (this.animationOptionData.enabledExportWebp && !this.generateCancelWebP);
    };
    /**
     * HTMLファイルを作成します。
     * @private
     */
    File.prototype._getWebpPathReleativeHTML = function () {
        if (this._enableExportWebp()) {
            return require('path').relative(this.selectedHTMLDirectoryPath, this.selectedWebPPath);
        }
        return undefined;
    };
    /**
     * ファイルが保存されているかを調べます。
     * @returns {any}
     */
    File.prototype._imageFileSaved = function () {
        return ((this.animationOptionData.enabledExportWebp &&
            !this.generateCancelWebP) ||
            (this.animationOptionData.enabledExportApng && !this.generateCancelPNG));
    };
    File.prototype.setErrorDetail = function (stdout) {
        if (stdout !== '') {
            var errorMesageList = stdout.split('\n').filter(function (e) {
                return e !== '';
            });
            var errorMessage = errorMesageList.pop();
            this.errorDetail = errorMessage ? errorMessage : '';
        }
    };
    /**
     * WEBP アニメーション画像を作ります。
     * @returns {Promise<T>}
     * @private
     */
    File.prototype._generateWebp = function (exportFilePath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = require('path');
            var appPath = _this.appPath;
            var execFile = require('child_process').execFile;
            var pngPath = path.join(_this.temporaryPath);
            var options = [];
            var frameMs = Math.round(1000 / _this.animationOptionData.fps);
            var pngFiles = [];
            for (var i = 0; i < _this.itemList.length; i++) {
                // フレーム数に違和感がある
                options.push("-frame");
                options.push(pngPath + "/frame" + i + ".png.webp");
                options.push("+" + frameMs + "+0+0+1");
                pngFiles.push(pngPath + "/frame" + i + ".png");
            }
            if (_this.animationOptionData.noLoop === false) {
                options.push("-loop");
                options.push(_this.animationOptionData.loop + '');
            }
            options.push("-o");
            options.push(exportFilePath);
            _this.errorCode = error_type_1.ErrorType.CWEBP_OTHER_ERROR;
            _this._convertPng2Webps(pngFiles)
                .then(function () {
                setImmediate(function () {
                    _this.errorCode = error_type_1.ErrorType.WEBPMUX_OTHER_ERROR;
                    execFile(appPath + "/bin/webpmux" + _this.getExeExt(), options, function (err, stdout, stderr) {
                        if (!err) {
                            resolve();
                        }
                        else {
                            console.error(stderr);
                            if (err.code === Error.ENOENT_ERROR) {
                                _this.errorCode = error_type_1.ErrorType.WEBPMUX_ACCESS_ERROR;
                            }
                            else {
                                _this.errorCode = error_type_1.ErrorType.WEBPMUX_ERROR;
                            }
                            // エラー内容の送信
                            _this.sendError.exec(_this._version, _this.inquiryCode, 'ERROR', _this.errorCode + '', err.code + ' : ' + stdout + ', message:' + err.message);
                            reject();
                        }
                    });
                });
            })["catch"](function () {
                reject();
            });
        });
    };
    File.prototype._convertPng2Webps = function (pngPaths) {
        var promises = [];
        for (var i = 0; i < pngPaths.length; i++) {
            promises.push(this._convertPng2Webp(pngPaths[i]));
        }
        return new Promise(function (resolve, reject) {
            Promise.all(promises)
                .then(function () {
                resolve();
            })["catch"](function () {
                reject();
            });
        });
    };
    File.prototype._convertPng2Webp = function (filePath) {
        var _this = this;
        var path = require('path');
        var appPath = this.appPath;
        var execFile = require('child_process').execFile;
        var options = [];
        options.push(filePath);
        options.push("-o");
        options.push(filePath + ".webp");
        options.push(filePath);
        if (this.animationOptionData.enabledWebpCompress === true) {
            options.push("-preset", "drawing");
        }
        else {
            options.push("-lossless");
            // 超低容量設定
            // options.push(`-q`, `100`);
            // options.push(`-m`, `6`);
        }
        return new Promise(function (resolve, reject) {
            setImmediate(function () {
                execFile(appPath + "/bin/cwebp" + _this.getExeExt(), options, function (err, stdout, stderr) {
                    if (!err) {
                        resolve();
                    }
                    else {
                        _this.setErrorDetail(stdout);
                        if (err.code === Error.ENOENT_ERROR) {
                            _this.errorCode = error_type_1.ErrorType.CWEBP_ACCESS_ERROR;
                        }
                        else {
                            _this.errorCode = error_type_1.ErrorType.CWEBP_ERROR;
                        }
                        // エラー内容の送信
                        _this.sendError.exec(_this._version, _this.inquiryCode, 'ERROR', _this.errorCode + '', err.code + ' : ' + stdout + ', message:' + err.message);
                        reject();
                        console.error(stderr);
                    }
                });
            });
        });
    };
    /**
     * APNG画像を保存します。
     * @returns {Promise<T>}
     * @private
     */
    File.prototype._generateApng = function (exportFilePath) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = require('path');
            var exec = require('child_process').execFile;
            var pngPath = path.join(_this.temporaryLastPath, 'frame*.png');
            var compressOptions = _this.getCompressOption(_this.animationOptionData.compression);
            console.log('this.animationOptionData.loop : ' + _this.animationOptionData.loop);
            var loopOption = '-l' +
                (_this.animationOptionData.noLoop ? 0 : _this.animationOptionData.loop);
            console.log('loopOption : ' + loopOption);
            var options = [
                exportFilePath,
                pngPath,
                '1',
                _this.animationOptionData.fps,
                compressOptions,
                loopOption,
                '-kc'
            ];
            setImmediate(function () {
                exec(path.join(_this.appPath, "/bin/apngasm" + _this.getExeExt()), options, function (err, stdout, stderr) {
                    if (!err) {
                        // TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
                        // exec(`/Applications/Safari.app`, [this.apngPath]);
                        if (_this.animationOptionData.preset === PresetType_1.PresetType.LINE) {
                            var stat = require('fs').statSync(exportFilePath);
                            var validateArr = LineStampValidator_1.LineStampValidator.validate(stat, _this.animationOptionData, _this.localeData);
                            if (validateArr.length > 0) {
                                var dialog = require('electron').dialog;
                                var win = _this.mainWindow;
                                var message = _this.localeData.VALIDATE_title;
                                var detailMessage = '・' + validateArr.join('\n\n・');
                                var dialogOption = {
                                    type: 'info',
                                    buttons: ['OK'],
                                    title: _this.localeData.APP_NAME,
                                    // message: message,
                                    detail: message + '\n\n' + detailMessage
                                };
                                dialog.showMessageBox(win, dialogOption);
                            }
                        }
                        resolve();
                    }
                    else {
                        _this.setErrorDetail(stdout);
                        if (err.code === Error.ENOENT_ERROR) {
                            _this.errorCode = error_type_1.ErrorType.APNG_ERORR;
                        }
                        else {
                            _this.errorCode = error_type_1.ErrorType.APNG_ACCESS_ERORR;
                        }
                        // エラー内容の送信
                        _this.sendError.exec(_this._version, _this.inquiryCode, 'ERROR', _this.errorCode + '', err.code + ' : ' + stdout + ', message:' + err.message);
                        reject();
                    }
                });
            });
        });
    };
    File.prototype._copyTemporaryDirectory = function () {
        var _this = this;
        var promises = this.itemList.map(function (item) {
            return _this.copyTemporaryImage(item.frameNumber, item.imagePath);
        });
        return Promise.all(promises);
    };
    File.prototype._pngCompressAll = function () {
        var _this = this;
        var promises = this.itemList.map(function (item) {
            return _this._pngCompress(item);
        });
        return Promise.all(promises);
    };
    /* tslint:enable:quotemark */
    File.prototype.getCompressOption = function (type) {
        switch (type) {
            case CompressionType_1.CompressionType.zlib:
                return '-z0';
            case CompressionType_1.CompressionType.zip7:
                return '-z1';
            case CompressionType_1.CompressionType.Zopfli:
                return '-z2';
        }
    };
    File.prototype._pngCompress = function (item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var path = require('path');
            var execFile = require('child_process').execFile;
            var options = [
                '--quality=65-80',
                '--speed',
                '1',
                '--output',
                path.join("" + _this.temporaryCompressPath, "frame" + item.frameNumber + ".png"),
                '--',
                path.join("" + _this.temporaryPath, "frame" + item.frameNumber + ".png")
            ];
            execFile(
            // 2018-05-15 一時的にファイルパスを変更
            _this.appPath + "/bin/pngquant" + _this.getExeExt(), options, function (err, stdout, stderr) {
                if (!err) {
                    resolve();
                }
                else {
                    console.error(err);
                    console.error(stderr);
                    if (err.code === Error.ENOENT_ERROR) {
                        _this.errorCode = error_type_1.ErrorType.APNG_ERORR;
                    }
                    else if (err.code === 99) {
                        _this.errorCode = error_type_1.ErrorType.PNG_COMPRESS_QUALITY_ERROR;
                    }
                    else {
                        _this.errorCode = error_type_1.ErrorType.PNG_COMPRESS_ERROR;
                    }
                    // エラー内容の送信
                    _this.sendError.exec(_this._version, _this.inquiryCode, 'ERROR', _this.errorCode + '', err.code + ' : ' + stdout + ', message:' + err.message);
                    reject();
                }
            });
        });
    };
    return File;
}());
exports["default"] = File;

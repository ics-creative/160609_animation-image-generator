"use strict";
var PresetType_1 = require("../type/PresetType");
var LineStampValidator_1 = require("../validators/LineStampValidator");
var CompressionType_1 = require("../type/CompressionType");
var ErrorCode_1 = require("../error/ErrorCode");
var Error;
(function (Error) {
    Error.ENOENT_ERROR = "ENOENT";
})(Error || (Error = {}));
var ProcessExportImage = (function () {
    function ProcessExportImage(localeData) {
        this.localeData = localeData;
        //	platformで実行先の拡張子を変える
        this.exeExt = process.platform == 'win32' ? ".exe" : "";
        this.lastSelectBaseName = this.localeData.defaultFileName;
    }
    ProcessExportImage.prototype.exec = function (itemList, animationOptionData) {
        var _this = this;
        //	テンポラリパス生成
        var remote = require('electron').remote;
        var app = remote.app;
        var path = require('path');
        this.itemList = itemList;
        this.temporaryPath = path.join(app.getPath('temp'), "a-img-generator");
        this.temporaryCompressPath = path.join(app.getPath('temp'), "a-img-generator-compress");
        this.animationOptionData = animationOptionData;
        this.generateCancelPNG = false;
        this.generateCancelHTML = false;
        this.generateCancelWebP = false;
        this.errorCode = ErrorCode_1.ErrorCode.UNKNOWN; //	デフォルトのエラーメッセージ
        this.errorDetail = ""; //	追加のエラーメッセージ
        // PNG事前圧縮&APNGファイルを生成する
        var compressPNG = (this.animationOptionData.enabledPngCompress && this.animationOptionData.enabledExportApng);
        //	最終的なテンポラリパスを設定する
        if (compressPNG) {
            this.temporaryLastPath = this.temporaryCompressPath;
        }
        else {
            this.temporaryLastPath = this.temporaryPath;
        }
        return new Promise(function (resolve, reject) {
            _this.errorCode = ErrorCode_1.ErrorCode.TEMPORARY_CLEAN_ERROR;
            _this._cleanTemporary()
                .then(function () {
                _this.errorCode = ErrorCode_1.ErrorCode.MAKE_TEMPORARY_ERROR;
                return _this._copyTemporaryDirectory();
            })
                .then(function () {
                if (compressPNG) {
                    _this.errorCode = ErrorCode_1.ErrorCode.PNG_COMPRESS_ERROR;
                    return _this._pngCompressAll();
                }
            })
                .then(function () {
                // APNG書き出しが有効になっている場合
                if (_this.animationOptionData.enabledExportApng == true) {
                    // ひとまず謎エラーとしとく
                    _this.errorCode = ErrorCode_1.ErrorCode.APNG_OTHER_ERORR;
                    return _this.openSaveDialog("png")
                        .then(function (fileName) {
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
                if (_this.animationOptionData.enabledExportWebp == true) {
                    return _this.openSaveDialog("webp")
                        .then(function (fileName) {
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
                if (_this.animationOptionData.enabledExportHtml == true) {
                    //	画像ファイルが保存されているか。
                    if (!_this._imageFileSaved()) {
                        _this.generateCancelHTML = true;
                        alert("画像ファイルが保存されなかったため、HTMLの保存を行いませんでした。");
                        return;
                    }
                    _this.errorCode = ErrorCode_1.ErrorCode.HTML_ERROR;
                    return _this.openSaveDialog("html")
                        .then(function (fileName) {
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
                if (!((_this.animationOptionData.enabledExportHtml && !_this.generateCancelHTML) ||
                    _this._enableExportApng() ||
                    _this._enableExportWebp())) {
                    console.log("ファイルが一つも保存されませんでした");
                    resolve();
                    return;
                }
                // エクスプローラーで開くでも、まだいいかも
                var shell = require('electron').shell;
                if (_this._enableExportHTML()) {
                    shell.showItemInFolder(_this.selectedHTMLPath);
                }
                else if (_this._enableExportApng()) {
                    shell.showItemInFolder(_this.selectedPNGPath);
                }
                else if (_this._enableExportWebp()) {
                    //	ここにこない可能性は高い
                    shell.showItemInFolder(_this.selectedWebPPath);
                }
                resolve();
            })
                .catch(function () {
                reject();
            });
        });
    };
    /**
     * ファイルが保存されているかを調べます。
     * @returns {any}
     */
    ProcessExportImage.prototype._imageFileSaved = function () {
        return ((this.animationOptionData.enabledExportWebp && !this.generateCancelWebP) ||
            (this.animationOptionData.enabledExportApng && !this.generateCancelPNG));
    };
    /**
     * 作業用フォルダーのクリーンアップ
     * @returns {Promise<any>}
     * @private
     */
    ProcessExportImage.prototype._cleanTemporary = function () {
        var _this = this;
        return new Promise((function (resolve, reject) {
            var del = require('del');
            var path = require('path');
            var pngTemporary = path.join(_this.temporaryPath, "*.*");
            var pngCompressTemporary = path.join(_this.temporaryCompressPath, "*.*");
            del([pngTemporary, pngCompressTemporary], { force: true }).then(function (paths) {
                var fs = require('fs');
                // フォルダーを作成
                try {
                    fs.mkdirSync(_this.temporaryPath);
                }
                catch (e) {
                    console.log("フォルダーの作成に失敗しました。:" + _this.temporaryPath);
                }
                try {
                    // フォルダーを作成
                    fs.mkdirSync(_this.temporaryCompressPath);
                }
                catch (e) {
                    console.log("フォルダーの作成に失敗しました。:" + _this.temporaryCompressPath);
                }
                console.log("clean-temporary:success");
                resolve();
            });
        }));
    };
    ProcessExportImage.prototype._copyTemporaryDirectory = function () {
        var _this = this;
        var promises = this.itemList.map(function (item) {
            return _this._copyTemporaryImage(item);
        });
        return Promise.all(promises);
    };
    ProcessExportImage.prototype._copyTemporaryImage = function (item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            setImmediate(function () {
                var fs = require('fs');
                var path = require('path');
                var src = item.imagePath;
                var destination = path.join(_this.temporaryPath, "frame" + item.frameNumber + ".png");
                var r = fs.createReadStream(src);
                var w = fs.createWriteStream(destination);
                r.on("error", function (err) {
                    reject(err);
                });
                w.on("error", function (err) {
                    reject(err);
                });
                w.on("close", function (ex) {
                    resolve();
                });
                r.pipe(w);
            });
        });
    };
    /**
     * APNG画像を保存します。
     * @returns {Promise<T>}
     * @private
     */
    ProcessExportImage.prototype._generateApng = function (exportFilePath) {
        var _this = this;
        return new Promise((function (resolve, reject) {
            var remote = require('electron').remote;
            var path = require('path');
            var app = remote.app;
            var appPath = app.getAppPath();
            var exec = require('child_process').execFile;
            var pngPath = path.join(_this.temporaryLastPath, "frame*.png");
            var compressOptions = _this.getCompressOption(_this.animationOptionData.compression);
            console.log("this.animationOptionData.loop : " + _this.animationOptionData.loop);
            var loopOption = "-l" + (_this.animationOptionData.noLoop ? 0 : _this.animationOptionData.loop);
            console.log("loopOption : " + loopOption);
            var options = [
                exportFilePath,
                pngPath,
                "1",
                _this.animationOptionData.fps,
                compressOptions,
                loopOption,
                "-kc"
            ];
            setImmediate(function () {
                exec(path.join(appPath, "/bin/apngasm" + _this.exeExt), options, function (err, stdout, stderr) {
                    if (!err) {
                        // TODO 書きだしたフォルダーを対応ブラウザーで開く (OSで分岐)
                        //exec(`/Applications/Safari.app`, [this.apngPath]);
                        if (_this.animationOptionData.preset == PresetType_1.PresetType.LINE) {
                            var validateArr = LineStampValidator_1.LineStampValidator.validate(exportFilePath, _this.animationOptionData, _this.localeData);
                            if (validateArr.length > 0) {
                                var dialog = require('electron').remote.dialog;
                                var win = require('electron').remote.getCurrentWindow();
                                var message = _this.localeData.VALIDATE_title;
                                var detailMessage = "・" + validateArr.join("\n\n・");
                                var options = {
                                    type: "info",
                                    buttons: ["OK"],
                                    title: _this.localeData.APP_NAME,
                                    //message: message,
                                    detail: message + "\n\n" + detailMessage
                                };
                                dialog.showMessageBox(win, options);
                            }
                        }
                        resolve();
                    }
                    else {
                        _this.setErrorDetail(stdout);
                        if (err.code == Error.ENOENT_ERROR) {
                            _this.errorCode = ErrorCode_1.ErrorCode.APNG_ERORR;
                        }
                        else {
                            _this.errorCode = ErrorCode_1.ErrorCode.APNG_ACCESS_ERORR;
                        }
                        reject();
                    }
                });
            });
        }));
    };
    ProcessExportImage.prototype.setErrorDetail = function (stdout) {
        if (stdout != "") {
            var errorMesageList = stdout.split("\n").filter(function (e) {
                return e !== "";
            });
            var errorMessage = errorMesageList.pop();
            this.errorDetail = errorMessage ? errorMessage : "";
        }
    };
    /**
     * WEBP アニメーション画像を作ります。
     * @returns {Promise<T>}
     * @private
     */
    ProcessExportImage.prototype._generateWebp = function (exportFilePath) {
        var _this = this;
        return new Promise((function (resolve, reject) {
            var remote = require('electron').remote;
            var path = require('path');
            var app = remote.app;
            var appPath = app.getAppPath();
            var execFile = require('child_process').execFile;
            var pngPath = path.join(_this.temporaryPath);
            var options = [];
            var frameMs = Math.round(1000 / _this.animationOptionData.fps);
            var pngFiles = [];
            for (var i = 0; i < _this.itemList.length; i++) {
                // なんかおかしい
                options.push("-frame");
                options.push(pngPath + "/frame" + i + ".png.webp");
                options.push("+" + frameMs + "+0+0+1");
                pngFiles.push(pngPath + "/frame" + i + ".png");
            }
            if (_this.animationOptionData.noLoop == false) {
                options.push("-loop");
                var loopNum = _this.animationOptionData.loop - 1;
                // ループ回数が0だと無限ループになる
                // ループ回数が1だと2ループになる
                // 一回きりの再生ができない・・・！
                if (loopNum == 0) {
                    loopNum = 1; // バグ
                }
                options.push(loopNum + "");
            }
            options.push("-o");
            options.push(exportFilePath);
            _this.errorCode = ErrorCode_1.ErrorCode.CWEBP_OTHER_ERROR;
            _this._convertPng2Webps(pngFiles).then(function () {
                setImmediate(function () {
                    _this.errorCode = ErrorCode_1.ErrorCode.WEBPMUX_OTHER_ERROR;
                    execFile(appPath + "/bin/webpmux" + _this.exeExt, options, function (err, stdout, stderr) {
                        if (!err) {
                            resolve();
                        }
                        else {
                            console.error(stderr);
                            if (err.code == Error.ENOENT_ERROR) {
                                _this.errorCode = ErrorCode_1.ErrorCode.WEBPMUX_ACCESS_ERROR;
                            }
                            else {
                                _this.errorCode = ErrorCode_1.ErrorCode.WEBPMUX_ERROR;
                            }
                            reject();
                        }
                    });
                });
            }).catch(function () {
                reject();
            });
        }));
    };
    ProcessExportImage.prototype._convertPng2Webps = function (pngPaths) {
        var promises = [];
        for (var i = 0; i < pngPaths.length; i++) {
            promises.push(this._convertPng2Webp(pngPaths[i]));
        }
        return new Promise((function (resolve, reject) {
            Promise.all(promises).then(function () {
                resolve();
            }).catch(function () {
                reject();
            });
        }));
    };
    ProcessExportImage.prototype._convertPng2Webp = function (filePath) {
        var _this = this;
        var remote = require('electron').remote;
        var appPath = remote.app.getAppPath();
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
        }
        return new Promise((function (resolve, reject) {
            setImmediate(function () {
                execFile(appPath + "/bin/cwebp" + _this.exeExt, options, function (err, stdout, stderr) {
                    if (!err) {
                        resolve();
                    }
                    else {
                        _this.setErrorDetail(stdout);
                        if (err.code == Error.ENOENT_ERROR) {
                            _this.errorCode = ErrorCode_1.ErrorCode.CWEBP_ACCESS_ERROR;
                        }
                        else {
                            _this.errorCode = ErrorCode_1.ErrorCode.CWEBP_ERROR;
                        }
                        reject();
                        console.error(stderr);
                    }
                });
            });
        }));
    };
    ProcessExportImage.prototype._enableExportHTML = function () {
        return this.animationOptionData.enabledExportHtml && !this.generateCancelHTML;
    };
    ProcessExportImage.prototype._enableExportApng = function () {
        return this.animationOptionData.enabledExportApng && !this.generateCancelPNG;
    };
    ProcessExportImage.prototype._getApngPathRelativeHTML = function () {
        if (this._enableExportApng()) {
            return require('path').relative(this.selectedHTMLDirectoryPath, this.selectedPNGPath);
        }
        return undefined;
    };
    ProcessExportImage.prototype._enableExportWebp = function () {
        return this.animationOptionData.enabledExportWebp && !this.generateCancelWebP;
    };
    /**
     * HTMLファイルを作成します。
     * @private
     */
    ProcessExportImage.prototype._getWebpPathReleativeHTML = function () {
        if (this._enableExportWebp()) {
            return require('path').relative(this.selectedHTMLDirectoryPath, this.selectedWebPPath);
        }
        return undefined;
    };
    /**
     * HTMLファイルを作成します。
     * @private
     */
    ProcessExportImage.prototype._generateHtml = function (exportFilePath) {
        var fs = require('fs');
        var path = require('path');
        var filePNGName = this._getApngPathRelativeHTML();
        var fileWebPName = this._getWebpPathReleativeHTML();
        var imageElement = "";
        var scriptElement1 = "";
        var scriptElement2 = "";
        if (this.animationOptionData.enabledExportApng && this.animationOptionData.enabledExportWebp) {
            imageElement = "\n    <!-- Chrome \u3068 Firefox \u3068 Safari \u3067\u518D\u751F\u53EF\u80FD (IE, Edge \u3067\u306F\u30A2\u30CB\u30E1\u306F\u518D\u751F\u3067\u304D\u307E\u305B\u3093) -->\t\n    <picture>\n\t  <!-- Chrome \u7528 -->\n      <source type=\"image/webp\" srcset=\"" + fileWebPName + "\" />\n      <!-- Firefox, Safari \u7528 -->\n      <img src=\"" + filePNGName + "\" width=\"" + this.animationOptionData.imageInfo.width + "\" height=\"" + this.animationOptionData.imageInfo.height + "\" alt=\"\" class=\"apng-image\" />\n    </picture>";
            scriptElement1 = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js\"></script>";
            scriptElement2 = "\n    <script>\n      if(window.navigator.userAgent.indexOf('Chrome') >= 0 && window.navigator.userAgent.indexOf('Edge') == -1){\n        // Chrome \u306E\u5834\u5408\u306F WebP \u30D5\u30A1\u30A4\u30EB\u304C\u8868\u793A\u3055\u308C\u308B\n      }else{\n        // Chrome \u4EE5\u5916\u306E\u5834\u5408\u306F APNG \u5229\u7528\u53EF\u5426\u3092\u5224\u5B9A\u3059\u308B\n        APNG.ifNeeded().then(function () {\n          // APNG \u306B\u672A\u5BFE\u5FDC\u306E\u30D6\u30E9\u30A6\u30B6(\u4F8B\uFF1AIE, Edge)\u3067\u306F\u3001JS\u30E9\u30A4\u30D6\u30E9\u30EA\u300Capng-canvas\u300D\u306B\u3088\u308A\u8868\u793A\u53EF\u80FD\u306B\u3059\u308B\n          var images = document.querySelectorAll(\".apng-image\");\n          for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }\n        });\n      }\n    </script>";
        }
        else if (this.animationOptionData.enabledExportApng) {
            imageElement = "\n    <!-- Firefox \u3068 Safari \u3067\u518D\u751F\u53EF\u80FD (Chrome, IE, Edge \u3067\u306F\u30A2\u30CB\u30E1\u306F\u518D\u751F\u3067\u304D\u307E\u305B\u3093) -->\n    <img src=\"" + filePNGName + "\" width=\"" + this.animationOptionData.imageInfo.width + "\" height=\"" + this.animationOptionData.imageInfo.height + "\" alt=\"\" class=\"apng-image\" />";
            scriptElement1 = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js\"></script>";
            scriptElement2 = "\n    <script>\n      // APNG \u306B\u672A\u5BFE\u5FDC\u306E\u30D6\u30E9\u30A6\u30B6(\u4F8B\uFF1AIE, Edge, Chrome)\u3067\u306F\u3001JS\u30E9\u30A4\u30D6\u30E9\u30EA\u300Capng-canvas\u300D\u306B\u3088\u308A\u8868\u793A\u53EF\u80FD\u306B\u3059\u308B\n      APNG.ifNeeded().then(function () {\n        var images = document.querySelectorAll(\".apng-image\");\n        for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }\n      });\n    </script>";
        }
        else if (this.animationOptionData.enabledExportWebp) {
            imageElement = "\n    <!-- Chrome \u3067\u518D\u751F\u53EF\u80FD (IE, Edge, Firefox, Safari \u3067\u306F\u8868\u793A\u3067\u304D\u307E\u305B\u3093) -->\n    <img src=\"" + fileWebPName + "\" width=\"" + this.animationOptionData.imageInfo.width + "\" height=\"" + this.animationOptionData.imageInfo.height + "\" alt=\"\" />";
        }
        else {
            return;
        }
        var data = "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n    <style>\n      /* \u78BA\u8A8D\u7528\u306ECSS */\n      body { background: #444; }\n      picture img, .apng-image { background: url(https://raw.githubusercontent.com/ics-creative/160609_animation-image-generator/master/app/imgs/opacity.png); }\n    </style>\n    " + scriptElement1 + "\n  </head>\n  <body>\n  \t" + imageElement + "\n  \t" + scriptElement2 + "\n  </body>\n</html>";
        fs.writeFileSync(exportFilePath, data);
    };
    ProcessExportImage.prototype.getCompressOption = function (type) {
        switch (type) {
            case CompressionType_1.CompressionType.zlib:
                return "-z0";
            case CompressionType_1.CompressionType.zip7:
                return "-z1";
            case CompressionType_1.CompressionType.Zopfli:
                return "-z2";
        }
    };
    ProcessExportImage.prototype._pngCompress = function (item) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var remote = require('electron').remote;
            var app = remote.app;
            var path = require('path');
            var fs = require('fs');
            var appPath = app.getAppPath();
            var execFile = require('child_process').execFile;
            var options = [
                "--quality=65-80", "--speed", "1",
                "--output", path.join("" + _this.temporaryCompressPath, "frame" + item.frameNumber + ".png"),
                "--", path.join("" + _this.temporaryPath, "frame" + item.frameNumber + ".png")
            ];
            execFile(appPath + "/bin/pngquant" + _this.exeExt, options, function (err, stdout, stderr) {
                if (!err) {
                    resolve();
                }
                else {
                    console.error(err);
                    console.error(stderr);
                    reject();
                }
            });
        });
    };
    ProcessExportImage.prototype._pngCompressAll = function () {
        var _this = this;
        var promises = this.itemList.map(function (item) {
            return _this._pngCompress(item);
        });
        return Promise.all(promises);
    };
    ProcessExportImage.prototype.openSaveDialog = function (imageType) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var title = "";
            var defaultPathName = "";
            var defaultPath = "";
            var extention = "";
            var lastBaseName = _this.lastSelectBaseName;
            console.log(lastBaseName);
            switch (imageType) {
                case "png":
                    title = "ファイルの保存先を選択";
                    defaultPathName = lastBaseName + ".png";
                    extention = "png";
                    break;
                case "webp":
                    title = "ファイルの保存先を選択";
                    defaultPathName = lastBaseName + ".webp";
                    extention = "webp";
                    break;
                case "html":
                    title = "ファイルの保存先を選択";
                    defaultPathName = lastBaseName + ".html";
                    extention = "html";
                    break;
            }
            var remote = require('electron').remote;
            var dialog = require('electron').remote.dialog;
            var win = remote.getCurrentWindow();
            var app = remote.app;
            var fs = require('fs');
            try {
                fs.statSync(_this.lastSelectSaveDirectories);
            }
            catch (e) {
                console.log("catch!");
                //	失敗したらパス修正
                _this.lastSelectSaveDirectories = app.getPath("desktop");
            }
            var path = require('path');
            defaultPath = path.join(_this.lastSelectSaveDirectories, defaultPathName);
            dialog.showSaveDialog(win, {
                title: title,
                defaultPath: defaultPath,
                filters: [{ name: imageType == "html" ? "html" : "Images", extensions: [extention] }],
                properties: ['openFile']
            }, function (fileName) {
                if (fileName) {
                    var path_1 = require("path");
                    _this.lastSelectSaveDirectories = path_1.dirname(fileName);
                    _this.lastSelectBaseName = path_1.basename(fileName, "." + imageType);
                    console.log(_this.lastSelectBaseName);
                    switch (imageType) {
                        case "png":
                            _this.selectedPNGPath = "" + fileName;
                            break;
                        case "webp":
                            _this.selectedWebPPath = "" + fileName;
                            break;
                        case "html":
                            _this.selectedHTMLPath = "" + fileName;
                            _this.selectedHTMLDirectoryPath = _this.lastSelectSaveDirectories;
                            break;
                    }
                    resolve(fileName);
                }
                else {
                    resolve(null);
                }
            });
        });
    };
    return ProcessExportImage;
}());
exports.ProcessExportImage = ProcessExportImage;

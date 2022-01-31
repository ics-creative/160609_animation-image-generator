"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.execGenerate = void 0;
var path = require("path");
var fs = require("fs");
var emptyDirectory_1 = require("../fileFunctions/emptyDirectory");
var getExeExt_1 = require("../fileFunctions/getExeExt");
var error_type_1 = require("../../common-src/error/error-type");
var generateApng_1 = require("./generateApng");
var generateWebp_1 = require("./generateWebp");
var generateHtml_1 = require("./generateHtml");
var electron_1 = require("electron");
/** すべての元画像を作業フォルダにコピーします */
var copyTemporaryDirectory = function (itemList, destDir) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks;
    return __generator(this, function (_a) {
        tasks = itemList.map(function (item) {
            var src = item.imagePath;
            var destination = path.join(destDir, "frame".concat(item.frameNumber, ".png"));
            return fs.promises.copyFile(src, destination);
        });
        return [2 /*return*/, Promise.all(tasks)];
    });
}); };
var execGenerate = function (itemList, animationOptionData, appPath, temporaryRootPath, saveDialog) { return __awaiter(void 0, void 0, void 0, function () {
    var temporaryPath, temporaryCompressPath, selectedPNGPath, selectedWebPPath, selectedHTMLPath, isHtmlGenerated, isApngGenerated, isWebPGenerated, errorCode, errorDetail, shouldCompressPNG, temporaryLastPath, err, pngPath, err, err, imageFileSaved, selectedHTMLDirectoryPath, relativePNGName, relativeWebPName, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 	platformで実行先の拡張子を変える
                console.log('exe ext', (0, getExeExt_1.getExeExt)());
                console.log('platform', process.platform);
                temporaryPath = path.join(temporaryRootPath, 'a-img-generator');
                temporaryCompressPath = path.join(temporaryRootPath, 'a-img-generator-compress');
                isHtmlGenerated = false;
                isApngGenerated = false;
                isWebPGenerated = false;
                errorCode = error_type_1.ErrorType.UNKNOWN;
                errorDetail = '';
                shouldCompressPNG = animationOptionData.enabledPngCompress &&
                    animationOptionData.enabledExportApng;
                temporaryLastPath = shouldCompressPNG
                    ? temporaryCompressPath
                    : temporaryPath;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 15, , 16]);
                // テンポラリをクリア
                errorCode = error_type_1.ErrorType.TEMPORARY_CLEAN_ERROR;
                return [4 /*yield*/, (0, emptyDirectory_1.emptyDirectory)(temporaryPath)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, emptyDirectory_1.emptyDirectory)(temporaryCompressPath)];
            case 3:
                _a.sent();
                console.log('::make-temporary::');
                errorCode = error_type_1.ErrorType.MAKE_TEMPORARY_ERROR;
                return [4 /*yield*/, copyTemporaryDirectory(itemList, temporaryPath)];
            case 4:
                _a.sent();
                if (!shouldCompressPNG) return [3 /*break*/, 6];
                errorCode = error_type_1.ErrorType.PNG_COMPRESS_ERROR;
                return [4 /*yield*/, (0, generateApng_1.pngCompressAll)(itemList, appPath, temporaryPath, temporaryCompressPath)];
            case 5:
                err = _a.sent();
                if (err) {
                    errorCode = err.errCode;
                    errorDetail = err.errDetail;
                    throw err.cause;
                }
                _a.label = 6;
            case 6:
                console.log('::start-export-apng::');
                if (!(animationOptionData.enabledExportApng === true)) return [3 /*break*/, 9];
                // ひとまず謎エラーとしとく
                errorCode = error_type_1.ErrorType.APNG_OTHER_ERORR;
                return [4 /*yield*/, saveDialog.open('png')];
            case 7:
                selectedPNGPath = _a.sent();
                if (!selectedPNGPath) return [3 /*break*/, 9];
                pngPath = path.join(temporaryLastPath, 'frame*.png');
                return [4 /*yield*/, (0, generateApng_1.generateApng)(selectedPNGPath, appPath, pngPath, animationOptionData)];
            case 8:
                err = _a.sent();
                if (err) {
                    errorCode = err.errCode;
                    errorDetail = err.errDetail;
                    throw err.cause;
                }
                isApngGenerated = true;
                _a.label = 9;
            case 9:
                console.log('::start-export-wepb::');
                if (!(animationOptionData.enabledExportWebp === true)) return [3 /*break*/, 12];
                return [4 /*yield*/, saveDialog.open('webp')];
            case 10:
                // ひとまず謎エラーとしとく
                // this.errorCode = ErrorType.WEBP_OTHER_ERORR;
                selectedWebPPath = _a.sent();
                if (!selectedWebPPath) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, generateWebp_1.generateWebp)(selectedWebPPath, appPath, temporaryPath, itemList, animationOptionData)];
            case 11:
                err = _a.sent();
                if (err) {
                    errorCode = err.errCode;
                    errorDetail = err.errDetail;
                    throw err.cause;
                }
                isWebPGenerated = true;
                _a.label = 12;
            case 12:
                console.log('::start-export-html::');
                imageFileSaved = isApngGenerated || isWebPGenerated;
                if (!(animationOptionData.enabledExportHtml === true && imageFileSaved)) return [3 /*break*/, 14];
                errorCode = error_type_1.ErrorType.HTML_ERROR;
                return [4 /*yield*/, saveDialog.open('html')];
            case 13:
                selectedHTMLPath = _a.sent();
                if (selectedHTMLPath) {
                    selectedHTMLDirectoryPath = path.dirname(selectedHTMLPath);
                    relativePNGName = selectedPNGPath &&
                        path.relative(selectedHTMLDirectoryPath, selectedPNGPath);
                    relativeWebPName = selectedWebPPath &&
                        path.relative(selectedHTMLDirectoryPath, selectedWebPPath);
                    (0, generateHtml_1.generateHtml)(selectedHTMLPath, animationOptionData, relativePNGName, relativeWebPName);
                }
                _a.label = 14;
            case 14:
                console.log('::finish::');
                if (!isHtmlGenerated && !isApngGenerated && !isWebPGenerated) {
                    console.log('ファイルが一つも保存されませんでした');
                }
                if (isHtmlGenerated && selectedHTMLPath) {
                    electron_1.shell.showItemInFolder(selectedHTMLPath);
                }
                else if (isApngGenerated && selectedPNGPath) {
                    electron_1.shell.showItemInFolder(selectedPNGPath);
                }
                else if (isWebPGenerated && selectedWebPPath) {
                    electron_1.shell.showItemInFolder(selectedWebPPath);
                }
                return [2 /*return*/, {
                        pngPath: isApngGenerated ? selectedPNGPath : undefined,
                        webpPath: isWebPGenerated ? selectedWebPPath : undefined,
                        htmlPath: isHtmlGenerated ? selectedHTMLPath : undefined
                    }];
            case 15:
                err_1 = _a.sent();
                return [2 /*return*/, {
                        error: {
                            cause: err_1,
                            errCode: errorCode,
                            errDetail: errorDetail
                        }
                    }];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.execGenerate = execGenerate;

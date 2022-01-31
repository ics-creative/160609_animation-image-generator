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
exports.generateWebp = void 0;
var path = require("path");
var error_type_1 = require("../../common-src/error/error-type");
var getExeExt_1 = require("../fileFunctions/getExeExt");
var execFile_1 = require("../fileFunctions/execFile");
var timer_1 = require("../utils/timer");
var ENOENT_ERROR = 'ENOENT';
/**
 * WEBP アニメーション画像を作ります。
 * @returns {Promise<T>}
 * @private
 */
var generateWebp = function (exportFilePath, appPath, temporaryPath, itemList, optionData) { return __awaiter(void 0, void 0, void 0, function () {
    var pngPath, options, frameMs, pngFiles, i, error, errorCode, _a, err, stdout, stderr;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pngPath = path.join(temporaryPath);
                options = [];
                frameMs = Math.round(1000 / optionData.fps);
                pngFiles = [];
                for (i = 0; i < itemList.length; i++) {
                    // フレーム数に違和感がある
                    options.push("-frame");
                    options.push("".concat(pngPath, "/frame").concat(i, ".png.webp"));
                    options.push("+".concat(frameMs, "+0+0+1"));
                    pngFiles.push("".concat(pngPath, "/frame").concat(i, ".png"));
                }
                if (optionData.noLoop === false) {
                    options.push("-loop");
                    options.push(optionData.loop + '');
                }
                options.push("-o");
                options.push(exportFilePath);
                return [4 /*yield*/, convertPng2Webps(pngFiles, appPath, optionData)];
            case 1:
                error = _b.sent();
                if (error) {
                    return [2 /*return*/, error];
                }
                return [4 /*yield*/, (0, timer_1.waitImmediate)()];
            case 2:
                _b.sent();
                errorCode = error_type_1.ErrorType.CWEBP_OTHER_ERROR;
                return [4 /*yield*/, (0, execFile_1.waitExecFile)("".concat(appPath, "/bin/webpmux").concat((0, getExeExt_1.getExeExt)()), options)];
            case 3:
                _a = _b.sent(), err = _a.err, stdout = _a.stdout, stderr = _a.stderr;
                if (!err) {
                    return [2 /*return*/];
                }
                console.error(stderr);
                // TODO: ENOENT_ERRORの場合はErrorType.WEBPMUX_ACCESS_ERRORを返したい
                errorCode = error_type_1.ErrorType.WEBPMUX_ERROR;
                return [2 /*return*/, {
                        cause: err,
                        errCode: errorCode,
                        errDetail: err.code + ' : ' + stdout + ', message:' + err.message
                    }];
        }
    });
}); };
exports.generateWebp = generateWebp;
/**
 * PNG->WebPの変換を一括で行います
 * @param pngPaths
 * @param appPath
 * @param optionData
 * @return 処理に失敗した場合はエラー詳細。成功した場合はundefined
 */
var convertPng2Webps = function (pngPaths, appPath, optionData) { return __awaiter(void 0, void 0, void 0, function () {
    var promises, errors, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                promises = pngPaths.map(function (png) {
                    return convertPng2Webp(png, appPath, optionData);
                });
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                errors = _a.sent();
                error = errors.find(function (result) { return result; });
                return [2 /*return*/, error];
        }
    });
}); };
/**
 * PNG->WebPの変換を行います
 * @param pngPaths
 * @param appPath
 * @param optionData
 * @return 処理に失敗した場合はエラー詳細。成功した場合はundefined
 */
var convertPng2Webp = function (filePath, appPath, optionData) { return __awaiter(void 0, void 0, void 0, function () {
    var options, _a, err, stdout, stderr;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                options = [];
                options.push(filePath);
                options.push("-o");
                options.push("".concat(filePath, ".webp"));
                options.push(filePath);
                if (optionData.enabledWebpCompress === true) {
                    options.push("-preset", "drawing");
                }
                else {
                    options.push("-lossless");
                    // 超低容量設定
                    // options.push(`-q`, `100`);
                    // options.push(`-m`, `6`);
                }
                return [4 /*yield*/, (0, timer_1.waitImmediate)()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, execFile_1.waitExecFile)("".concat(appPath, "/bin/cwebp").concat((0, getExeExt_1.getExeExt)()), options)];
            case 2:
                _a = _b.sent(), err = _a.err, stdout = _a.stdout, stderr = _a.stderr;
                if (!err) {
                    return [2 /*return*/];
                }
                console.error(stderr);
                return [2 /*return*/, {
                        cause: err,
                        errDetail: stderr,
                        // TODO: ENOENT_ERRORの場合はErrorType.WEBPMUX_ACCESS_ERRORを返したい
                        errCode: error_type_1.ErrorType.CWEBP_ERROR
                    }];
        }
    });
}); };

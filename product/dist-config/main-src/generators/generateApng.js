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
exports.pngCompressAll = exports.generateApng = void 0;
var execFile_1 = require("../fileFunctions/execFile");
var getExeExt_1 = require("../fileFunctions/getExeExt");
var path = require("path");
var timer_1 = require("../utils/timer");
var error_type_1 = require("../../common-src/error/error-type");
var CompressionType_1 = require("../../common-src/type/CompressionType");
var ENOENT_ERROR = 'ENOENT';
/**
 * APNG画像を保存します。
 *
 * @returns
 * @private
 */
var generateApng = function (exportFilePath, appPath, pngPath, optionData) { return __awaiter(void 0, void 0, void 0, function () {
    var compressOptions, loopOption, options, _a, err, stdout, stderr, errorCode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                compressOptions = getCompressOption(optionData.compression);
                console.log('optionData.loop : ' + optionData.loop);
                loopOption = '-l' + (optionData.noLoop ? 0 : optionData.loop);
                console.log('loopOption : ' + loopOption);
                options = [
                    exportFilePath,
                    pngPath,
                    '1',
                    String(optionData.fps),
                    compressOptions,
                    loopOption,
                    '-kc'
                ];
                return [4 /*yield*/, (0, timer_1.waitImmediate)()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, execFile_1.waitExecFile)(path.join(appPath, "/bin/apngasm".concat((0, getExeExt_1.getExeExt)())), options)];
            case 2:
                _a = _b.sent(), err = _a.err, stdout = _a.stdout, stderr = _a.stderr;
                if (err) {
                    errorCode = error_type_1.ErrorType.APNG_ERORR;
                    return [2 /*return*/, {
                            cause: err,
                            errCode: errorCode,
                            errDetail: stdout
                        }];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.generateApng = generateApng;
var pngCompressAll = function (itemList, appPath, inDir, outDir) { return __awaiter(void 0, void 0, void 0, function () {
    var promises, errors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                promises = itemList.map(function (item) {
                    return pngCompress(item, appPath, inDir, outDir);
                });
                return [4 /*yield*/, Promise.all(promises)];
            case 1:
                errors = _a.sent();
                return [2 /*return*/, errors.find(function (error) { return error; })];
        }
    });
}); };
exports.pngCompressAll = pngCompressAll;
/* tslint:enable:quotemark */
var getCompressOption = function (type) {
    switch (type) {
        case CompressionType_1.CompressionType.zlib:
            return '-z0';
        case CompressionType_1.CompressionType.zip7:
            return '-z1';
        case CompressionType_1.CompressionType.Zopfli:
            return '-z2';
    }
};
var pngCompress = function (item, appPath, inDir, outDir) { return __awaiter(void 0, void 0, void 0, function () {
    var options, _a, err, stdout, stderr, errorCode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                options = [
                    '--quality=65-80',
                    '--speed',
                    '1',
                    '--output',
                    path.join("".concat(outDir), "frame".concat(item.frameNumber, ".png")),
                    '--',
                    path.join("".concat(inDir), "frame".concat(item.frameNumber, ".png"))
                ];
                return [4 /*yield*/, (0, execFile_1.waitExecFile)("".concat(appPath, "/bin/pngquant").concat((0, getExeExt_1.getExeExt)()), options)];
            case 1:
                _a = _b.sent(), err = _a.err, stdout = _a.stdout, stderr = _a.stderr;
                if (!err) {
                    return [2 /*return*/];
                }
                console.error(err);
                console.error(stderr);
                if (err.code === 99) {
                    errorCode = error_type_1.ErrorType.PNG_COMPRESS_QUALITY_ERROR;
                }
                else {
                    errorCode = error_type_1.ErrorType.PNG_COMPRESS_ERROR;
                }
                return [2 /*return*/, {
                        cause: err,
                        errCode: errorCode,
                        errDetail: stdout
                    }];
        }
    });
}); };

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
var electron_1 = require("electron");
var PresetType_1 = require("../common-src/type/PresetType");
var LineStampValidator_1 = require("../common-src/validators/LineStampValidator");
var fs = require("fs");
var exists_1 = require("fileFunctions/exists");
var createInquiryCode_1 = require("generators/createInquiryCode");
var execGenerate_1 = require("generators/execGenerate");
var SaveDialog_1 = require("dialog/SaveDialog");
var File = /** @class */ (function () {
    function File(mainWindow, localeData, appPath, sendError, errorMessage, defaultSaveDirectory) {
        this.mainWindow = mainWindow;
        this.localeData = localeData;
        this.appPath = appPath;
        this.sendError = sendError;
        this.errorMessage = errorMessage;
        this.saveDialog = new SaveDialog_1.SaveDialog(this.mainWindow, defaultSaveDirectory, localeData.defaultFileName);
    }
    File.prototype.exec = function (temporaryPath, version, itemList, animationOptionData) {
        return __awaiter(this, void 0, void 0, function () {
            var inquiryCode, result, error, errorStack;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inquiryCode = (0, createInquiryCode_1.createInquiryCode)();
                        return [4 /*yield*/, (0, execGenerate_1.execGenerate)(itemList, animationOptionData, this.appPath, temporaryPath, this.saveDialog)];
                    case 1:
                        result = _a.sent();
                        if (!(animationOptionData.preset === PresetType_1.PresetType.LINE && result.pngPath)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validateLineStamp(result.pngPath, animationOptionData)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (result.error) {
                            error = result.error;
                            console.log('::catch-error::');
                            // エラー内容の送信
                            console.error(error);
                            errorStack = error.cause.stack;
                            this.sendError.exec(version, inquiryCode, 'ERROR', error.errCode.toString(), (errorStack !== null && errorStack !== void 0 ? errorStack : ''));
                            this.errorMessage.showErrorMessage(error.errCode, inquiryCode, error.errDetail, (errorStack !== null && errorStack !== void 0 ? errorStack : ''), this.localeData.APP_NAME, this.mainWindow);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    File.prototype.validateLineStamp = function (exportFilePath, animationOptionData) {
        return __awaiter(this, void 0, void 0, function () {
            var stat, validateArr, message, detailMessage, dialogOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, exists_1.existsPath)(exportFilePath)) {
                            return [2 /*return*/];
                        }
                        stat = fs.statSync(exportFilePath);
                        validateArr = LineStampValidator_1.LineStampValidator.validate(stat, animationOptionData, this.localeData);
                        if (!(validateArr.length > 0)) return [3 /*break*/, 2];
                        message = this.localeData.VALIDATE_title;
                        detailMessage = '・' + validateArr.join('\n\n・');
                        dialogOption = {
                            type: 'info',
                            buttons: ['OK'],
                            title: this.localeData.APP_NAME,
                            message: message,
                            detail: detailMessage
                        };
                        return [4 /*yield*/, electron_1.dialog.showMessageBox(this.mainWindow, dialogOption)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return File;
}());
exports["default"] = File;

"use strict";
var LineStampValidator = (function () {
    function LineStampValidator() {
    }
    LineStampValidator.validate = function (output, options, localeData) {
        var validateArr = [];
        var fs = require('fs');
        var stat = fs.statSync(output);
        if (stat.size > 300 * 1024) {
            var val = Math.round(stat.size / 1000);
            validateArr.push(localeData.VALIDATE_size.split("${1}").join(val + ""));
        }
        if (LineStampValidator.validateFrameLength(options) === false) {
            var val = options.imageInfo.length;
            validateArr.push(localeData.VALIDATE_amount.split("${1}").join(val + ""));
        }
        if (options.noLoop == true) {
            validateArr.push(localeData.VALIDATE_noLoop);
        }
        else {
            var playTime = options.imageInfo.length * options.loop / options.fps;
            if (LineStampValidator.validateTime(options) === false) {
                var val = Math.round(playTime * 100) / 100;
                validateArr.push(localeData.VALIDATE_time.split("${1}").join(val + ""));
            }
        }
        if (LineStampValidator.validateFrameMaxSize(options) === false) {
            var val1 = options.imageInfo.width;
            var val2 = options.imageInfo.height;
            validateArr.push(localeData.VALIDATE_maxSize
                .split("${1}").join(val1 + "")
                .split("${2}").join(val2 + ""));
        }
        if (LineStampValidator.validateFrameMinSize(options) === false) {
            var val1 = options.imageInfo.width;
            var val2 = options.imageInfo.height;
            validateArr.push(localeData.VALIDATE_minSize
                .split("${1}").join(val1 + "")
                .split("${2}").join(val2 + ""));
        }
        return validateArr;
    };
    LineStampValidator.validateFrameMaxSize = function (options) {
        return !(options.imageInfo.width > 320 || options.imageInfo.height > 270);
    };
    LineStampValidator.validateFrameMinSize = function (options) {
        var flag = true;
        if (options.imageInfo.width < 270 && options.imageInfo.height < 270) {
            // メイン画像判定
            if (options.imageInfo.width == 240 && options.imageInfo.height == 240) {
            }
            else {
                flag = false;
            }
        }
        return flag;
    };
    LineStampValidator.validateTime = function (options) {
        var playTime = options.imageInfo.length * options.loop / options.fps;
        return [1, 2, 3, 4].indexOf(playTime) >= 0;
    };
    LineStampValidator.validateFrameLength = function (options) {
        return !(options.imageInfo.length < 5 || 20 < options.imageInfo.length);
    };
    return LineStampValidator;
}());
exports.LineStampValidator = LineStampValidator;

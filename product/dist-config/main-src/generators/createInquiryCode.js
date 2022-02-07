"use strict";
exports.__esModule = true;
exports.createInquiryCode = void 0;
var os_1 = require("os");
var crypto_1 = require("crypto");
var createInquiryCode = function () {
    // お問い合わせコード生成
    var hash = (0, crypto_1.createHash)('sha256');
    hash.update(os_1.platform + '/' + new Date().toString());
    return hash.digest('hex').slice(0, 8);
};
exports.createInquiryCode = createInquiryCode;

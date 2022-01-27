"use strict";
exports.__esModule = true;
exports.createInquiryCode = void 0;
var createInquiryCode = function () {
    var SHA256 = require('crypto-js/sha256');
    // お問い合わせコード生成
    return SHA256(require('os').platform + '/' + new Date().toString())
        .toString()
        .slice(0, 8);
};
exports.createInquiryCode = createInquiryCode;

"use strict";
exports.__esModule = true;
exports.notNull = void 0;
/** 配列からnull除外する際のユーティリティ */
var notNull = function (value) {
    return value !== null && value !== undefined;
};
exports.notNull = notNull;

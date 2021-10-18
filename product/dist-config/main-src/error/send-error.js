"use strict";
exports.__esModule = true;
exports.SendError = void 0;
var SendError = /** @class */ (function () {
    function SendError() {
    }
    SendError.prototype.exec = function (version, code, category, title, detail) {
        var saveData = {
            OS: require('os').platform(),
            version: version,
            code: code,
            category: category,
            title: title,
            detail: detail
        };
        var data = {
            saveData: JSON.stringify(saveData),
            action: 'append',
            sheetName: 's0',
            actionParam: 0
        }; // POSTメソッドで送信するデータ
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            var READYSTATE_COMPLETED = 4;
            var HTTP_STATUS_OK = 200;
            if (this.readyState === READYSTATE_COMPLETED &&
                this.status === HTTP_STATUS_OK) {
                console.log(this.responseText);
            }
        };
        xmlHttpRequest.open('POST', 'https://script.google.com/macros/s/AKfycbxt8g9KxiD1hp_W1XQzw4tzmsIF1qVigRLF-v87ngWtqqU31JXu/exec');
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttpRequest.send(this.encodeHTMLForm(data));
    };
    SendError.prototype.encodeHTMLForm = function (data) {
        var params = [];
        for (var name_1 in data) {
            if (!name_1.hasOwnProperty(name_1)) {
                continue;
            }
            var value = data[name_1];
            var param = encodeURIComponent(name_1) + '=' + encodeURIComponent(value);
            params.push(param);
        }
        return params.join('&').replace(/%20/g, '+');
    };
    return SendError;
}());
exports.SendError = SendError;

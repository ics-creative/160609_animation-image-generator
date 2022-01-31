"use strict";
exports.__esModule = true;
exports.generateHtml = void 0;
var fs = require("fs");
var backgroundImageUrl = 'https://raw.githubusercontent.com/ics-creative/160609_animation-image-generator/master/app/imgs/opacity.png';
var scriptElementLoadPolitill = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js\"></script>";
var scriptElementEnablePolifill = "\n    <script>\n      if(window.navigator.userAgent.indexOf(\"Chrome\") >= 0 && window.navigator.userAgent.indexOf(\"Edge\") == -1){\n        // Chrome \u306E\u5834\u5408\u306F WebP \u30D5\u30A1\u30A4\u30EB\u304C\u8868\u793A\u3055\u308C\u308B\n      }else{\n        // Chrome \u4EE5\u5916\u306E\u5834\u5408\u306F APNG \u5229\u7528\u53EF\u5426\u3092\u5224\u5B9A\u3059\u308B\n        APNG.ifNeeded().then(function () {\n          // APNG \u306B\u672A\u5BFE\u5FDC\u306E\u30D6\u30E9\u30A6\u30B6(\u4F8B\uFF1AIE, Edge)\u3067\u306F\u3001JS\u30E9\u30A4\u30D6\u30E9\u30EA\u300Capng-canvas\u300D\u306B\u3088\u308A\u8868\u793A\u53EF\u80FD\u306B\u3059\u308B\n          var images = document.querySelectorAll(\".apng-image\");\n          for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }\n        });\n      }\n    </script>";
var createImageElementApng = function (filePNGName, width, height) { return "\n    <!-- Firefox \u3068 Safari \u3067\u518D\u751F\u53EF\u80FD (Chrome, IE, Edge \u3067\u306F\u30A2\u30CB\u30E1\u306F\u518D\u751F\u3067\u304D\u307E\u305B\u3093) -->\n    <img src=\"".concat(filePNGName, "\" width=\"").concat(width, "\"\n    height=\"").concat(height, "\" alt=\"\" class=\"apng-image\" />"); };
var createImageElementWebP = function (fileWebPName, width, height) { return "\n    <!-- Chrome \u3067\u518D\u751F\u53EF\u80FD (IE, Edge, Firefox, Safari \u3067\u306F\u8868\u793A\u3067\u304D\u307E\u305B\u3093) -->\n    <img src=\"".concat(fileWebPName, "\" width=\"").concat(width, "\"\n    height=\"").concat(height, "\" alt=\"\" />"); };
var createImageElementWebpAndApng = function (fileWebPName, filePNGName, width, height) { return "\n<!-- Chrome \u3068 Firefox \u3068 Safari \u3067\u518D\u751F\u53EF\u80FD (IE, Edge \u3067\u306F\u30A2\u30CB\u30E1\u306F\u518D\u751F\u3067\u304D\u307E\u305B\u3093) -->\n<picture>\n<!-- Chrome \u7528 -->\n  <source type=\"image/webp\" srcset=\"".concat(fileWebPName, "\" />\n  <!-- Firefox, Safari \u7528 -->\n  <img src=\"").concat(filePNGName, "\" width=\"").concat(width, "\"\n  height=\"").concat(height, "\" alt=\"\" class=\"apng-image\" />\n</picture>"); };
/**
 * HTMLファイルを作成します。
 *
 * @private
 */
/* tslint:disable:quotemark */
var generateHtml = function (exportFilePath, optionData, filePNGName, fileWebPName) {
    var imageElement = "";
    var isIncludeApng = optionData.enabledExportApng && filePNGName;
    var isIncludeWebP = optionData.enabledExportWebp && fileWebPName;
    var _a = optionData.imageInfo, width = _a.width, height = _a.height;
    if (isIncludeApng && isIncludeWebP) {
        imageElement = createImageElementWebpAndApng(fileWebPName, filePNGName, width, height);
    }
    else if (isIncludeApng) {
        imageElement = createImageElementApng(filePNGName, width, height);
    }
    else if (isIncludeWebP) {
        imageElement = createImageElementWebP(fileWebPName, width, height);
    }
    else {
        // TODO: エラーハンドリングを追加する
        return;
    }
    // tslint:disable-next-line:max-line-length
    var data = "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n    <style>\n      /* \u78BA\u8A8D\u7528\u306ECSS */\n      body { background: #444; }\n      picture img, .apng-image\n      {\n        background: url(".concat(backgroundImageUrl, ");\n      }\n    </style>\n    ").concat(scriptElementLoadPolitill, "\n  </head>\n  <body>\n  \t").concat(imageElement, "\n  \t").concat(scriptElementEnablePolifill, "\n  </body>\n</html>");
    fs.writeFileSync(exportFilePath, data);
};
exports.generateHtml = generateHtml;

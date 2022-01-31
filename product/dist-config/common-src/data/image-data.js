"use strict";
exports.__esModule = true;
exports.ImageData = void 0;
/**
 * アニメーション画像の情報を定義したクラスです。
 */
var ImageData = /** @class */ (function () {
    function ImageData(imageBaseName, imagePath, frameNumber) {
        this.imageBaseName = imageBaseName;
        this.imagePath = imagePath;
        this.frameNumber = frameNumber;
    }
    return ImageData;
}());
exports.ImageData = ImageData;

"use strict";
var _a;
exports.__esModule = true;
exports.numberToPreset = exports.presetToNumber = exports.PresetType = void 0;
/**
 * プリセットオプションを定義したENUMです。
 */
var PresetType;
(function (PresetType) {
    PresetType["LINE"] = "line";
    PresetType["WEB"] = "web";
})(PresetType = exports.PresetType || (exports.PresetType = {}));
/** Preset名とID(number)の対応表 */
var PRESET_NUM = (_a = {},
    _a[PresetType.LINE] = 0,
    _a[PresetType.WEB] = 1,
    _a);
/**
 * presetを数値に変換します。
 * この機能はpresetをnumber型で入出力する古い機能との互換性確保のために残されています。
 * 必要な場合のみ使用してください。
 *
 * @param preset
 */
var presetToNumber = function (preset) { return PRESET_NUM[preset]; };
exports.presetToNumber = presetToNumber;
/**
 * 数値をpreset名に変換します。
 * この機能はpresetをnumber型で入出力する古い機能との互換性確保のために残されています。
 * 必要な場合のみ使用してください。
 *
 * @param presetNum
 * @returns
 */
var numberToPreset = function (presetNum) {
    if (presetNum === PRESET_NUM[PresetType.LINE])
        return PresetType.LINE;
    if (presetNum === PRESET_NUM[PresetType.WEB])
        return PresetType.WEB;
    return undefined;
};
exports.numberToPreset = numberToPreset;

const webpack = require("webpack");
module.exports = {
  output: {  // ファイルの出力設定
    filename: "bundle.js"  // 出力ファイル名
  },
  target: "atom",
  plugins: [
    new webpack.ExternalsPlugin('commonjs', ['electron']),
  ]
};

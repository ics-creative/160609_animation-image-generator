# アプリアイコンの作成方法

このディレクトリ（`product/resources/app-icon`）はアプリのアイコンファイルを作成するための入出力およびテンポラリとして利用されます。

## 内容物

- app-icon.psd : アイコンデザインの元データです
- app-icon-assets : app-icon.psdからPhotoshopのアセット生成で出力されたアイコン画像が格納されるディレクトリです
  - mac-1024.png : Mac用アイコンの元データです。1024x1024の透過PNGです
  - win-1024.png : Win用アイコンの元データです。1024x1024の透過PNGです
- app.icns : Mac用アイコンの生成結果です
- app.ico : Win用アイコンの生成結果です

## 更新方法

1. `app-icon.psd`を編集・保存します
   1. `app-icon-assets`の画像が更新されたことを確認してください
2. `npm run make-icon`を実行します
   1. `app.icns`, `app.ico`が更新されたことを確認してください

出力したアイコンはビルド＆パッケージのスクリプトから参照されます。ファイル名等は変更しないようにしてください。

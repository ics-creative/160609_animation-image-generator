# リリースファイルを作成する場合

リリースファイルの実行先はルートディレクトリーです（このファイルがあるディレクトリ）。

## Macの場合

### 1. リリースビルドに必要なパッケージのインストールを行います。

```
npm install
```

### 2. リリースビルドコマンドを実行します。

```
npm run release-mac
```
 
### 3. ファイルが生成されます。

「アニメ画像に変換する君-x64-mas/」と「AnimationImageConverter.pkg」


## Windowsの場合

いろいろあり、Windows機とMac機の両方が必要です。

### 1. Macでリリースビルドに必要なパッケージのインストールを行います。

```
npm install
```

### 2. Macでリリースビルドコマンドを実行します。

```
npm run release-win32
```

### 3. Windowsでパッケージコマンドを実行します。

```
npm run package-win32
```

 
### 4. ファイルが生成されます。
次のファイルが作成されます。リネームコマンドはまだ作成していないので、手動でリネームしてください。
「animation-image-converter-win32-ia32/」


# Mac App Store向けにリリースする場合

リリースファイルの実行先はルートディレクトリーです（このファイルがあるディレクトリ）。

### 1. リリースビルドに必要なパッケージのインストールを行います。

```
npm install
```

### 2. ビルドバージョンを編集します。

#### ./package.json

```
"version": "1.0.0",
```

- パッケージ時のバージョン指定
> "package-mas": "electron-packager ./tmp-release-mac 'アニメ画像に変換する君' --platform=mas --overwrite  --arch=x64 --app-bundle-id='media.ics.AnimationImageConverter'  --extend-info=dev/Info.plist  --version='1.2.3'  --app-version='1.0.0' --build-version='1.0.208' --icon='resources/app.icns' --overwrite ",

	- Appleがチェックするビルドバージョン
	> --build-version='1.0.208'
 
	- アプリバージョンの更新
	> app-version='1.0.0'

#### ./resource/package.json

> "version": "1.0.0",

#### ./app/package.json

> "version": "1.0.0",


#### ./app/src/config/AppConfig.ts

> public version:string = "1.0.0";

### 3. リリースビルドコマンドを実行します。

```
npm run release-mas
```
 
### 4. ファイルが生成されます。

AnimationImageConverter.pkg

このファイルをApplicationLoaderでアップロードしてください。
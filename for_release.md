# リリースファイルを作成する場合

リリースファイルの実行先はルートディレクトリーです（このファイルがあるディレクトリ）。

## Macの場合

### 1. 必要なバイナリファイルをリソースフォルダーに配置します。

- resources/apngasm-2.9-bin-macosx/apngasm 
    - [APNG Assembler（apngasm-2.9-bin-macosx.zip） - SourceForge](https://sourceforge.net/projects/apngasm/files/2.9/) をダウンロード、展開したもの

- resources/libwebp-0.5.0-mac-10.9/bin/webpmux, cwebp 
    - [libwebp-0.5.0-mac-10.9.tar.gz](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html) をダウンロード、展開したもの

- resources/pngquant-mac/pngquant
		- [https://pngquant.org/](pngquant)のリンク「[Binary for Mac]」からダウンロードして、展開したものを配置
		

### 2. リリースビルドに必要なパッケージのインストールを行います。

```
npm install
```

### 3. リリースビルドコマンドを実行します。

```
npm run release-mac
```
 
### 4. ファイルが生成されます。

アニメ画像に変換する君-x64-darwin/


## Windowsの場合

いろいろあり、Windows機とMac機の両方が必要です。

### 1. 必要なバイナリファイルをリソースフォルダーに配置します。

- resources/apngasm-2.9-bin-win32/apngasm 
    - [APNG Assembler（apngasm-2.9-bin-win32.zip） - SourceForge](https://sourceforge.net/projects/apngasm/files/2.9/) をダウンロード、展開したものを配置

- resources/libwebp-0.5.0-windows-x86/bin/webpmux, cwebp 
    - [libwebp-0.5.0-windows-x86.tar.gz](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html) をダウンロード、展開したものを配置

- resources/pngquant-win/pngquant.exe
		- [https://pngquant.org/](pngquant)のリンク「[Binary for Windows]」からダウンロードして、展開したものを配置


### 2. Macでリリースビルドに必要なパッケージのインストールを行います。

```
npm install
```

### 3. Macでリリースビルドコマンドを実行します。

```
npm run release-win32
```

### 4. Windowsでパッケージコマンドを実行します。

```
npm run package-win32
```

 
### 4. ファイルが生成されます。
AnimationImageConverter-x86-win32/
適宜リネームします。


# Mac App Store向けにリリースする場合

リリースファイルの実行先はルートディレクトリーです（このファイルがあるディレクトリ）。

### 1. 必要なバイナリファイルをリソースフォルダーに配置します。

- resources/apngasm-2.9-bin-macosx/apngasm 
    - [APNG Assembler（apngasm-2.9-bin-macosx.zip） - SourceForge](https://sourceforge.net/projects/apngasm/files/2.9/) をダウンロード、展開したもの

- resources/libwebp-0.5.0-mac-10.9/bin/webpmux, cwebp 
    - [libwebp-0.5.0-mac-10.9.tar.gz](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html) をダウンロード、展開したもの

- resources/pngquant-mac/pngquant
		- [https://pngquant.org/](pngquant)のリンク「[Binary for Mac]」からダウンロードして、展開したものを配置
		

### 2. リリースビルドに必要なパッケージのインストールを行います。

```
npm install
```

### 3. ビルドバージョンを編集します。

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

### 4. リリースビルドコマンドを実行します。

```
npm run release-mas
```
 
### 5. ファイルが生成されます。

AnimationImageConverter.pkg


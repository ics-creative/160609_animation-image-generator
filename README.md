# 連番画像からアニメーション画像を作成するツール

# 実行方法

## 1.アプリケーションに必要なファイルをダウンロードしてきます。

「`app/bin/`」ディレクトリーに`apngasm`を配置します。（※1)


- ※1 [APNG Assembler（apngasm-2.9-bin-macosx.zip） - SourceForge](https://sourceforge.net/projects/apngasm/files/2.9/) をダウンロード


## 2.アプリケーションに必要なファイルをインストール

アプリの実行先は`app`ディレクトリーです。「`cd`」コマンドで移動します。

```
cd app
```

`npm install`コマンドでアプリケーションに必要なファイルをインストールします。
```
npm install
```

## 2.ビルドを行います。

```
npm run build
```

## 3.実行します。

```
npm run start
```

# リリースファイルを作成する場合


リリースファイルの実行先はルートディレクトリーです（このファイルがあるディレクトリ）。

## Macの場合

### 1. 必要なバイナリファイルをリソースフォルダーに配置します。

- resources/apngasm-2.9-bin-macosx/apngasm 
    - [APNG Assembler（apngasm-2.9-bin-macosx.zip） - SourceForge](https://sourceforge.net/projects/apngasm/files/2.9/) をダウンロード、展開したもの

- resources/libwebp-0.5.0-mac-10.9/bin/webpmux, cwebp 
    - [libwebp-0.5.0-mac-10.9.tar.gz](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html) をダウンロード、展開したもの

### 2. リリースビルドに必要なパッケージのインストールを行います。

```
npm install
```

### 3. リリースビルドコマンドを実行します。

```
npm run release-mac
```
 
### 4. ファイルが生成されます。
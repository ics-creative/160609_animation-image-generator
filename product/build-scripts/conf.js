module.exports = {
  JP_NAME: 'アニメ画像に変換する君',
  EN_NAME: 'AnimationImageConverter',
  COPY_RIGHT: 'Copyright (C) 2018 ICS INC.',
  JP_DESCRIPTION:
    '「アニメ画像に変換する君」は連番画像をLINEアニメーションスタンプや、Web用アニメーション画像に変換するアプリケーションです。',
  APP_VERSION: '3.0.0.0',
  BUILD_VERSION: '3.0.0',
  ELECTRON_VERSION: '15.3.0',
  distPath: './dist',
  binPath: './bin',
  projectSrcPath: './src',
  projectDistConfigPath: './dist-config',
  packageTmpPath: {
    win32: 'tmpWin32',
    darwin: 'tmpDarwin'
  },
  resourcesPath: {
    win32: [
      {
        fileName: 'webpmux.exe',
        path: 'libwebp-1.2.1-windows-x64/bin/webpmux.exe'
      },
      {
        fileName: 'cwebp.exe',
        path: 'libwebp-1.2.1-windows-x64/bin/cwebp.exe'
      },
      { fileName: 'apngasm.exe', path: 'apngasm-2.91-bin-win32/apngasm.exe' },
      { fileName: 'pngquant.exe', path: 'pngquant-2.17.0-win/pngquant.exe' }
    ],
    darwin: [
      { fileName: 'webpmux', path: 'libwebp-1.2.1-mac-10.15/bin/webpmux' },
      { fileName: 'cwebp', path: 'libwebp-1.2.1-mac-10.15/bin/cwebp' },
      { fileName: 'apngasm', path: 'apngasm-2.91-bin-macos/apngasm' },
      { fileName: 'pngquant', path: 'pngquant-2.17.0-mac/pngquant' }
    ]
  }
};

module.exports = {
  JP_NAME: 'アニメ画像に変換する君',
  EN_NAME: 'animation-image-converter',
  JP_DESCRIPTION:
    '「アニメ画像に変換する君」は連番画像をLINEアニメーションスタンプや、Web用アニメーション画像に変換するアプリケーションです。',
  APP_VERSION: '2.1.5',
  BUILD_VERSION: '2.1.5',
  ELECTRON_VERSION: '2.0.0',
  sign: {
    identity: '3rd Party Mac Developer Installer: ICS INC. (53YCXL8YSM)',
    bundleId: 'media.ics.AnimationImageConverter'
  },
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
        path: 'libwebp-1.0.0-windows-x86/bin/webpmux.exe'
      },
      {
        fileName: 'cwebp.exe',
        path: 'libwebp-1.0.0-windows-x86/bin/cwebp.exe'
      },
      { fileName: 'apngasm.exe', path: 'apngasm-2.91-bin-win32/apngasm.exe' },
      { fileName: 'pngquant.exe', path: 'pngquant-win/pngquant.exe' }
    ],
    darwin: [
      { fileName: 'webpmux', path: 'libwebp-1.0.0-mac-10.13/bin/webpmux' },
      { fileName: 'cwebp', path: 'libwebp-1.0.0-mac-10.13/bin/cwebp' },
      { fileName: 'apngasm', path: 'apngasm-2.91-bin-macos/apngasm' },
      { fileName: 'pngquant', path: 'pngquant-mac/pngquant' }
    ]
  }
};

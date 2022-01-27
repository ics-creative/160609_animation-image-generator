import * as fs from 'fs';
import { AnimationImageOptions } from '../../common-src/data/animation-image-option';

const backgroundImageUrl =
  'https://raw.githubusercontent.com/ics-creative/160609_animation-image-generator/master/app/imgs/opacity.png';

const scriptElementLoadPolitill = `<script src="https://cdnjs.cloudflare.com/ajax/libs/apng-canvas/2.1.1/apng-canvas.min.js"></script>`;
const scriptElementEnablePolifill = `
    <script>
      if(window.navigator.userAgent.indexOf("Chrome") >= 0 && window.navigator.userAgent.indexOf("Edge") == -1){
        // Chrome の場合は WebP ファイルが表示される
      }else{
        // Chrome 以外の場合は APNG 利用可否を判定する
        APNG.ifNeeded().then(function () {
          // APNG に未対応のブラウザ(例：IE, Edge)では、JSライブラリ「apng-canvas」により表示可能にする
          var images = document.querySelectorAll(".apng-image");
          for (var i = 0; i < images.length; i++){ APNG.animateImage(images[i]); }
        });
      }
    </script>`;

const createImageElementApng = (
  filePNGName: string,
  width: number,
  height: number
) => `
    <!-- Firefox と Safari で再生可能 (Chrome, IE, Edge ではアニメは再生できません) -->
    <img src="${filePNGName}" width="${width}"
    height="${height}" alt="" class="apng-image" />`;

const createImageElementWebP = (
  fileWebPName: string,
  width: number,
  height: number
) => `
    <!-- Chrome で再生可能 (IE, Edge, Firefox, Safari では表示できません) -->
    <img src="${fileWebPName}" width="${width}"
    height="${height}" alt="" />`;

const createImageElementWebpAndApng = (
  fileWebPName: string,
  filePNGName: string,
  width: number,
  height: number
) => `
<!-- Chrome と Firefox と Safari で再生可能 (IE, Edge ではアニメは再生できません) -->
<picture>
<!-- Chrome 用 -->
  <source type="image/webp" srcset="${fileWebPName}" />
  <!-- Firefox, Safari 用 -->
  <img src="${filePNGName}" width="${width}"
  height="${height}" alt="" class="apng-image" />
</picture>`;

/**
 * HTMLファイルを作成します。
 * @private
 */

/* tslint:disable:quotemark */
export const generateHtml = (
  exportFilePath: string,
  optionData: AnimationImageOptions,
  filePNGName?: string,
  fileWebPName?: string
): void => {

  let imageElement = ``;

  const isIncludeApng = optionData.enabledExportApng && filePNGName
  const isIncludeWebP = optionData.enabledExportWebp && fileWebPName

  const { width, height } = optionData.imageInfo;
  if (isIncludeApng && isIncludeWebP) {
    imageElement = createImageElementWebpAndApng(
      fileWebPName,
      filePNGName,
      width,
      height
    );
  } else if (isIncludeApng) {
    imageElement = createImageElementApng(filePNGName, width, height);
  } else if (isIncludeWebP) {
    imageElement = createImageElementWebP(fileWebPName, width, height);
  } else {
    // TODO: エラーハンドリングを追加する
    return;
  }

  // tslint:disable-next-line:max-line-length
  const data = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      /* 確認用のCSS */
      body { background: #444; }
      picture img, .apng-image
      {
        background: url(${backgroundImageUrl});
      }
    </style>
    ${scriptElementLoadPolitill}
  </head>
  <body>
  	${imageElement}
  	${scriptElementEnablePolifill}
  </body>
</html>`;

  fs.writeFileSync(exportFilePath, data);
};

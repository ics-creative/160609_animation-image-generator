import * as fs from 'fs';
import { AnimationImageOptions } from '../../common-src/data/animation-image-option';
import { localeData } from '../locale-manager';

const createImageElementApng = (
  filePNGName: string,
  width: number,
  height: number
) => `<!-- ${localeData().HTML_availableFirefoxSafariChrome} (${
  localeData().HTML_cantAnimateOnIE
}) -->
      <img 
        src="${filePNGName}" 
        width="${width}"
        height="${height}"
        alt=""
        class="preview-image"
      />`;

const createImageElementWebP = (
  fileWebPName: string,
  width: number,
  height: number
) => `<!-- ${localeData().HTML_availableFirefoxSafariChrome} (${
  localeData().HTML_cantViewOnIE
}) -->
      <img
        src="${fileWebPName}"
        width="${width}"
        height="${height}"
        alt=""
        class="preview-image"
      />`;

const createImageElementWebpAndApng = (
  fileWebPName: string,
  filePNGName: string,
  width: number,
  height: number
) => `<!-- ${localeData().HTML_availableFirefoxSafariChrome} (${
  localeData().HTML_cantAnimateOnIE
}) -->
      <picture>
        <!-- ${localeData().HTML_forWebpSupportedBrowsers} -->
        <source type="image/webp" srcset="${fileWebPName}" />
        <!-- ${localeData().HTML_forWebpUnsupportedBrowsers} -->
        <img
          src="${filePNGName}"
          width="${width}"
          height="${height}"
          alt=""
          class="preview-image"
        />
      </picture>`;

/**
 * HTMLファイルを作成します。
 *
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

  const isIncludeApng = optionData.enabledExportApng && filePNGName;
  const isIncludeWebP = optionData.enabledExportWebp && fileWebPName;

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
  <html lang="${localeData().HTML_lang}">
    <head>
      <meta charset="utf8" />
      <style>
        body {
          background: #444;
        }
        .preview-image {
          background-color: white;
          /* ${localeData().HTML_backgroundCssComment} */
          background-image: 
              linear-gradient(45deg, #d3d3d3 25%, transparent 25%, transparent 75%, #d3d3d3 75%),
              linear-gradient(45deg, #d3d3d3 25%, transparent 25%, transparent 75%, #d3d3d3 75%);
          background-position: 0 0, 8px 8px;
          background-size: 16px 16px;
        }
      </style>
    </head>
    <body>
      ${imageElement}
    </body>
  </html>
`;

  fs.writeFileSync(exportFilePath, data);
};

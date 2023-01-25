import * as path from 'path';
import * as fs from 'fs';
import { emptyDirectory } from '../fileFunctions/emptyDirectory';
import { getExeExt } from '../fileFunctions/getExeExt';
import { AnimationImageOptions } from '../../common-src/data/animation-image-option';
import { ImageData } from '../../common-src/data/image-data';
import { ErrorType } from '../../common-src/error/error-type';
import { generateApng, pngCompressAll } from './generateApng';
import { generateWebp } from './generateWebp';
import { generateHtml } from './generateHtml';
import { shell } from 'electron';
import { GenetateError } from './GenerateError';
import { SaveDialog } from '../dialog/SaveDialog';

interface GenerateResult {
  error?: GenetateError;
  pngPath?: string;
  webpPath?: string;
  htmlPath?: string;
}

/** すべての元画像を作業フォルダにコピーします */
const copyTemporaryDirectory = async (
  itemList: ImageData[],
  destDir: string
): Promise<void[]> => {
  const tasks = itemList.map((item) => {
    const src = item.imagePath;
    const destination = path.join(destDir, `frame${item.frameNumber}.png`);
    return fs.promises.copyFile(src, destination);
  });

  return Promise.all(tasks);
};

/** 元画像が存在するかチェックし、最初に見つかった存在しない画像を返します。全てが存在する場合は何も返しません */
const findMissingItemFile = (itemList: ImageData[]): ImageData | undefined =>
  itemList.find((item) => !fs.existsSync(item.imagePath));

export const execGenerate = async (
  itemList: ImageData[],
  animationOptionData: AnimationImageOptions,
  appPath: string,
  temporaryRootPath: string,
  saveDialog: SaveDialog
): Promise<GenerateResult> => {
  // 	platformで実行先の拡張子を変える
  console.log('exe ext', getExeExt());
  console.log('platform', process.platform);

  // 	テンポラリパス生成
  const temporaryPath = path.join(temporaryRootPath, 'a-img-generator');
  const temporaryCompressPath = path.join(
    temporaryRootPath,
    'a-img-generator-compress'
  );

  let selectedPNGPath: string | undefined;
  let selectedWebPPath: string | undefined;
  let selectedHTMLPath: string | undefined;
  const isHtmlGenerated = false;
  let isApngGenerated = false;
  let isWebPGenerated = false;

  let errorCode = ErrorType.UNKNOWN; // 	デフォルトのエラーメッセージ
  let errorDetail = ''; // 	追加のエラーメッセージ

  // PNG事前圧縮&APNGファイルを生成するか？
  const shouldCompressPNG =
    animationOptionData.enabledPngCompress &&
    animationOptionData.enabledExportApng;

  // 	最終的なテンポラリパスを設定する
  const temporaryLastPath = shouldCompressPNG
    ? temporaryCompressPath
    : temporaryPath;

  try {
    // テンポラリをクリア
    errorCode = ErrorType.TEMPORARY_CLEAN_ERROR;
    await emptyDirectory(temporaryPath);
    await emptyDirectory(temporaryCompressPath);

    console.log('::check-input-files-exist::');
    errorCode = ErrorType.INPUT_CHECK_FILE_NOT_FOUND_ERROR;
    const missing = findMissingItemFile(itemList);
    if (missing) {
      errorDetail = 'file not found: ' + missing.imagePath;
      throw new Error('input file is not exists.');
    }

    console.log('::make-temporary::');
    errorCode = ErrorType.MAKE_TEMPORARY_ERROR;
    await copyTemporaryDirectory(itemList, temporaryPath);

    if (shouldCompressPNG) {
      errorCode = ErrorType.PNG_COMPRESS_ERROR;
      const err = await pngCompressAll(
        itemList,
        appPath,
        temporaryPath,
        temporaryCompressPath
      );
      if (err) {
        errorCode = err.errCode;
        errorDetail = err.errDetail;
        throw err.cause;
      }
    }

    console.log('::start-export-apng::');
    // APNG書き出しが有効になっている場合
    if (animationOptionData.enabledExportApng === true) {
      // ひとまず謎エラーとしとく
      errorCode = ErrorType.APNG_OTHER_ERORR;

      selectedPNGPath = await saveDialog.open('png');
      if (selectedPNGPath) {
        const pngPath = path.join(temporaryLastPath, 'frame*.png');
        const err = await generateApng(
          selectedPNGPath,
          appPath,
          pngPath,
          animationOptionData
        );
        if (err) {
          errorCode = err.errCode;
          errorDetail = err.errDetail;
          throw err.cause;
        }
        isApngGenerated = true;
      }
    }

    console.log('::start-export-wepb::');
    // WebP書き出しが有効になっている場合
    if (animationOptionData.enabledExportWebp === true) {
      // ひとまず謎エラーとしとく
      // this.errorCode = ErrorType.WEBP_OTHER_ERORR;
      selectedWebPPath = await saveDialog.open('webp');
      if (selectedWebPPath) {
        const err = await generateWebp(
          selectedWebPPath,
          appPath,
          temporaryPath,
          itemList,
          animationOptionData
        );
        if (err) {
          errorCode = err.errCode;
          errorDetail = err.errDetail;
          throw err.cause;
        }
        isWebPGenerated = true;
      }
    }

    console.log('::start-export-html::');
    const imageFileSaved = isApngGenerated || isWebPGenerated;
    if (animationOptionData.enabledExportHtml === true && imageFileSaved) {
      errorCode = ErrorType.HTML_ERROR;
      selectedHTMLPath = await saveDialog.open('html');
      if (selectedHTMLPath) {
        const selectedHTMLDirectoryPath = path.dirname(selectedHTMLPath);
        const relativePNGName =
          selectedPNGPath &&
          path.relative(selectedHTMLDirectoryPath, selectedPNGPath);
        const relativeWebPName =
          selectedWebPPath &&
          path.relative(selectedHTMLDirectoryPath, selectedWebPPath);
        generateHtml(
          selectedHTMLPath,
          animationOptionData,
          relativePNGName,
          relativeWebPName
        );
      }
    }

    console.log('::finish::');

    if (!isHtmlGenerated && !isApngGenerated && !isWebPGenerated) {
      console.log('ファイルが一つも保存されませんでした');
    }

    if (isHtmlGenerated && selectedHTMLPath) {
      shell.showItemInFolder(selectedHTMLPath);
    } else if (isApngGenerated && selectedPNGPath) {
      shell.showItemInFolder(selectedPNGPath);
    } else if (isWebPGenerated && selectedWebPPath) {
      shell.showItemInFolder(selectedWebPPath);
    }

    return {
      pngPath: isApngGenerated ? selectedPNGPath : undefined,
      webpPath: isWebPGenerated ? selectedWebPPath : undefined,
      htmlPath: isHtmlGenerated ? selectedHTMLPath : undefined
    };
  } catch (err) {
    return {
      error: {
        cause: err as Error,
        errCode: errorCode,
        errDetail: errorDetail
      }
    };
  }
};

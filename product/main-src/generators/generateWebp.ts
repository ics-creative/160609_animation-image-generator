import * as path from 'path';
import * as fs from 'fs';
import { AnimationImageOptions } from '../../common-src/data/animation-image-option';
import { ErrorType } from '../../common-src/error/error-type';
import { ImageData } from '../../common-src/data/image-data';
import { GenetateError } from './GenerateError';
import { getExeExt } from '../fileFunctions/getExeExt';
import { waitExecFile } from '../fileFunctions/execFile';
import { waitImmediate } from '../utils/timer';

const ENOENT_ERROR = 'ENOENT';

/**
 * WEBP アニメーション画像を作ります。
 *
 * @returns
 * @private
 */
export const generateWebp = async (
  exportFilePath: string,
  appPath: string,
  temporaryPath: string,
  itemList: ImageData[],
  optionData: AnimationImageOptions
): Promise<GenetateError | undefined> => {
  const pngDirPath = path.join(temporaryPath);

  // 各フレームをpng -> webp変換
  const pngFiles = itemList.map(
    (item, index) => `${pngDirPath}/frame${index}.png`
  );
  const error = await convertPng2Webps(pngFiles, appPath, optionData);
  if (error) {
    return error;
  }
  await waitImmediate();

  // 全フレーム分の引数を作成
  const options: string[] = [];
  const frameMs = Math.round(1000 / optionData.fps);
  const outTmpFilePath = path.join(temporaryPath, 'webpmux_out.webp');

  for (let i = 0; i < itemList.length; i++) {
    // フレーム数に違和感がある
    options.push(`-frame`);
    options.push(`${pngDirPath}/frame${i}.png.webp`);
    options.push(`+${frameMs}+0+0+1`);
  }

  if (optionData.noLoop === false) {
    options.push(`-loop`);
    options.push(optionData.loop + '');
  }

  options.push(`-o`);
  options.push(outTmpFilePath);

  // コマンド引数を一時ファイルに書き込み
  const argumentFilePath = path.join(temporaryPath, 'webpmux_arguments.txt');
  const argsText = options.join(' ');
  fs.writeFileSync(argumentFilePath, argsText);

  // 引数ファイルを使ってwebpmuxを実行
  let errorCode = ErrorType.CWEBP_OTHER_ERROR;
  const { err, stdout, stderr } = await waitExecFile(
    `${appPath}/bin/webpmux${getExeExt()}`,
    [argumentFilePath]
  );

  // 引数ファイルを削除
  fs.unlinkSync(argumentFilePath);

  if (err) {
    console.error(stderr);
    // TODO: ENOENT_ERRORの場合はErrorType.WEBPMUX_ACCESS_ERRORを返したい
    errorCode = ErrorType.WEBPMUX_ERROR;
    return {
      cause: err,
      errCode: errorCode,
      // ファイル経由で引数を渡すとerrのメッセージから引数の内容がわからないため、エラー詳細に明示的に引数の内容を出力する
      errDetail: err.code + ' : ' + stdout + ', arguments:' + argsText
    };
  }

  // 出力ファイルを目的地に移動＆リネーム
  // 移動先はユーザの領域・ファイル名なので、出力先ディレクトリが無くなっている・ロックされている等の場合に備えて明示的にエラーを拾う
  try {
    fs.renameSync(outTmpFilePath, exportFilePath);
  } catch (mvErr) {
    console.error(mvErr);
    errorCode = ErrorType.FILE_MOVE_ERROR;
    return {
      cause: mvErr as Error,
      errCode: errorCode,
      errDetail: `move failed: ${outTmpFilePath} -> ${exportFilePath}`
    };
  }
};

/**
 * PNG->WebPの変換を一括で行います
 *
 * @param pngPaths
 * @param appPath
 * @param optionData
 * @return 処理に失敗した場合はエラー詳細。成功した場合はundefined
 */
const convertPng2Webps = async (
  pngPaths: string[],
  appPath: string,
  optionData: AnimationImageOptions
): Promise<GenetateError | undefined> => {
  const promises = pngPaths.map((png) =>
    convertPng2Webp(png, appPath, optionData)
  );
  const errors = await Promise.all(promises);
  const error = errors.find((result) => result);
  return error;
};

/**
 * PNG->WebPの変換を行います
 *
 * @param pngPaths
 * @param appPath
 * @param optionData
 * @return 処理に失敗した場合はエラー詳細。成功した場合はundefined
 */
const convertPng2Webp = async (
  filePath: string,
  appPath: string,
  optionData: AnimationImageOptions
): Promise<GenetateError | undefined> => {
  const options: string[] = [];
  options.push(filePath);
  options.push(`-o`);
  options.push(`${filePath}.webp`);
  options.push(filePath);

  if (optionData.enabledWebpCompress === true) {
    options.push(`-preset`, `drawing`);
  } else {
    options.push(`-lossless`);
    // 超低容量設定
    // options.push(`-q`, `100`);
    // options.push(`-m`, `6`);
  }

  await waitImmediate();
  const { err, stdout, stderr } = await waitExecFile(
    `${appPath}/bin/cwebp${getExeExt()}`,
    options
  );

  if (!err) {
    return;
  }
  console.error(stderr);
  return {
    cause: err,
    errDetail: stderr,
    // TODO: ENOENT_ERRORの場合はErrorType.WEBPMUX_ACCESS_ERRORを返したい
    errCode: ErrorType.CWEBP_ERROR
  };
};

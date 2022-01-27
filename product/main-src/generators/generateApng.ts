import { waitExecFile } from 'fileFunctions/execFile';
import { getExeExt } from 'fileFunctions/getExeExt';
import * as path from 'path';
import { waitImmediate } from 'utils/timer';
import { AnimationImageOptions } from '../../common-src/data/animation-image-option';
import { ImageData } from '../../common-src/data/image-data';
import { ErrorType } from '../../common-src/error/error-type';
import { CompressionType } from '../../common-src/type/CompressionType';
import { GenetateError } from './GenerateError';

const ENOENT_ERROR = 'ENOENT';

/**
 * APNG画像を保存します。
 * @returns {Promise<T>}
 * @private
 */
export const generateApng = async (
  exportFilePath: string,
  appPath: string,
  pngPath: string,
  optionData: AnimationImageOptions
): Promise<GenetateError | undefined> => {
  const compressOptions = getCompressOption(optionData.compression);
  console.log('optionData.loop : ' + optionData.loop);
  const loopOption = '-l' + (optionData.noLoop ? 0 : optionData.loop);
  console.log('loopOption : ' + loopOption);
  const options = [
    exportFilePath,
    pngPath,
    '1',
    String(optionData.fps),
    compressOptions,
    loopOption,
    '-kc'
  ];

  await waitImmediate();
  const { err, stdout, stderr } = await waitExecFile(
    path.join(appPath, `/bin/apngasm${getExeExt()}`),
    options
  );
  if (err) {
    // TODO: ENOENTの場合にErrorType.APNG_ACCESS_ERORRを返したい
    const errorCode = ErrorType.APNG_ERORR;

    return {
      cause: err,
      errCode: errorCode,
      errDetail: stdout
    };
  }
};

export const pngCompressAll = async (
  itemList: ImageData[],
  appPath: string,
  inDir: string,
  outDir: string
): Promise<GenetateError | undefined> => {
  const promises = itemList.map(item =>
    pngCompress(item, appPath, inDir, outDir)
  );
  const errors = await Promise.all(promises);
  return errors.find(error => error);
};

/* tslint:enable:quotemark */
const getCompressOption = (type: CompressionType) => {
  switch (type) {
    case CompressionType.zlib:
      return '-z0';
    case CompressionType.zip7:
      return '-z1';
    case CompressionType.Zopfli:
      return '-z2';
  }
};

const pngCompress = async (
  item: ImageData,
  appPath: string,
  inDir: string,
  outDir: string
): Promise<GenetateError | undefined> => {
  const options: string[] = [
    '--quality=65-80',
    '--speed',
    '1',
    '--output',
    path.join(`${outDir}`, `frame${item.frameNumber}.png`),
    '--',
    path.join(`${inDir}`, `frame${item.frameNumber}.png`)
  ];

  const { err, stdout, stderr } = await waitExecFile(
    `${appPath}/bin/pngquant${getExeExt()}`,
    options
  );

  if (!err) {
    return;
  }
  console.error(err);
  console.error(stderr);

  // TODO: ENOENTの場合にErrorType.APNG_ACCESS_ERORRを返したい
  let errorCode: number;
  if (err.code === 99) {
    errorCode = ErrorType.PNG_COMPRESS_QUALITY_ERROR;
  } else {
    errorCode = ErrorType.PNG_COMPRESS_ERROR;
  }

  return {
    cause: err,
    errCode: errorCode,
    errDetail: stdout
  };
};

import { ImageData } from '../../../../common-src/data/image-data';

interface ImageSizeMatchedResult {
  /** 最初の画像のサイズ。取得できなかった場合はundefined */
  baseSize?: {
    w: number;
    h: number;
  };
  /** 不一致があった場合、最初に見つかった画像 */
  errorItem?: ImageData;
}

/** 画像のサイズ（ピクセル数）を取得します。読み込みに失敗した場合はundefinedを返します */
const getImagePxSize = async (
  path: string
): Promise<{ w: number; h: number } | void> => {
  const image = new Image();
  return new Promise((resolve) => {
    image.onload = (event: Event) => {
      resolve({
        w: image.width,
        h: image.height
      });
    };
    image.onerror = (err) => {
      /* '画像読み込みエラー' */
      console.error(err);
      resolve();
    };
    image.src = path;
  });
};

/** 1枚目の画像を基準とし、全ての画像のサイズが一致するかチェックします */
export const checkImagePxSizeMatched = async (
  items: ImageData[]
): Promise<ImageSizeMatchedResult> => {
  const imageSizes = await Promise.all(
    items.map((item) => item.imagePath).map(getImagePxSize)
  );
  const [firstItem, ...restItems] = items;
  const [firstSize, ...restSizes] = imageSizes;
  if (!firstSize) {
    // 最初の画像のサイズが取れなかったら何もせずに終了
    return {};
  }
  // 指定のアイテムのサイズを取得して1枚目と一致するか確認する
  const mismatchedIndex = restSizes.findIndex(
    (size) => !size || size.w !== firstSize.w || size.h !== firstSize.h
  );
  return {
    baseSize: firstSize,
    errorItem: items[mismatchedIndex]
  };
};

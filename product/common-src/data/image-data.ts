/**
 * アニメーション画像の情報を定義したクラスです。
 */
export class ImageData {
  public readonly imageBaseName: string;
  public readonly imagePath: string;
  public frameNumber: number;

  constructor(imageBaseName: string, imagePath: string, frameNumber: number) {
    this.imageBaseName = imageBaseName
    this.imagePath = imagePath
    this.frameNumber = frameNumber
  }
}

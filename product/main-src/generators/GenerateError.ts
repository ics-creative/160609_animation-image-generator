/** 画像生成エラー */
export interface GenetateError {
  errDetail: string;
  errCode: number;
  cause: Error;
}

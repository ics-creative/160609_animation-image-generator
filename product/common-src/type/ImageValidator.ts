/** バリデーションエラーを示す型です */
interface ValidationError {
  message: string;
}

/** バリデーションの結果。エラーがない場合はundefinedになります */
export type ValidationResult = ValidationError | undefined;

/** バリデータの定義 */
export interface ImageValidator {
  /** ファイルサイズを検証し、エラーがあれば返します */
  getFileSizeError: (bytes: number) => ValidationResult;
  /** ループ回数を検証し、エラーがあれば返します */
  getLoopCountError: (count: number) => ValidationResult;
  /** フレーム数を検証し、エラーがあれば返します */
  getFrameCountError: (count: number) => ValidationResult;
  /** 再生時間を検証し、エラーがあれば返します */
  getDurationError: (sec: number) => ValidationResult;
  /** 画像サイズを検証し、エラーがあれば返します */
  getImageSizeError: (w: number, h: number) => ValidationResult;
}

/** バリデータのバリデーションエラーの型 */
export interface ImageValidatorResult {
  /** ファイルサイズチェックエラー */
  fileSizeError: ValidationResult;
  /** ループ回数チェックエラー */
  loopCountError: ValidationResult;
  /** フレーム数チェックエラー */
  frameCountError: ValidationResult;
  /** 再生時間チェックエラー */
  durationError: ValidationResult;
  /** 画像サイズチェックエラー */
  imageSizeError: ValidationResult;
}

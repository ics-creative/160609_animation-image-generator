/** 配列からnull除外する際のユーティリティ */
export const notNull = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined;

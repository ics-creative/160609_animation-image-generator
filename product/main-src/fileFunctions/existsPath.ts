import * as fs from 'fs';

/** 指定したパスが存在すればそのパスを、存在しないならundefinedを返します */
export const existsPath = (f: string): string | undefined => {
  try {
    fs.statSync(f);
    return f;
  } catch (e) {
    return undefined;
  }
};

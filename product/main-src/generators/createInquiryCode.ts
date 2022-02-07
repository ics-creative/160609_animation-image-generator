import { platform } from 'os';
import { createHash } from 'crypto';
export const createInquiryCode = (): string => {
  // お問い合わせコード生成
  const hash = createHash('sha256');
  hash.update(platform + '/' + new Date().toString());
  return hash.digest('hex').slice(0, 8);
};

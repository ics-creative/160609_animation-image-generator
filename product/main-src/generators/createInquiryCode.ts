export const createInquiryCode = (): string => {
  const SHA256 = require('crypto-js/sha256');
  // お問い合わせコード生成
  return SHA256(require('os').platform + '/' + new Date().toString())
    .toString()
    .slice(0, 8);
};

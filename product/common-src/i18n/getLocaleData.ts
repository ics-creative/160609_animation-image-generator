import { localeDataEn } from './localeDataEn';
import { localeDataJa } from './localeDataJa';

export const localeDataFor = (lang: 'ja' | 'en') =>
  lang === 'ja' ? localeDataJa : localeDataEn;

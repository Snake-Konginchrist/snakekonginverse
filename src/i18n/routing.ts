import { defineRouting } from 'next-intl/routing';

export const locales = ['zh-CN', 'zh-TW', 'en', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  en: 'English',
  ja: '日本語',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'zh-CN',
  localePrefix: 'always',
});

export function hasLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

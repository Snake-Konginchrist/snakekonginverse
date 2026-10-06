import { defineRouting } from 'next-intl/routing';
import siteConfig from '@/config/site.json';

export const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ru: 'Русский',
};

export const routing = defineRouting({
  locales,
  defaultLocale: siteConfig.defaultLocale as (typeof locales)[number],
  localePrefix: 'never',
});

export function hasLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localizedPath(pathname: string, _locale: Locale): string {
  return pathname || '/';
}

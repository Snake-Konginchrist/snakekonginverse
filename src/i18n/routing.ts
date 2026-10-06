import { defineRouting } from 'next-intl/routing';
import siteConfig from '@/config/site.json';

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
  defaultLocale: siteConfig.defaultLocale as (typeof locales)[number],
  localePrefix: 'always',
});

export function hasLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localizedPath(pathname: string, locale: Locale): string {
  return pathname === '/' ? `/${locale}` : `${pathname.replace(/\/$/, '')}/${locale}`;
}

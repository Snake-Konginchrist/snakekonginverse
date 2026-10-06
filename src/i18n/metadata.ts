import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { hasLocale, localizedPath, type Locale } from './routing';
import { notFound } from 'next/navigation';

/** 为静态栏目页生成当前语言的标题和摘要，避免 SEO 只显示简体中文。 */
export async function localizedMetadata(
  localeParam: string,
  namespace: string,
  pathname: string,
): Promise<Metadata> {
  if (!hasLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const t = await getTranslations({ locale, namespace });
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: localizedPath(pathname, locale) },
  };
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/i18n/routing';

/** 客户端只负责保留当前路径并切换语言，页面内容仍由服务端渲染。 */
export function LocaleSwitcher() {
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations('common');
  return (
    <details className="locale-switcher">
      <summary aria-label={t('language')}>{localeLabels[current]}</summary>
      <div className="locale-switcher-menu">
        {locales.map((locale) => (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={locale === current ? 'page' : undefined}
          >
            {localeLabels[locale]}
          </Link>
        ))}
      </div>
    </details>
  );
}

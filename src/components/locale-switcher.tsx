'use client';

import type { MouseEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/i18n/routing';

function stripLocaleSuffix(pathname: string): string {
  const suffix = locales.find((locale) => pathname.endsWith(`/${locale}`));
  if (!suffix) return pathname;
  const base = pathname.slice(0, -(suffix.length + 1));
  return base || '/';
}

/** 客户端只负责保留当前路径并切换语言，页面内容仍由服务端渲染。 */
export function LocaleSwitcher() {
  const current = useLocale() as Locale;
  const pathname = stripLocaleSuffix(usePathname());
  const t = useTranslations('common');
  const switchLocale = (event: MouseEvent<HTMLAnchorElement>, locale: Locale) => {
    event.preventDefault();
    document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.assign(
      window.location.pathname + window.location.search + window.location.hash,
    );
  };
  return (
    <details className="locale-switcher relative [flex:0_0_auto] text-[color:var(--muted)] text-[11px] [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:py-[10px] [&_summary::-webkit-details-marker]:hidden [&_summary::after]:[content:'⌄'] [&_summary::after]:[margin-left:5px] [&_summary::after]:text-[12px] max-[760px]:[margin-left:auto] max-[760px]:[margin-right:8px]">
      <summary aria-label={t('language')}>{localeLabels[current]}</summary>
      <div className="locale-switcher-menu absolute [top:38px] [right:0] z-[20] grid [min-width:104px] p-[6px] [border:1px_solid_var(--line)] rounded-[8px] bg-[var(--surface)] [box-shadow:0_14px_35px_#17243c18] [&_a]:p-[8px_10px] [&_a]:rounded-[5px] [&_a]:whitespace-nowrap [&_a:hover]:text-[color:var(--accent)] [&_a:hover]:bg-[var(--accent-soft)] [&_a[aria-current='page']]:text-[color:var(--accent)] [&_a[aria-current='page']]:bg-[var(--accent-soft)]">
        {locales.map((locale) => (
          <a
            key={locale}
            href={pathname}
            onClick={(event) => switchLocale(event, locale)}
            aria-current={locale === current ? 'page' : undefined}
          >
            {localeLabels[locale]}
          </a>
        ))}
      </div>
    </details>
  );
}

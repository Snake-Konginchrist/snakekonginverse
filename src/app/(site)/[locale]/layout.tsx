import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { getSettings } from '@/lib/content';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SiteAnalytics } from '@/components/site-analytics';
import { hasLocale, locales, type Locale } from '@/i18n/routing';
import { requiredEnv } from '@/lib/env';
import '@fontsource-variable/noto-serif-sc';
import '@fontsource-variable/noto-serif-tc';
import '@fontsource-variable/noto-serif-jp';
import '@fontsource-variable/google-sans';
import '@/styles/tokens.css';
import '@/styles/novels.css';

export const dynamic = 'force-dynamic';
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const localeParam = (await params).locale;
  if (!hasLocale(localeParam)) notFound();
  const locale: Locale = localeParam;
  const settings = await getSettings(locale);
  return {
    metadataBase: new URL(requiredEnv('NEXT_PUBLIC_SITE_URL')),
    title: { default: settings.brand, template: `%s - ${settings.brand}` },
    description: settings.description,
    openGraph: { siteName: settings.brand, locale: locale.replace('-', '_'), type: 'website' },
  };
}

/** 前台与管理后台使用独立根布局，避免全局样式及导航互相污染。 */
export default async function SiteLayout({ children, params }: Props) {
  const localeParam = (await params).locale;
  if (!hasLocale(localeParam)) notFound();
  const locale = localeParam;
  const settings = await getSettings(locale);
  const messages = await getMessages();
  const t = await getTranslations('common');
  return (
    <html lang={locale} data-accent={settings.accent} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider messages={messages}>
          <a
            className="skip-link fixed [top:-100px] [left:20px] z-[100] p-[12px] bg-[var(--ink)] [color:white] [&:focus]:[top:12px]"
            href="#main"
          >
            {t('skipToContent')}
          </a>
          <SiteHeader settings={settings} />
          <main id="main">{children}</main>
          <SiteFooter settings={settings} />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' &&
          (process.env.CLARITY_PROJECT_ID || process.env.GA4_MEASUREMENT_ID) && (
            <SiteAnalytics
              clarityId={process.env.CLARITY_PROJECT_ID?.trim()}
              gaId={process.env.GA4_MEASUREMENT_ID?.trim()}
            />
          )}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { getSettings } from '@/lib/content';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import '@/styles/tokens.css';
import '@/styles/sections.css';
import '@/styles/site.css';
import '@/styles/orbit.css';
import '@/styles/content.css';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: { default: settings.brand, template: `%s · ${settings.brand}` },
    description: settings.description,
    openGraph: { siteName: settings.brand, locale: 'zh_CN', type: 'website' },
  };
}

/** 前台与管理后台使用独立根布局，避免全局样式及导航互相污染。 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="zh-CN" data-accent={settings.accent ?? 'blue'}>
      <body>
        <a className="skip-link" href="#main">
          跳转到正文
        </a>
        <SiteHeader settings={settings} />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}

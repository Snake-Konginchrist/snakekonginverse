import { ArrowUpRight, Asterisk } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SiteSetting } from '@/payload-types';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/locale-switcher';

const moreItems = [
  { key: 'links', href: '/links' },
  { key: 'recommendations', href: '/recommendations' },
  { key: 'communities', href: '/communities' },
  { key: 'contact', href: '/contact' },
  { key: 'identities', href: '/identities' },
  { key: 'changelog', href: '/changelog' },
  { key: 'discussion', href: '/discussion' },
] as const;

const navKeyByHref: Record<string, string> = {
  '/': 'home',
  '/projects': 'projects',
  '/creations': 'creations',
  '/journal': 'journal',
  '/about': 'about',
  ...Object.fromEntries(moreItems.map((item) => [item.href, item.key])),
};

/** 原生 details 提供移动导航，无额外客户端状态且支持键盘操作。 */
export function SiteHeader({ settings }: { settings: SiteSetting }) {
  const t = useTranslations('navigation');
  const items = settings.navigation ?? [];
  const visibleMoreItems = moreItems.filter(
    (item) => !items.some((candidate) => candidate.href === item.href),
  );
  const mobileItems = [...items, ...visibleMoreItems];
  return (
    <header className="site-header shell">
      <Link href="/" className="brand" aria-label={`${settings.brand} 首页`}>
        <span className="brand-symbol">
          <Asterisk size={26} strokeWidth={1.5} />
        </span>
        <span>{settings.brand}</span>
        <span className="brand-dot">®</span>
      </Link>
      <nav className="desktop-nav" aria-label="主导航">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {navKeyByHref[item.href] ? t(navKeyByHref[item.href]) : item.label}
          </Link>
        ))}
        <details className="header-more">
          <summary>{t('more')}</summary>
          <div className="header-more-menu">
            {visibleMoreItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {t(item.key)}
              </Link>
            ))}
          </div>
        </details>
      </nav>
      <Link className="header-contact" href="/contact">
        {t('keepInTouch')} <ArrowUpRight size={15} />
      </Link>
      <LocaleSwitcher />
      <details className="mobile-nav">
        <summary>
          {t('menu')} <span>＋</span>
        </summary>
        <nav aria-label="移动导航">
          {mobileItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {navKeyByHref[item.href]
                ? t(navKeyByHref[item.href])
                : 'label' in item
                  ? item.label
                  : t(item.key)}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}

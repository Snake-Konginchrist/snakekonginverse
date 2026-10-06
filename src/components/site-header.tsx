import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SiteSetting } from '@/payload-types';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

const moreItems = [
  { key: 'links', href: '/links' },
  { key: 'contact', href: '/contact' },
  { key: 'changelog', href: '/changelog' },
] as const;

const navKeyByHref: Record<string, string> = {
  '/': 'home',
  '/projects': 'projects',
  '/creations': 'creations',
  '/journal': 'journal',
  '/about': 'about',
  ...Object.fromEntries(moreItems.map((item) => [item.href, item.key])),
};

function FlagMark() {
  return (
    <svg className="brand-symbol" viewBox="0 0 32 32" role="img" aria-label="四色旗">
      <rect width="32" height="32" rx="5" fill="currentColor" />
      <path d="M2 2h14v14H2z" fill="#176354" />
      <path d="M16 2h14v14H16z" fill="#254ce5" />
      <path d="M2 16h14v14H2z" fill="#f1c84b" />
      <path d="M16 16h14v14H16z" fill="#c94b3f" />
    </svg>
  );
}

/** 原生 details 提供移动导航，无额外客户端状态且支持键盘操作。 */
export function SiteHeader({ settings }: { settings: SiteSetting }) {
  const t = useTranslations('navigation');
  if (!settings.navigation) throw new Error('Site navigation is not configured');
  const items = settings.navigation;
  const visibleMoreItems = moreItems.filter(
    (item) => !items.some((candidate) => candidate.href === item.href),
  );
  const mobileItems = [...items, ...visibleMoreItems];
  return (
    <header className="site-header shell">
      <Link href="/" className="brand" aria-label={`${settings.brand} 首页`}>
        <FlagMark />
        <span>{settings.brand}</span>
        <span className="brand-dot">®</span>
      </Link>
      <nav className="desktop-nav" aria-label="主导航">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {navKeyByHref[item.href] ? t(navKeyByHref[item.href]) : item.label}
          </Link>
        ))}
        <Link href="/contact">{t('contact')}</Link>
        <Link href="/links">{t('links')}</Link>
      </nav>
      <Link className="header-contact" href="/contact">
        {t('keepInTouch')} <ArrowUpRight size={15} />
      </Link>
      <ThemeToggle />
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

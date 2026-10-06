import siteConfig from '@/config/site.json';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SiteSetting } from '@/payload-types';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

const navKeyByHref: Record<string, string> = {
  '/': 'home',
  '/projects': 'projects',
  '/research': 'research',
  '/creations': 'creations',
  '/journal': 'journal',
  '/about': 'about',
};

/** 原生 details 提供移动导航，无额外客户端状态且支持键盘操作。 */
export function SiteHeader({ settings }: { settings: SiteSetting }) {
  const t = useTranslations('navigation');
  const commonT = useTranslations('common');
  if (!settings.navigation) throw new Error('Site navigation is not configured');
  const items = siteConfig.navigation.map(
    (item) => settings.navigation?.find((saved) => saved.href === item.href) ?? item,
  );
  return (
    <header className="site-header h-[100px] flex items-center gap-[20px] [border-bottom:1px_solid_var(--line)] max-[1000px]:gap-[20px] max-[760px]:h-[auto] max-[760px]:justify-between max-[760px]:gap-[12px] max-[760px]:flex-wrap max-[760px]:min-h-[90px] max-[760px]:py-[14px] min-[761px]:max-[1200px]:flex-wrap min-[761px]:max-[1200px]:h-[auto] min-[761px]:max-[1200px]:min-h-[100px] min-[761px]:max-[1200px]:py-[16px] min-[761px]:max-[1200px]:gap-[14px] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)]">
      <Link
        href="/"
        className="brand flex items-center gap-[18px] [flex-shrink:0] text-[28px] font-[family-name:var(--font-display)] font-[500] tracking-[0] whitespace-nowrap [&:hover_.brand-symbol]:[transform:rotate(0deg)_translateY(-1px)] max-[760px]:text-[23px] max-[760px]:gap-[10px]"
        aria-label={commonT('homeLabel', { brand: settings.brand })}
      >
        <Image
          src="/icon.svg"
          className="brand-symbol block w-[44px] h-[44px] [flex-shrink:0] [transition:transform_0.2s] max-[760px]:w-[36px] max-[760px]:h-[36px]"
          alt={commonT('flagAlt')}
          width={44}
          height={44}
          unoptimized
        />
        <span className="brand-copy grid gap-[3px]">
          <span className="brand-title leading-[1.15]">{settings.brand}</span>
          <span className="brand-tagline [font:9px/1.5_var(--font-mono)] text-[color:var(--muted)] tracking-[0.7px] max-[760px]:text-[7px] max-[760px]:tracking-[0]">
            {commonT('brandTagline')}
          </span>
        </span>
      </Link>
      <nav
        className="desktop-nav flex gap-[22px] [margin-left:auto] text-[13px] text-[color:var(--muted)] whitespace-nowrap [&_a:hover]:text-[color:var(--accent)] max-[1000px]:gap-[16px] max-[760px]:hidden min-[761px]:max-[1200px]:[order:5] min-[761px]:max-[1200px]:w-[100%] min-[761px]:max-[1200px]:[margin-left:0] min-[761px]:max-[1200px]:justify-between"
        aria-label={commonT('mainNavigation')}
      >
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {navKeyByHref[item.href] ? t(navKeyByHref[item.href]) : item.label}
          </Link>
        ))}
      </nav>
      <Link
        className="header-contact flex items-center gap-[12px] p-[10px_15px] [border:1px_solid_var(--line)] rounded-[6px] text-[12px] max-[1000px]:hidden min-[761px]:max-[1200px]:hidden"
        href="/about#contact"
      >
        {t('contact')} <ArrowUpRight size={15} />
      </Link>
      <ThemeToggle />
      <LocaleSwitcher />
      <details className="mobile-nav hidden max-[760px]:block max-[760px]:relative max-[760px]:text-[12px] max-[760px]:[&_summary]:cursor-pointer max-[760px]:[&_summary]:list-none max-[760px]:[&_summary]:p-[12px_0_12px_14px] max-[760px]:[&_summary_span]:pl-[6px] max-[760px]:[&_nav]:absolute max-[760px]:[&_nav]:[right:0] max-[760px]:[&_nav]:[top:46px] max-[760px]:[&_nav]:w-[190px] max-[760px]:[&_nav]:p-[8px] max-[760px]:[&_nav]:bg-[var(--surface)] max-[760px]:[&_nav]:[border:1px_solid_var(--line)] max-[760px]:[&_nav]:rounded-[8px] max-[760px]:[&_nav]:z-[5] max-[760px]:[&_nav]:[box-shadow:0_12px_40px_#17243c18] max-[760px]:[&_nav_a]:block max-[760px]:[&_nav_a]:p-[12px]">
        <summary>
          {t('menu')} <span>＋</span>
        </summary>
        <nav aria-label={commonT('mobileNavigation')}>
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {t(navKeyByHref[item.href])}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}

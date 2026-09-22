import Link from 'next/link';
import { ArrowUpRight, Asterisk } from 'lucide-react';
import type { SiteSetting } from '@/payload-types';

/** 原生 details 提供移动导航，无额外客户端状态且支持键盘操作。 */
export function SiteHeader({ settings }: { settings: SiteSetting }) {
  const items = settings.navigation ?? [];
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
          <Link key={item.id} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-contact" href="/#connect">
        保持联系 <ArrowUpRight size={15} />
      </Link>
      <details className="mobile-nav">
        <summary>
          导航 <span>＋</span>
        </summary>
        <nav aria-label="移动导航">
          {items.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </details>
    </header>
  );
}

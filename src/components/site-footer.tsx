import Link from 'next/link';
import { ArrowUpRight, Asterisk } from 'lucide-react';
import type { SiteSetting } from '@/payload-types';

/** 未配置联系方式时保留真实说明，不生成虚构邮箱和社交帐号。 */
export function SiteFooter({ settings }: { settings: SiteSetting }) {
  return (
    <footer id="connect" className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <p className="eyebrow">LET’S CONNECT</p>
            <h2>好想法，值得一次相遇。</h2>
          </div>
          <Asterisk size={56} strokeWidth={1} />
        </div>
        <div className="social-links">
          {settings.socials?.length ? (
            settings.socials.map((item) => (
              <a key={item.id} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
                <ArrowUpRight size={18} />
              </a>
            ))
          ) : (
            <p>联系方式即将更新。先在这个小宇宙里逛逛吧。</p>
          )}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {settings.author}
          </span>
          <span>CODE WITH INTENT. CREATE WITH HEART.</span>
          <Link href="/admin">内容管理 ↗</Link>
        </div>
      </div>
    </footer>
  );
}

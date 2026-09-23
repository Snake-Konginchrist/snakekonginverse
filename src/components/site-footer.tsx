import { ArrowUpRight, Asterisk } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SiteSetting } from '@/payload-types';

/** 未配置联系方式时保留真实说明，不生成虚构邮箱和社交帐号。 */
export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const t = useTranslations('footer');
  const commonT = useTranslations('common');
  return (
    <footer id="connect" className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2>{t('headline')}</h2>
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
            <p>{t('empty')}</p>
          )}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {settings.author}
          </span>
          <span>{t('signature')}</span>
          <a href="/admin">{commonT('admin')} ↗</a>
        </div>
      </div>
    </footer>
  );
}

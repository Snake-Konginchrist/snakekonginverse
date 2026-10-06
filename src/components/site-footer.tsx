import { ArrowUpRight, Asterisk, Link2, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { SiteSetting } from '@/payload-types';
import Link from 'next/link';
import { SiGithub, SiX } from 'react-icons/si';

function SocialIcon({ href }: { href: string }) {
  if (href.includes('github.com')) return <SiGithub aria-hidden="true" size={17} />;
  if (href.includes('x.com') || href.includes('twitter.com')) {
    return <SiX aria-hidden="true" size={17} />;
  }
  if (href.startsWith('mailto:')) return <Mail aria-hidden="true" size={17} />;
  return <Link2 aria-hidden="true" size={17} />;
}

function socialLabel(label: string, href: string) {
  return href.includes('x.com') || href.includes('twitter.com') ? 'X (Twitter)' : label;
}

/** 未配置联系方式时保留真实说明，不生成虚构邮箱和社交帐号。 */
export async function SiteFooter({ settings }: { settings: SiteSetting }) {
  const t = await getTranslations('footer');
  const commonT = await getTranslations('common');
  // oxlint-disable-next-line react/purity -- 动态服务端组件按请求生成年份，不参与客户端 React Compiler。
  const year = new Date().getFullYear();
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
                <SocialIcon href={item.href} />
                {socialLabel(item.label, item.href)}
                <ArrowUpRight size={18} />
              </a>
            ))
          ) : (
            <p>{t('empty')}</p>
          )}
        </div>
        <div className="footer-bottom">
          <span>
            © {year} {settings.author}
          </span>
          <span>{t('signature')}</span>
          <Link href="/admin" prefetch={false}>
            {commonT('admin')} ↗
          </Link>
        </div>
      </div>
    </footer>
  );
}

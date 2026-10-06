import { ArrowUpRight, Asterisk, Link2, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { SiteSetting } from '@/payload-types';
import { Link } from '@/i18n/navigation';
import siteConfig from '@/config/site.json';
import { socialPlatforms } from '@/data/socials';
import { profileSocials } from '@/data/profile';
import { SiBilibili, SiGithub, SiX, SiXiaohongshu } from 'react-icons/si';

function SocialIcon({ href }: { href: string }) {
  const Icon = socialPlatforms.find((platform) => platform.href === href)?.icon;
  if (Icon) return <Icon aria-hidden="true" size={14} />;
  if (href.includes('github.com')) return <SiGithub aria-hidden="true" size={14} />;
  if (href.includes('xiaohongshu.com')) return <SiXiaohongshu aria-hidden="true" size={14} />;
  if (href.includes('bilibili.com')) return <SiBilibili aria-hidden="true" size={14} />;
  if (href.includes('x.com') || href.includes('twitter.com')) {
    return <SiX aria-hidden="true" size={14} />;
  }
  if (href.startsWith('mailto:')) return <Mail aria-hidden="true" size={14} />;
  return <Link2 aria-hidden="true" size={14} />;
}

/** 未配置联系方式时保留真实说明，不生成虚构邮箱和社交帐号。 */
export async function SiteFooter({ settings }: { settings: SiteSetting }) {
  const t = await getTranslations('footer');
  const commonT = await getTranslations('common');
  const socialT = await getTranslations('socials');
  const email = settings.socials?.find((item) => item.href.startsWith('mailto:')) ?? {
    id: 'email',
    label: socialT('email.title'),
    href: profileSocials.find((item) => item.key === 'email')!.href!,
  };
  const socials = [
    email,
    ...(settings.socials ?? []).filter((item) => !item.href.startsWith('mailto:')),
    ...socialPlatforms
      .filter(
        (platform) =>
          platform.href &&
          platform.key !== 'email' &&
          !settings.socials?.some((item) => item.href === platform.href),
      )
      .map((platform) => ({
        id: platform.key,
        label: socialT(`${platform.key}.title`),
        href: platform.href!,
      })),
  ];
  // 页脚与关于页使用相同的平台顺序，CMS 中的账号和显示名称保持原样。
  socials.sort((a, b) => {
    const rank = (href: string) => {
      const index = socialPlatforms.findIndex((platform) => platform.href === href);
      return index < 0 ? socialPlatforms.length : index;
    };
    return rank(a.href) - rank(b.href);
  });
  const secondary = [
    ...(settings.navigation ?? []).filter(
      (item) =>
        !siteConfig.navigation.some((primary) => primary.href === item.href) &&
        !['/contact', '/about#contact'].includes(item.href),
    ),
  ];
  // oxlint-disable-next-line react/purity -- 动态服务端组件按请求生成年份，不参与客户端 React Compiler。
  const year = new Date().getFullYear();
  return (
    <footer
      id="connect"
      className="site-footer [padding-block:57px_24px] bg-[#151613] text-[#f1eadb] [--muted:#bcb4a6] [--accent:#ed7b73] border-t border-white/10"
    >
      <div className="shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)]">
        <div className="footer-top flex justify-between items-center [&_.eyebrow]:text-[color:var(--muted)] [&_.eyebrow]:mb-[14px] [&_h2]:text-[30px] [&_h2]:tracking-[-1px] [&_h2]:font-[500] [&_>_svg]:text-[color:var(--accent)] max-[760px]:[&_h2]:text-[23px] max-[760px]:[&_>_svg]:w-[34px]">
          <div>
            <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
              {t('eyebrow')}
            </p>
            <h2>{t('headline')}</h2>
          </div>
          <Asterisk size={56} strokeWidth={1} />
        </div>
        <div className="social-links flex flex-wrap gap-x-[20px] gap-y-[10px] [margin-block:24px_40px] text-[12px] text-[color:var(--muted)] [&_a]:flex [&_a]:items-center [&_a]:shrink-0 [&_a]:whitespace-nowrap [&_a]:gap-[7px] [&_a]:min-h-[32px] [&_a]:transition-colors [&_a:hover]:text-white">
          {socials.length ? (
            socials.map((item) => (
              <a key={item.id} href={item.href} target="_blank" rel="noreferrer">
                <SocialIcon href={item.href} />
                {item.label}
                <ArrowUpRight size={14} />
              </a>
            ))
          ) : (
            <p>{t('empty')}</p>
          )}
        </div>
        {secondary.length > 0 && (
          <nav
            aria-label={commonT('mainNavigation')}
            className="mb-8 flex flex-wrap gap-6 text-sm text-[var(--muted)]"
          >
            {secondary.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label} ↗
              </Link>
            ))}
          </nav>
        )}
        <div className="footer-bottom flex justify-between gap-[20px] border-t border-white/15 pt-[22px] text-[color:var(--muted)] text-[10px] [&_>_span:nth-child(2)]:font-[family-name:var(--font-mono)] [&_>_span:nth-child(2)]:text-[9px] [&_>_span:nth-child(2)]:tracking-[0.7px] max-[760px]:flex-wrap max-[760px]:leading-[1.8] max-[760px]:[&_>_span:nth-child(2)]:hidden">
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

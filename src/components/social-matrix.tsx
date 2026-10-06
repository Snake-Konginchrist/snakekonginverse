import { useTranslations } from 'next-intl';
import { socialPlatforms } from '@/data/socials';

/** 用品牌图标展示完整社交矩阵；未提供账号的入口保留为可配置占位。 */
export function SocialMatrix() {
  const t = useTranslations('socials');
  const pageT = useTranslations('socialMatrix');
  return (
    <section
      id="contact"
      className="social-matrix pt-[0] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] section py-[64px] max-[760px]:py-[40px]"
      aria-labelledby="social-matrix-title"
    >
      <div className="section-heading flex justify-between items-end gap-[30px] mb-[28px] [&_.eyebrow]:text-[color:var(--accent)] [&_.eyebrow]:mb-[10px] [&_h2]:text-[30px] [&_h2]:tracking-[-1px] [&_h2]:font-[550] [&_>_p]:text-[13px] [&_>_p]:text-[color:var(--muted)] [&_>_p]:leading-[1.8] [&_>_p]:max-w-[290px] max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-[12px] max-[760px]:[&_h2]:text-[27px]">
        <div>
          <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
            {pageT('eyebrow')}
          </p>
          <h2 id="social-matrix-title">{pageT('title')}</h2>
        </div>
        <p>{pageT('description')}</p>
      </div>
      <div className="social-matrix-grid grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] [border-top:1px_solid_var(--line)] [border-left:1px_solid_var(--line)] max-[760px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]">
        {socialPlatforms.map(({ key, icon: Icon, href, account }) => {
          const content = (
            <>
              <Icon aria-hidden="true" size={22} />
              <span>{t(`${key}.title`)}</span>
              <small className="[overflow-wrap:anywhere] normal-case!">
                {account ?? t('pending')}
              </small>
            </>
          );
          return href ? (
            <a
              className="social-tile grid [grid-template-columns:auto_minmax(0,_1fr)] gap-[12px] items-center min-h-[82px] p-[16px] [border-right:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)] [transition:color_0.2s,_background_0.2s] [&:hover]:text-[color:var(--accent)] [&:hover]:bg-[var(--accent-soft)] [&_small]:[grid-column:2] [&_small]:mt-[-8px] [&_small]:text-[color:var(--muted)] [&_small]:[font:9px_var(--font-mono)] [&_small]:tracking-[0.8px] [&_small]:uppercase [&[aria-disabled]]:text-[color:var(--muted)] [&[aria-disabled]]:opacity-[0.62] max-[760px]:min-h-[72px] max-[760px]:p-[13px]"
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {content}
            </a>
          ) : (
            <span
              className="social-tile grid [grid-template-columns:auto_minmax(0,_1fr)] gap-[12px] items-center min-h-[82px] p-[16px] [border-right:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)] [transition:color_0.2s,_background_0.2s] [&:hover]:text-[color:var(--accent)] [&:hover]:bg-[var(--accent-soft)] [&_small]:[grid-column:2] [&_small]:mt-[-8px] [&_small]:text-[color:var(--muted)] [&_small]:[font:9px_var(--font-mono)] [&_small]:tracking-[0.8px] [&_small]:uppercase [&[aria-disabled]]:text-[color:var(--muted)] [&[aria-disabled]]:opacity-[0.62] max-[760px]:min-h-[72px] max-[760px]:p-[13px]"
              key={key}
              aria-disabled={account ? undefined : true}
            >
              {content}
            </span>
          );
        })}
      </div>
    </section>
  );
}

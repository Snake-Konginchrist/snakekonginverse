import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const portalStyles: Record<string, string> = {
  code: 'code [&_.portal-art]:bg-[#eaf0fc] [&_.portal-art]:text-[color:#36549a] [&_.portal-art]:[background-image:linear-gradient(#36549a08_1px,_transparent_1px),_linear-gradient(90deg,_#36549a08_1px,_transparent_1px)] [&_.portal-art]:[background-size:22px_22px] [&_.portal-art-title]:font-[family-name:var(--font-mono)] [&_.portal-art-title]:text-[25px] max-[1000px]:[&_.portal-art-title]:text-[20px] max-[760px]:[&_.portal-art-title]:text-[28px]',
  story:
    "story [&_.portal-art]:bg-[#eceafa] [&_.portal-art]:text-[color:#71558c] [&_.portal-art-title]:[font-family:'Songti_SC',_'SimSun',_serif] [&_.portal-art-title]:tracking-[5px] [&_.portal-art::after]:[content:''] [&_.portal-art::after]:absolute [&_.portal-art::after]:w-[220px] [&_.portal-art::after]:h-[220px] [&_.portal-art::after]:[border:1px_solid_#71558c30] [&_.portal-art::after]:rounded-[50%] [&_.portal-art::after]:[right:-30px] [&_.portal-art::after]:[top:40px]",
  journal:
    'journal [&_.portal-art]:bg-[#eaf1ee] [&_.portal-art]:text-[color:#466957] [&_.portal-art]:[background-image:repeating-linear-gradient(transparent,_transparent_27px,_#46695712_28px)] [&_.portal-art-title]:[font-family:Georgia,_serif] [&_.portal-art-title]:italic',
};

// 入口文案描述栏目用途，不冒充已经发布的作品或文章。
const portals = [
  {
    href: '/projects',
    style: 'code',
  },
  {
    href: '/creations',
    style: 'story',
  },
  {
    href: '/journal',
    style: 'journal',
  },
];

export function Portals({
  title,
  description,
  compact = false,
}: {
  title: string;
  description?: string | null;
  compact?: boolean;
}) {
  const t = useTranslations('portals');
  const commonT = useTranslations('common');
  const localizedPortals = portals.map((item) => {
    const key =
      item.style === 'code' ? 'products' : item.style === 'story' ? 'creations' : 'journal';
    return {
      ...item,
      title: t(key),
      english: t(`${key}English`),
      description: t(`${key}Description`),
      art: t(`${key}Art`),
    };
  });
  if (compact) {
    return (
      <section
        id="explore"
        className="home-explore grid [grid-template-columns:minmax(190px,_0.75fr)_minmax(0,_1.25fr)] items-start gap-[clamp(28px,_8vw,_128px)] [border-block:1px_solid_var(--line)] [padding-block:34px_44px] max-[760px]:[grid-template-columns:1fr] max-[760px]:gap-[20px] max-[760px]:[padding-block:30px_20px] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)]"
      >
        <div className="home-explore-intro pt-[8px] [&_.eyebrow]:text-[color:var(--accent)] [&_.eyebrow]:mb-[12px] [&_h2]:text-[clamp(25px,_3vw,_34px)] [&_h2]:font-[500] [&_h2]:tracking-[-1px] [&_p:last-child]:max-w-[210px] [&_p:last-child]:mt-[14px] [&_p:last-child]:text-[color:var(--muted)] [&_p:last-child]:text-[13px] [&_p:last-child]:leading-[1.8] [&_p:last-child]:whitespace-pre-line max-[760px]:pt-[0] max-[760px]:[&_h2]:text-[25px] max-[760px]:[&_p:last-child]:mt-[8px]">
          <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
            {commonT('explore')}
          </p>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <nav className="home-quick-links [border-top:1px_solid_var(--line)]" aria-label={t('aria')}>
          {localizedPortals.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="home-quick-link grid [grid-template-columns:44px_minmax(0,_1fr)_auto] items-center gap-[12px] min-h-[70px] [border-bottom:1px_solid_var(--line)] [transition:color_0.2s] [&:hover]:text-[color:var(--accent)] [&_>_svg]:text-[color:var(--muted)] [&_>_svg]:[transition:color_0.2s,_transform_0.2s] [&:hover_>_svg]:[color:currentColor] [&:hover_>_svg]:[transform:translate(2px,_-2px)] max-[760px]:min-h-[64px]"
            >
              <span className="home-quick-link-index text-[color:var(--muted)] [font:10px_var(--font-mono)]">
                0{index + 1}
              </span>
              <span className="home-quick-link-copy flex [align-items:baseline] gap-[14px] max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-[3px]">
                <span className="home-quick-link-title text-[18px] font-[500] max-[760px]:text-[17px]">
                  {item.title}
                </span>
                <span className="home-quick-link-tag text-[color:var(--muted)] [font:9px_var(--font-mono)] tracking-[1.2px]">
                  {commonT(
                    item.style === 'code'
                      ? 'products'
                      : item.style === 'story'
                        ? 'creations'
                        : 'journal',
                  )}
                </span>
              </span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
    );
  }

  return (
    <section
      id="explore"
      className="section py-[64px] max-[760px]:py-[40px] shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)]"
    >
      <div className="section-heading flex justify-between items-end gap-[30px] mb-[28px] [&_.eyebrow]:text-[color:var(--accent)] [&_.eyebrow]:mb-[10px] [&_h2]:text-[30px] [&_h2]:tracking-[-1px] [&_h2]:font-[550] [&_>_p]:text-[13px] [&_>_p]:text-[color:var(--muted)] [&_>_p]:leading-[1.8] [&_>_p]:max-w-[290px] max-[760px]:items-start max-[760px]:flex-col max-[760px]:gap-[12px] max-[760px]:[&_h2]:text-[27px]">
        <div>
          <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
            {commonT('waysIn')}
          </p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      <div className="portal-grid grid [grid-template-columns:repeat(3,_1fr)] gap-[22px] max-[760px]:[grid-template-columns:1fr] max-[760px]:gap-[20px]">
        {localizedPortals.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`portal-card [border:1px_solid_var(--line)] rounded-[12px] overflow-hidden bg-[var(--surface)] [transition:transform_0.2s,_box-shadow_0.2s] [&:hover]:[transform:translateY(-5px)] [&:hover]:[box-shadow:0_14px_34px_#23396110] ${portalStyles[item.style]}`}
          >
            <div
              className="portal-art h-[208px] relative p-[22px] overflow-hidden max-[760px]:h-[200px]"
              aria-hidden="true"
            >
              <span className="portal-tag [font:9px_var(--font-mono)] tracking-[1.5px]">
                {commonT(
                  item.style === 'code'
                    ? 'products'
                    : item.style === 'story'
                      ? 'creations'
                      : 'journal',
                )}
              </span>
              <span className="portal-art-title absolute [top:44%] [left:22px] text-[30px] tracking-[-1.5px] max-[1000px]:text-[26px]">
                {item.art}
              </span>
              <span className="portal-art-symbol absolute [right:20px] [bottom:-14px] text-[106px] leading-[1] opacity-[0.2]">
                {item.style === 'story' ? '✧' : item.style === 'journal' ? '↗' : '⌘'}
              </span>
            </div>
            <div className="portal-body p-[24px] [&_.eyebrow]:text-[9px] [&_.eyebrow]:text-[color:var(--muted)] [&_.eyebrow]:tracking-[1.4px] [&_h3]:flex [&_h3]:items-center [&_h3]:justify-between [&_h3]:text-[22px] [&_h3]:font-[550] [&_h3]:[margin-block:10px_12px] [&_>_p:last-child]:text-[color:var(--muted)] [&_>_p:last-child]:text-[12px] [&_>_p:last-child]:leading-[1.9] [&_>_p:last-child]:max-w-[255px] max-[760px]:[&_>_p:last-child]:max-w-[none]">
              <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
                {item.english}
              </p>
              <h3>
                {item.title}
                <ArrowUpRight size={22} />
              </h3>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

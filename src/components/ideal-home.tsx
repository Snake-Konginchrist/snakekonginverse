import Image from 'next/image';
import { ArrowRight, Compass } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HomeRecentEntries } from './home-recent-entries';
import { Link } from '@/i18n/navigation';

export function IdealHome() {
  const t = useTranslations('ideal');
  const cards = [
    {
      key: 'practice',
      description: 'practiceDescription',
      href: '/projects',
      image: 'practice',
    },
    {
      key: 'research',
      description: 'researchDescription',
      href: '/research',
      image: 'research',
    },
    {
      key: 'creations',
      description: 'creationDescription',
      href: '/creations',
      image: 'creations',
    },
    {
      key: 'journal',
      description: 'journalDescription',
      href: '/journal',
      image: 'journal',
    },
  ];
  return (
    <div className="ideal-home bg-[var(--paper)] text-[color:var(--ink)]">
      <section className="ideal-hero relative [aspect-ratio:1800_/_1101] min-h-[0] overflow-hidden [border-bottom:1px_solid_var(--line)] [&::after]:[content:''] [&::after]:absolute [&::after]:[inset:0] [&::after]:[background:linear-gradient(_90deg,_rgba(250,_247,_239,_0.95)_0%,_rgba(250,_247,_239,_0.78)_34%,_rgba(250,_247,_239,_0)_62%_)] [&::after]:z-[1] [&::after]:[pointer-events:none] dark:[&::after]:[background:linear-gradient(_90deg,_rgba(25,_26,_24,_0.92),_rgba(25,_26,_24,_0.62)_38%,_rgba(25,_26,_24,_0)_70%_)] max-[760px]:[aspect-ratio:auto] max-[760px]:[&::after]:hidden">
        {/* 手机端按图片原始比例展示，文案排在下方，避免固定高度裁切头图。 */}
        <Image
          className="ideal-landscape absolute inset-0 block h-full w-full object-cover object-center z-[0] max-[760px]:static max-[760px]:h-auto"
          src="/images/hero.jpg"
          alt=""
          width={1604}
          height={981}
          priority
          sizes="100vw"
        />
        <div className="shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] ideal-copy relative z-[2] pt-[92px] [&_h1]:text-[clamp(48px,_5.2vw,_78px)] [&_h1]:leading-[1.25] [&_h1]:tracking-[0.04em] [&_h1]:font-[700] [&_h1]:[margin:0] [&_h1]:max-w-[760px] [&_h1_span]:block [&_h1_span]:text-[color:#b51c26] max-[760px]:py-[32px] max-[760px]:[&_h1]:text-[42px]">
          <p className="ideal-motto text-[16px] tracking-[0.38em] mb-[24px] max-[760px]:text-[13px] max-[760px]:tracking-[0.22em]">
            {t('eyebrow')}
          </p>
          <h1>
            {t('title')}
            <span>{t('accent')}</span>
          </h1>
          <p className="ideal-intro w-[46%] max-w-[560px] max-[760px]:w-full mt-[28px] text-[18px] leading-[2] tracking-[0.08em] max-[760px]:text-[15px]">
            {t('description')}
          </p>
          <div className="ideal-actions flex flex-wrap gap-[16px] mt-[28px] [&_.button]:rounded-[5px] [&_.button]:min-h-[48px] [&_.button]:gap-[14px] [&_.button]:text-[17px]">
            <Link
              className="button inline-flex items-center justify-center gap-[24px] min-h-[48px] p-[14px_23px] border border-transparent rounded-[7px] text-[14px] font-[600] [transition:background_0.2s,_transform_0.2s] button-primary bg-[var(--accent)] text-[color:#fff] [&:hover]:[filter:brightness(0.92)] [&:hover]:[transform:translateY(-2px)]"
              href="/projects"
            >
              {t('primary')}
              <ArrowRight size={22} />
            </Link>
            <Link
              className="button inline-flex items-center justify-center gap-[24px] min-h-[48px] p-[14px_23px] border rounded-[7px] text-[14px] font-[600] [transition:background_0.2s,_transform_0.2s] ideal-secondary border-[#4b4640] [background:rgba(255,_255,_255,_0.38)]"
              href="/about"
            >
              {t('secondary')}
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] ideal-portals grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] gap-[22px] py-[24px] max-[1100px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[760px]:[grid-template-columns:1fr] max-[760px]:py-[16px]"
        aria-label={t('primary')}
      >
        {cards.map((card, index) => (
          <Link
            href={card.href}
            className="ideal-card p-[12px] [border:1px_solid_var(--line)] rounded-[7px] [transition:transform_0.2s,_box-shadow_0.2s] [&:hover]:[transform:translateY(-3px)] [&:hover]:[box-shadow:0_14px_32px_rgba(60,_42,_22,_0.12)] [&_h2]:text-[27px] [&_h2]:mt-[10px] [&_h2_small]:[font:13px_var(--font-mono)] [&_h2_small]:text-[color:var(--muted)] [&_h2_small]:tracking-[1px] [&_p]:flex [&_p]:justify-between [&_p]:items-center [&_p]:mt-[8px] [&_p]:text-[16px] [&_p]:leading-[1.6]"
            key={card.key}
          >
            <div className="ideal-card-image h-[150px] relative overflow-hidden rounded-[4px] [&_img]:object-cover max-[760px]:h-[180px]">
              {card.image ? (
                <Image
                  src={`/images/${card.image}.png`}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 25vw"
                />
              ) : (
                <div className="flex h-full flex-col justify-between bg-[var(--accent-soft)] p-5 text-[var(--accent)]">
                  <Compass size={32} strokeWidth={1.3} aria-hidden="true" />
                  <span className="text-lg">{t('researchArt')}</span>
                </div>
              )}
            </div>
            <h2>
              <small className="mr-3">0{index + 1}</small>
              {t(card.key)}
            </h2>
            <p>
              {t(card.description)}
              <ArrowRight size={24} />
            </p>
          </Link>
        ))}
      </section>
      <HomeRecentEntries />
      <section className="ideal-principles py-[48px] [background:linear-gradient(90deg,_#f1eee5,_#faf8f1)] dark:[background:linear-gradient(90deg,_var(--paper),_var(--surface))] text-[color:var(--ink)] [border-top:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)] [&_h2]:text-[45px] [&_h2]:[border-left:5px_solid_#b51c26] dark:[&_h2]:border-[var(--accent)] [&_h2]:pl-[16px] max-[760px]:[&_h2]:text-[36px]">
        <div className="shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] ideal-principles-inner grid [grid-template-columns:1fr_1.2fr] gap-[60px] [&_div]:[border-left:1px_solid_#a66c62] [&_div]:pl-[42px] [&_div]:grid [&_div]:gap-[14px] [&_div]:text-[18px] [&_div]:leading-[1.8] max-[760px]:[grid-template-columns:1fr] max-[760px]:gap-[24px] max-[760px]:[&_div]:pl-[20px]">
          <h2>{t('principles')}</h2>
          <div>
            {[1, 2, 3].map((n) => (
              <p key={n}>{t(`principle${n}`)}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

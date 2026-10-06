'use client';

import { useTranslations } from 'next-intl';

/** 不向访客暴露数据库错误和连接信息；提供明确、可操作的重试入口。 */
export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations('errors');
  return (
    <section className="shell w-[min(1200px,_calc(100%_-_96px))] mx-[auto] max-[760px]:w-[calc(100%_-_40px)] section py-[64px] max-[760px]:py-[40px] archive min-h-[65vh] [&_>_.eyebrow]:text-[color:var(--accent)] [&_>_.eyebrow]:mt-[20px] [&_h1]:text-[clamp(32px,_5vw,_54px)] [&_h1]:font-[550] [&_h1]:tracking-[-1.5px] [&_h1]:mt-[20px]">
      <p className="eyebrow font-[family-name:var(--font-mono)] text-[11px] font-[500] tracking-[1.5px] leading-[1.8]">
        {t('connectionEyebrow')}
      </p>
      <h1>{t('connectionTitle')}</h1>
      <p className="archive-intro text-[color:var(--muted)] [margin:20px_0_48px] text-[15px] leading-[1.9]">
        {t('connectionDescription')}
      </p>
      <button
        className="button inline-flex items-center justify-center gap-[24px] min-h-[48px] p-[14px_23px] border border-transparent rounded-[7px] text-[14px] font-[600] [transition:background_0.2s,_transform_0.2s] button-primary bg-[var(--accent)] text-[color:#fff] [&:hover]:[filter:brightness(0.92)] [&:hover]:[transform:translateY(-2px)]"
        onClick={reset}
      >
        {t('retry')}
      </button>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';

/** 不向访客暴露数据库错误和连接信息；提供明确、可操作的重试入口。 */
export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations('errors');
  return (
    <section className="shell section archive">
      <p className="eyebrow">{t('connectionEyebrow')}</p>
      <h1>{t('connectionTitle')}</h1>
      <p className="archive-intro">{t('connectionDescription')}</p>
      <button className="button button-primary" onClick={reset}>
        {t('retry')}
      </button>
    </section>
  );
}

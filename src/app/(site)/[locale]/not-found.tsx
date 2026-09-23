import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('errors');
  const commonT = await getTranslations('common');
  return (
    <section className="shell section archive">
      <p className="eyebrow">{t('notFoundEyebrow')}</p>
      <h1>{t('notFoundTitle')}</h1>
      <p className="archive-intro">{t('notFoundDescription')}</p>
      <Link className="button button-primary" href="/">
        {commonT('backHome')} ↗
      </Link>
    </section>
  );
}

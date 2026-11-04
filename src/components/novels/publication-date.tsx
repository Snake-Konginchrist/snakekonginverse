import { getLocale, getTranslations } from 'next-intl/server';

export async function PublicationDate({ value }: { value?: string | null }) {
  if (!value) return null;
  const locale = await getLocale();
  const t = await getTranslations('novels');
  return (
    <span className="novel-publication-date">
      {t('publishedAt')}{' '}
      <time dateTime={value}>
        {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Shanghai' }).format(
          new Date(value),
        )}
      </time>
    </span>
  );
}

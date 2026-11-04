'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
export function ViewCount({
  initial,
  book,
  chapter,
}: {
  initial: number;
  book?: string;
  chapter?: string;
}) {
  const [views, setViews] = useState<number | null>(null);
  const t = useTranslations('novels');
  const locale = useLocale();
  useEffect(() => {
    if (!book) return;
    let cancelled = false;
    async function record() {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', record);
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          const response = await fetch('/api/novel-views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book, chapter }),
          });
          if (!response.ok) return;
          const data = await response.json();
          if (data.retry) continue;
          if (!cancelled && typeof data.views === 'number') setViews(data.views);
          break;
        }
      } catch {
        /* 统计失败不影响阅读，刷新后可以重试。 */
      }
    }
    void record();
    if (document.visibilityState !== 'visible')
      document.addEventListener('visibilitychange', record);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', record);
    };
  }, [book, chapter, initial]);
  return (
    <span className="novel-view-count">
      {t('views', { count: new Intl.NumberFormat(locale).format(Math.max(initial, views ?? 0)) })}
    </span>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// 合并同页首次请求，避免开发模式重复 effect 同时创建两个访客 Cookie。
const pending = new Map<string, Promise<number | undefined>>();
function recordPage(book: string, chapter?: string) {
  const key = `${book}/${chapter || ''}`;
  const existing = pending.get(key);
  if (existing) return existing;
  const request = (async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch('/api/novel-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book, chapter }),
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.retry) continue;
      return typeof data.views === 'number' ? data.views : undefined;
    }
  })()
    .catch(() => undefined)
    .finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}
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
      const count = await recordPage(book!, chapter);
      if (!cancelled && count !== undefined) setViews(count);
    }
    void record();
    if (document.visibilityState !== 'visible')
      document.addEventListener('visibilitychange', record);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', record);
    };
  }, [book, chapter]);
  return (
    <span className="novel-view-count">
      {t('views', { count: new Intl.NumberFormat(locale).format(Math.max(initial, views ?? 0)) })}
    </span>
  );
}

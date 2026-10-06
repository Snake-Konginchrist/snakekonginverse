'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

let clarityInitialized = false;

export function SiteAnalytics({ clarityId, gaId }: { clarityId?: string; gaId?: string }) {
  const pathname = usePathname();
  const preview = pathname.split('/').includes('preview');

  useEffect(() => {
    if (!clarityId || preview || clarityInitialized) return;
    let cancelled = false;
    void import('@microsoft/clarity').then(({ default: clarity }) => {
      if (cancelled || clarityInitialized) return;
      clarity.init(clarityId);
      clarityInitialized = true;
    });
    return () => {
      cancelled = true;
    };
  }, [clarityId, preview]);

  return !preview && gaId ? <GoogleAnalytics gaId={gaId} /> : null;
}

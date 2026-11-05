'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function ProtectedProse({ children }: { children: ReactNode }) {
  const prose = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function preventBodyCopy(event: ClipboardEvent) {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !prose.current) return;
      for (let i = 0; i < selection.rangeCount; i++) {
        if (selection.getRangeAt(i).intersectsNode(prose.current)) {
          event.preventDefault();
          return;
        }
      }
    }

    document.addEventListener('copy', preventBodyCopy);
    return () => document.removeEventListener('copy', preventBodyCopy);
  }, []);

  return (
    <div className="novel-prose" ref={prose}>
      {children}
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'snakekonginverse-theme';

export function ThemeToggle() {
  const t = useTranslations('theme');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const nextDark = saved ? saved === 'dark' : prefersDark;
    window.requestAnimationFrame(() => setDark(nextDark));
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light';
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light';
    window.localStorage.setItem(STORAGE_KEY, nextDark ? 'dark' : 'light');
  }

  return (
    <button
      className="theme-toggle grid [place-items:center] w-[34px] h-[34px] p-[0] [border:1px_solid_var(--line)] rounded-[50%] [background:transparent] text-[color:var(--muted)] [transition:color_0.2s,_border-color_0.2s,_background_0.2s] [&:hover]:text-[color:var(--accent)] [&:hover]:border-[var(--accent)] [&:hover]:bg-[var(--accent-soft)] min-[761px]:max-[1200px]:[margin-left:auto]"
      type="button"
      onClick={toggleTheme}
      aria-label={t(dark ? 'toLight' : 'toDark')}
      title={t(dark ? 'light' : 'dark')}
    >
      {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}

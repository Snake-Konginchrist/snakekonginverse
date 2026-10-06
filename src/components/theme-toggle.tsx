'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'snakekonginverse-theme';

export function ThemeToggle() {
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
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? '切换到浅色主题' : '切换到深色主题'}
      title={dark ? '浅色主题' : '深色主题'}
    >
      {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}

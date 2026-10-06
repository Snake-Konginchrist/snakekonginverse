import type { Locale } from './routing';

/** 按浏览器偏好权重匹配语言；中文依据文字系统区分简繁。 */
export function detectLocale(header: string | null, defaultLocale: Locale): Locale {
  const preferences = (header ?? '')
    .split(',')
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().split(';');
      const weight = parameters.find((value) => value.trim().startsWith('q='));
      return { tag, quality: weight ? Number(weight.trim().slice(2)) : 1 };
    })
    .filter(({ quality }) => Number.isFinite(quality) && quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of preferences) {
    try {
      const locale = new Intl.Locale(tag).maximize();
      if (locale.language === 'en') return 'en';
      if (locale.language === 'ja') return 'ja';
      if (locale.language === 'ko') return 'ko';
      if (locale.language === 'es') return 'es';
      if (locale.language === 'fr') return 'fr';
      if (locale.language === 'de') return 'de';
      if (locale.language === 'pt') return 'pt';
      if (locale.language === 'ru') return 'ru';
      if (locale.language === 'zh') return locale.script === 'Hant' ? 'zh-TW' : 'zh-CN';
    } catch {
      // 忽略通配符或无效语言标签，继续检查下一项。
    }
  }
  return defaultLocale;
}

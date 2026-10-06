import type { Payload } from 'payload';
import zhCN from '../messages/zh-CN.json';
import zhTW from '../messages/zh-TW.json';
import en from '../messages/en.json';
import ja from '../messages/ja.json';
import ko from '../messages/ko.json';
import es from '../messages/es.json';
import fr from '../messages/fr.json';
import de from '../messages/de.json';
import pt from '../messages/pt.json';
import ru from '../messages/ru.json';
import siteConfig from '../src/config/site.json';
import { locales } from '../src/i18n/routing';

const messages = { 'zh-CN': zhCN, 'zh-TW': zhTW, en, ja, ko, es, fr, de, pt, ru };
const navKeys = {
  '/': 'home',
  '/projects': 'projects',
  '/research': 'research',
  '/creations': 'creations',
  '/journal': 'journal',
  '/about': 'about',
} as const;

function socialKey(href: string) {
  if (href.startsWith('mailto:')) return 'email';
  const host = new URL(href).hostname.replace(/^www\./, '');
  return (
    {
      'github.com': 'github',
      'x.com': 'x',
      'twitter.com': 'x',
      'xiaohongshu.com': 'xiaohongshu',
      'space.bilibili.com': 'bilibili',
    } as const
  )[host as 'github.com'];
}

/** 只补空缺的已知初始设置，不覆盖管理员编辑的任何语言。 */
export async function seedSettingsTranslations(payload: Payload) {
  const original = await payload.findGlobal({
    slug: 'site-settings',
    locale: 'zh-CN',
    fallbackLocale: false,
  });
  const descriptions = [
    siteConfig.description,
    messages['zh-CN'].cms.siteDescription,
    '代码、故事，以及想象力的另一面。',
    '独立开发者 Snake Konginchrist 的产品、研究与个人记录。',
  ];
  for (const locale of locales.filter((value) => value !== 'zh-CN')) {
    const saved = await payload.findGlobal({
      slug: 'site-settings',
      locale,
      fallbackLocale: false,
    });
    const dictionary = messages[locale];
    const navigation = original.navigation?.map((item) => {
      const label = saved.navigation?.find((row) => row.id === item.id)?.label;
      const key = navKeys[item.href as keyof typeof navKeys];
      return { ...item, label: label || (key ? dictionary.navigation[key] : '') };
    });
    const socials = original.socials?.map((item) => {
      const label = saved.socials?.find((row) => row.id === item.id)?.label;
      const key = socialKey(item.href);
      return { ...item, label: label || (key ? dictionary.socials[key].title : '') };
    });
    const description =
      (saved.description && !descriptions.includes(saved.description)
        ? saved.description
        : undefined) ||
      (descriptions.includes(original.description) ? dictionary.cms.siteDescription : undefined);
    const data = {
      ...(description ? { description } : {}),
      ...(navigation?.every((item) => item.label) ? { navigation } : {}),
      ...(socials?.every((item) => item.label) ? { socials } : {}),
    };
    if (Object.keys(data).length)
      await payload.updateGlobal({ slug: 'site-settings', locale, data });
    if (
      !description ||
      navigation?.some((item) => !item.label) ||
      socials?.some((item) => !item.label)
    ) {
      console.warn(`站点设置有自定义内容需要在 CMS 翻译：${locale}`);
    }
  }
}

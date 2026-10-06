import zhCN from '../messages/zh-CN.json';
import zhTW from '../messages/zh-TW.json';
import en from '../messages/en.json';
import ja from '../messages/ja.json';
import type { Locale } from '../src/i18n/routing';
import type { Page } from '../src/payload-types';

const messages = { 'zh-CN': zhCN, 'zh-TW': zhTW, en, ja };
type StarterPage = Pick<Page, 'title' | 'path' | 'layout'>;

/** 翻译文件仅提供初始化文案；公开渲染始终使用编辑器保存的内容。 */
export function starterPages(locale: Locale): StarterPage[] {
  const { cms, navigation } = messages[locale];
  const hero = (copy: typeof cms.home | typeof cms.about) => ({
    blockType: 'hero' as const,
    eyebrow: copy.heroEyebrow,
    title: copy.heroTitle,
    description: copy.heroDescription,
    linkLabel: copy.heroLink,
    href: '/projects',
  });
  return [
    {
      title: navigation.home,
      path: '/',
      layout: [
        hero(cms.home),
        { blockType: 'collection', title: cms.home.collectionTitle, source: 'journal', limit: 3 },
        {
          blockType: 'portals',
          title: cms.home.portalsTitle,
          description: cms.home.portalsDescription,
        },
      ],
    },
    {
      title: locale === 'zh-CN' ? '关于这个宇宙' : navigation.about,
      path: '/about',
      layout: [
        hero(cms.about),
        {
          blockType: 'statement',
          eyebrow: cms.about.statementEyebrow,
          title: cms.about.statementTitle,
          description: cms.about.statementDescription,
        },
      ],
    },
  ];
}

/** 只为未改动的初始页面补翻译；区块 ID 是 CMS 生成的，不参与内容比较。 */
export function isStarterPage(page: StarterPage, starter: StarterPage): boolean {
  return (
    page.path === starter.path &&
    page.title === starter.title &&
    page.layout?.length === starter.layout.length &&
    starter.layout.every((block, index) => {
      const saved = page.layout[index];
      return (
        !saved.blockName &&
        Object.entries(block).every(([key, value]) => saved[key as keyof typeof saved] === value)
      );
    })
  );
}

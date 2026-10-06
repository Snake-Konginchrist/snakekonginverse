import { getPayload } from 'payload';
import config from '../src/payload.config';
import { locales } from '../src/i18n/routing';
import { isStarterPage, starterPages } from './starter-pages';
import { seedSettingsTranslations } from './seed-settings';
import siteConfig from '../src/config/site.json';

/** 首次初始化只写入品牌页面，不创建帐号、虚构作品，也不覆盖后续编辑内容。 */
const payload = await getPayload({ config });
try {
  for (const starter of starterPages('zh-CN')) {
    const existing = await payload.find({
      collection: 'pages',
      where: { path: { equals: starter.path } },
      locale: 'zh-CN',
      draft: true,
      limit: 1,
    });
    let page = existing.docs[0];
    if (!page) {
      page = await payload.create({
        collection: 'pages',
        locale: 'zh-CN',
        data: { ...starter, _status: 'published' },
      });
      console.info(`已初始化页面：${starter.path}`);
    }
    if (page._status !== 'published' || !isStarterPage(page, starter)) continue;
    // 更新旧版初始眉题；自定义正文和未发布草稿不参与改写。
    if (!isStarterPage(page, starter, false))
      await payload.update({
        collection: 'pages',
        id: page.id,
        locale: 'zh-CN',
        data: { title: starter.title, layout: starter.layout, _status: 'published' },
      });
    for (const locale of locales.filter((value) => value !== 'zh-CN')) {
      const localized = await payload.findByID({
        collection: 'pages',
        id: page.id,
        locale,
        fallbackLocale: false,
        draft: true,
      });
      // 已有标题或区块（包括草稿）完全保留，只补尚未开始编辑的语言。
      const translated = starterPages(locale).find((item) => item.path === starter.path)!;
      if (
        (localized.title || localized.layout?.length) &&
        (localized._status !== 'published' || !isStarterPage(localized, translated))
      )
        continue;
      if (isStarterPage(localized, translated, false)) continue;
      await payload.update({
        collection: 'pages',
        id: page.id,
        locale,
        data: {
          title: translated.title,
          layout: translated.layout,
          _status: 'published',
        },
      });
      console.info(`已补初始页面翻译：${starter.path} (${locale})`);
    }
  }
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  // updatedAt 存在代表已经持久化过设置，重跑时保留用户主动清空的导航。
  if (!settings.updatedAt) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        brand: siteConfig.brand,
        author: siteConfig.author,
        description: siteConfig.description,
        accent: siteConfig.accent as 'blue' | 'green' | 'violet',
        navigation: siteConfig.navigation,
        socials: siteConfig.socials,
      },
    });
  }
  await seedSettingsTranslations(payload);
  console.info('初始化完成。请访问 /admin 创建你自己的管理员帐号。');
} finally {
  await payload.destroy();
}
// 所有数据库写入和连接清理已等待完成，结束一次性 CLI，避免框架定时器保持进程。
process.exit(0);

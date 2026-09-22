import { getPayload } from 'payload';
import config from '../src/payload.config';
import type { Page } from '../src/payload-types';

/** 首次初始化只写入品牌页面，不创建帐号、虚构作品，也不覆盖后续编辑内容。 */
const payload = await getPayload({ config });
try {
  const initialPages: { title: string; path: string; layout: Page['layout'] }[] = [
    {
      title: '首页',
      path: '/',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'SNAKE KONGINCHRIST / PERSONAL UNIVERSE',
          title: '把想象，\n写进现实。',
          description:
            '你好，我是 Snake Konginchrist。\n在代码与故事之间，构建自己的小宇宙。\n这里收藏我的技术探索、同人创作，以及沿途的思考。',
          linkLabel: '探索我的宇宙',
          href: '/#explore',
        },
        {
          blockType: 'portals',
          title: '不止一种热爱。',
          description: '理性构建，感性创作。\n三个入口，通向同一个我。',
        },
        {
          blockType: 'statement',
          eyebrow: 'THE MIND BEHIND THE VERSE',
          title: '认真写代码，也认真做梦。',
          description:
            '技术是把想法变成现实的工具，创作是让世界多一种可能的方式。在这里，不用在开发者与创作者之间做选择。',
        },
        { blockType: 'collection', title: '最近写下的。', source: 'journal', limit: 3 },
      ],
    },
    {
      title: '关于这个宇宙',
      path: '/about',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'HELLO, I’M SNAKE KONGINCHRIST',
          title: '始于好奇，\n忠于热爱。',
          description:
            'Snake + Kongin + Verse。\nKongin 是一个完整的词，Verse 是容纳代码、角色、故事和想法的个人宇宙。',
          linkLabel: '看看我在探索什么',
          href: '/#explore',
        },
        {
          blockType: 'statement',
          eyebrow: 'ABOUT THIS SPACE',
          title: '这里不只有一种身份。',
          description:
            '这个网站记录技术与创作的交集。作品、文章与同人故事会逐步发布，每一部分都留下属于自己的位置。',
        },
      ],
    },
  ];
  for (const page of initialPages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { path: { equals: page.path } },
      limit: 1,
    });
    if (!existing.docs.length) {
      await payload.create({ collection: 'pages', data: { ...page, _status: 'published' } });
      console.info(`已初始化页面：${page.path}`);
    }
  }
  const settings = await payload.findGlobal({ slug: 'site-settings' });
  // updatedAt 存在代表已经持久化过设置，重跑时保留用户主动清空的导航。
  if (!settings.updatedAt) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        brand: 'SnakeKonginVerse',
        author: 'Snake Konginchrist',
        description: '代码、故事，以及想象力的另一面。Snake Konginchrist 的个人宇宙。',
        accent: 'blue',
        navigation: [
          { label: '首页', href: '/' },
          { label: '项目', href: '/projects' },
          { label: '创作', href: '/creations' },
          { label: '手记', href: '/journal' },
          { label: '关于', href: '/about' },
        ],
        socials: [],
      },
    });
  }
  console.info('初始化完成。请访问 /admin 创建你自己的管理员帐号。');
} finally {
  await payload.destroy();
}
// 所有数据库写入和连接清理已等待完成，结束一次性 CLI，避免框架定时器保持进程。
process.exit(0);

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
          eyebrow: 'INDEPENDENT DEVELOPER / SK STUDIO',
          title: '把产品做出来，\n也保留一点幻想。',
          description:
            '我是 Snake Konginchrist，做移动产品、AI 工具和研究。\n这里记录正在构建的东西，以及让我继续好奇的事。',
          linkLabel: '看看正在做的',
          href: '/projects',
        },
        { blockType: 'collection', title: '最新手记', source: 'journal', limit: 3 },
        {
          blockType: 'portals',
          title: '从这里开始',
          description: '项目、创作、手记。',
        },
      ],
    },
    {
      title: '关于这个宇宙',
      path: '/about',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'INDEPENDENT DEVELOPER / RESEARCHER',
          title: '做产品，\n也做研究。',
          description:
            '我是 Snake Konginchrist，和 SK Studio 一起做移动产品与 AI 工具，也在研究分布式优化。\n这里是工作之外的个人记录。',
          linkLabel: '看正在做的产品',
          href: '/projects',
        },
        {
          blockType: 'statement',
          eyebrow: 'WHAT I AM WORKING ON',
          title: '把复杂的东西，做成有人愿意用的东西。',
          description:
            '公开方向包括移动端产品、AI 与 agent 工具、研究型实验，也会给角色和故事留一块空间。',
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
        description: '独立开发者 Snake Konginchrist 的产品、研究与个人记录。',
        accent: 'blue',
        navigation: [
          { label: '首页', href: '/' },
          { label: '项目', href: '/projects' },
          { label: '创作', href: '/creations' },
          { label: '手记', href: '/journal' },
          { label: '关于', href: '/about' },
        ],
        socials: [
          { label: 'GitHub', href: 'https://github.com/Snake-Konginchrist' },
          { label: 'X / @SnakeKongin', href: 'https://x.com/SnakeKongin' },
        ],
      },
    });
  }
  console.info('初始化完成。请访问 /admin 创建你自己的管理员帐号。');
} finally {
  await payload.destroy();
}
// 所有数据库写入和连接清理已等待完成，结束一次性 CLI，避免框架定时器保持进程。
process.exit(0);

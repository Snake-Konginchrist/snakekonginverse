/** 公开资料只保存已确认的项目、账号和交流入口，避免首页出现臆测信息。 */
export type DirectoryItem = {
  key?: string;
  translationNamespace?: 'socials';
  title: string;
  description: string;
  meta: string;
  href: string;
};

export type DirectorySection = {
  key?: string;
  eyebrow: string;
  title: string;
  description?: string;
  items: DirectoryItem[];
};

export const profileLinks: DirectorySection[] = [
  {
    key: 'products',
    eyebrow: 'MY PRODUCTS',
    title: '正在做的产品',
    description: '把公开资料里已经确认的产品放在这里，项目详情仍由 CMS 管理。',
    items: [
      {
        key: 'flagsay',
        title: 'Flagsay（彩旗说）',
        description: '通过照片、故事和身边的事物学习语言的 AI 应用。',
        meta: 'flagsay.com',
        href: 'https://flagsay.com',
      },
      {
        key: 'era',
        title: 'Era Workshop（纪元工坊）',
        description: '自定义纪元和日期命名的 App。',
        meta: 'App Store',
        href: 'https://apps.apple.com/app/id6749497816',
      },
      {
        key: 'gourmet',
        title: 'GourmetLens（美食透镜）',
        description: '记录吃过的菜和去过的餐厅，建立自己的食物记忆。',
        meta: 'App Store',
        href: 'https://apps.apple.com/app/id6749497628',
      },
      {
        key: 'medtrace',
        title: 'MedTrace（医迹）',
        description: '离线优先的个人健康时间线。',
        meta: 'medtrace.skstudio.cn',
        href: 'https://medtrace.skstudio.cn',
      },
      {
        key: 'scholar',
        title: 'SK Scholar（彩旗学术）',
        description: '面向文献综述、论文阅读和写作的 AI 研究助手。',
        meta: 'scholar.skstudio.cn',
        href: 'https://scholar.skstudio.cn',
      },
    ],
  },
  {
    key: 'publicWork',
    eyebrow: 'PUBLIC WORK',
    title: '代码与公开资料',
    description: '项目源码、实验和研究记录统一从 GitHub 进入。',
    items: [
      {
        key: 'github',
        title: 'Snake-Konginchrist / GitHub',
        description: '开源项目、AI 工具、移动产品实验和研究代码。',
        meta: 'github.com/Snake-Konginchrist',
        href: 'https://github.com/Snake-Konginchrist',
      },
    ],
  },
];

export const profileCommunities: DirectorySection[] = [
  {
    key: 'collaboration',
    eyebrow: 'COLLABORATION',
    title: '社群与协作',
    description: '目前公开的交流方式以项目协作和社交平台为主，不虚构不存在的群组。',
    items: [
      {
        key: 'studio',
        title: 'SK Studio',
        description: '与联合创始人一起做移动产品、AI 工具和研究型项目。',
        meta: 'PRODUCT STUDIO',
        href: 'https://github.com/Snake-Konginchrist',
      },
      {
        key: 'openSource',
        title: '开源项目协作',
        description: '通过公开仓库的 issue、讨论和贡献参与项目。',
        meta: 'GITHUB',
        href: 'https://github.com/Snake-Konginchrist',
      },
      {
        key: 'ai',
        title: 'AI 与独立开发交流',
        description: '在 X 分享 AI 工具、Codex 体验和独立开发过程。',
        meta: 'X / @SnakeKongin',
        href: 'https://x.com/SnakeKongin',
      },
    ],
  },
];

export const profileRecommendations: DirectorySection[] = [
  {
    key: 'tools',
    eyebrow: 'TOOLS & REFERENCES',
    title: '这个站点使用的公开工具',
    description: '先记录实际使用或直接相关的公开资料，之后再按真实体验补充推荐。',
    items: [
      {
        key: 'next',
        title: 'Next.js Documentation',
        description: '前台应用使用的 Web 框架与路由、渲染文档。',
        meta: 'nextjs.org/docs',
        href: 'https://nextjs.org/docs',
      },
      {
        key: 'payload',
        title: 'Payload CMS Documentation',
        description: '页面、文章、草稿预览和媒体管理使用的 CMS 文档。',
        meta: 'payloadcms.com/docs',
        href: 'https://payloadcms.com/docs',
      },
      {
        key: 'postgres',
        title: 'PostgreSQL Documentation',
        description: '站点内容和配置使用的关系数据库文档。',
        meta: 'postgresql.org/docs',
        href: 'https://www.postgresql.org/docs/',
      },
    ],
  },
];

export const profileIdentities: DirectorySection[] = [
  {
    key: 'names',
    eyebrow: 'IDENTITIES',
    title: '我使用的名字',
    description: '不同平台使用同一组公开身份，方便找到真正的主页。',
    items: [
      {
        key: 'author',
        title: 'Snake Konginchrist',
        description: '个人品牌和公开署名。',
        meta: 'AUTHOR',
        href: '/',
      },
      {
        key: 'site',
        title: 'SnakeKonginVerse',
        description: '这个个人网站的品牌名称。',
        meta: 'PERSONAL SITE',
        href: '/',
      },
      {
        key: 'github',
        title: 'Snake-Konginchrist',
        description: 'GitHub 账号。',
        meta: 'GITHUB',
        href: 'https://github.com/Snake-Konginchrist',
      },
      {
        key: 'x',
        title: '@SnakeKongin',
        description: 'X 账号，分享开发、AI 工具和日常观察。',
        meta: 'X / TWITTER',
        href: 'https://x.com/SnakeKongin',
      },
    ],
  },
];

export const profileSocials: DirectoryItem[] = [
  {
    key: 'email',
    translationNamespace: 'socials',
    title: 'Email',
    description: '合作、项目和其他正式联系。',
    meta: 'developer@skstudio.cn',
    href: 'mailto:developer@skstudio.cn',
  },
  {
    key: 'github',
    translationNamespace: 'socials',
    title: 'GitHub',
    description: '源码、项目和研究实验。',
    meta: 'github.com/Snake-Konginchrist',
    href: 'https://github.com/Snake-Konginchrist',
  },
  {
    key: 'x',
    translationNamespace: 'socials',
    title: 'X / @SnakeKongin',
    description: '开发过程、AI 工具和公开讨论。',
    meta: 'x.com/SnakeKongin',
    href: 'https://x.com/SnakeKongin',
  },
];

export const profileChangelog: DirectoryItem[] = [
  {
    key: 'v020',
    title: '0.2.0',
    description: '首页收敛为个人主页，补齐单域名目录、社交入口和公开资料页面。',
    meta: '2026-09-24',
    href: '/about',
  },
  {
    key: 'v010',
    title: '0.1.0',
    description: '初始化 Next.js、Payload CMS、内容栏目、草稿预览和原生部署结构。',
    meta: '2026-09-22',
    href: '/journal',
  },
];

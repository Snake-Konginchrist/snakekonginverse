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
    title: 'X (Twitter)',
    description: '开发过程、AI 工具和公开讨论。',
    meta: 'x.com/SnakeKongin',
    href: 'https://x.com/SnakeKongin',
  },
  {
    key: 'xiaohongshu',
    translationNamespace: 'socials',
    title: '小红书',
    description: '公开主页与视觉记录。',
    meta: 'XIAOHONGSHU',
    href: 'https://www.xiaohongshu.com/user/profile/6007fc8a000000000101e9af',
  },
  {
    key: 'bilibili',
    translationNamespace: 'socials',
    title: '哔哩哔哩',
    description: '视频与项目更新。',
    meta: 'BILIBILI',
    href: 'https://space.bilibili.com/3461571323889732',
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

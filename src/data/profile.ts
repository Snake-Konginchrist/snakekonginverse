/** 公开资料只保存已确认的项目、账号和交流入口，避免首页出现臆测信息。 */
export type DirectoryItem = {
  key: string;
  href: string;
};

export const profileProducts: DirectoryItem[] = [
  { key: 'flagsay', href: 'https://flagsay.com' },
  { key: 'era', href: 'https://eraworkshop.com' },
  { key: 'gourmet', href: 'https://gourmetlens.cn' },
  { key: 'mosaic', href: 'https://rectmosaic.skstudio.cn' },
  { key: 'medtrace', href: 'https://medtrace.skstudio.cn' },
  { key: 'scholar', href: 'https://scholar.skstudio.cn' },
];

export const profileSocials: DirectoryItem[] = [
  {
    key: 'email',
    href: 'mailto:developer@skstudio.cn',
  },
  {
    key: 'github',
    href: 'https://github.com/Snake-Konginchrist',
  },
  {
    key: 'x',
    href: 'https://x.com/SnakeKongin',
  },
  {
    key: 'xiaohongshu',
    href: 'https://www.xiaohongshu.com/user/profile/6007fc8a000000000101e9af',
  },
  {
    key: 'bilibili',
    href: 'https://space.bilibili.com/3461571323889732',
  },
];

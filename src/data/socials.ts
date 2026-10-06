import { Mail } from 'lucide-react';
import { FaLinkedinIn, FaQq } from 'react-icons/fa6';
import {
  SiBilibili,
  SiBluesky,
  SiDiscord,
  SiDevdotto,
  SiDouban,
  SiFacebook,
  SiGitee,
  SiGithub,
  SiInstagram,
  SiKakaotalk,
  SiLine,
  SiMastodon,
  SiMedium,
  SiNiconico,
  SiPinterest,
  SiReddit,
  SiSinaweibo,
  SiSnapchat,
  SiSteam,
  SiSubstack,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiTwitch,
  SiWechat,
  SiX,
  SiXiaohongshu,
  SiYoutube,
  SiZhihu,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

export type SocialPlatform = {
  key: string;
  icon: IconType;
  href?: string;
};

const mailIcon = Mail as IconType;

/** 账号不确定时只展示品牌入口和待配置状态，避免猜测或生成错误个人链接。 */
export const socialPlatforms: SocialPlatform[] = [
  { key: 'email', icon: mailIcon, href: 'mailto:developer@skstudio.cn' },
  { key: 'github', icon: SiGithub, href: 'https://github.com/Snake-Konginchrist' },
  { key: 'x', icon: SiX, href: 'https://x.com/SnakeKongin' },
  {
    key: 'xiaohongshu',
    icon: SiXiaohongshu,
    href: 'https://www.xiaohongshu.com/user/profile/6007fc8a000000000101e9af',
  },
  { key: 'bilibili', icon: SiBilibili, href: 'https://space.bilibili.com/3461571323889732' },
  { key: 'weibo', icon: SiSinaweibo },
  { key: 'zhihu', icon: SiZhihu },
  { key: 'douban', icon: SiDouban },
  { key: 'wechat', icon: SiWechat },
  { key: 'qq', icon: FaQq },
  { key: 'youtube', icon: SiYoutube },
  { key: 'instagram', icon: SiInstagram },
  { key: 'facebook', icon: SiFacebook },
  { key: 'tiktok', icon: SiTiktok },
  { key: 'linkedin', icon: FaLinkedinIn },
  { key: 'reddit', icon: SiReddit },
  { key: 'discord', icon: SiDiscord },
  { key: 'telegram', icon: SiTelegram },
  { key: 'threads', icon: SiThreads },
  { key: 'bluesky', icon: SiBluesky },
  { key: 'mastodon', icon: SiMastodon },
  { key: 'twitch', icon: SiTwitch },
  { key: 'steam', icon: SiSteam },
  { key: 'gitee', icon: SiGitee },
  { key: 'medium', icon: SiMedium },
  { key: 'devto', icon: SiDevdotto },
  { key: 'substack', icon: SiSubstack },
  { key: 'line', icon: SiLine },
  { key: 'kakaotalk', icon: SiKakaotalk },
  { key: 'niconico', icon: SiNiconico },
  { key: 'snapchat', icon: SiSnapchat },
  { key: 'pinterest', icon: SiPinterest },
];

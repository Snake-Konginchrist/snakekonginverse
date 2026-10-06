import { Mail } from 'lucide-react';
import audienceConfig from '@/config/social-audience.json';
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
  account?: string;
};

const mailIcon = Mail as IconType;

/** 账号不确定时只展示品牌入口和待配置状态，避免猜测或生成错误个人链接。 */
const platforms: SocialPlatform[] = [
  {
    key: 'email',
    icon: mailIcon,
    href: 'mailto:developer@skstudio.cn',
    account: 'developer@skstudio.cn',
  },
  {
    key: 'xiaohongshu',
    icon: SiXiaohongshu,
    href: 'https://www.xiaohongshu.com/user/profile/6007fc8a000000000101e9af',
    account: '@第三新斯黄',
  },
  {
    key: 'bilibili',
    icon: SiBilibili,
    href: 'https://space.bilibili.com/3461571323889732',
    account: '@彩旗工作室',
  },
  { key: 'weibo', icon: SiSinaweibo },
  { key: 'zhihu', icon: SiZhihu },
  { key: 'douban', icon: SiDouban },
  { key: 'wechat', icon: SiWechat, account: 'Snake-Konginchrist' },
  { key: 'qq', icon: FaQq, account: '592413692' },
  { key: 'gitee', icon: SiGitee },
  {
    key: 'github',
    icon: SiGithub,
    href: 'https://github.com/Snake-Konginchrist',
    account: '@Snake-Konginchrist',
  },
  { key: 'x', icon: SiX, href: 'https://x.com/SnakeKongin', account: '@SnakeKongin' },
  {
    key: 'youtube',
    icon: SiYoutube,
    href: 'https://www.youtube.com/@SnakeKongin',
    account: '@SnakeKongin',
  },
  {
    key: 'instagram',
    icon: SiInstagram,
    href: 'https://www.instagram.com/snakekongin/',
    account: '@snakekongin',
  },
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
  { key: 'medium', icon: SiMedium },
  { key: 'devto', icon: SiDevdotto },
  { key: 'substack', icon: SiSubstack },
  { key: 'line', icon: SiLine },
  { key: 'kakaotalk', icon: SiKakaotalk },
  { key: 'niconico', icon: SiNiconico },
  { key: 'snapchat', icon: SiSnapchat },
  { key: 'pinterest', icon: SiPinterest },
];

const audienceByKey = new Map(audienceConfig.platforms.map((item) => [item.key, item]));

/** 邮箱置顶，国内优先；组内按公开用户规模排序，口径和日期详见 JSON；未核实人数者排在组末。 */
export const socialPlatforms = platforms.toSorted((a, b) => {
  if (a.key === 'email') return -1;
  if (b.key === 'email') return 1;
  const left = audienceByKey.get(a.key);
  const right = audienceByKey.get(b.key);
  if (!left || !right) throw new Error('Missing social audience configuration');
  if (left.group !== right.group) return left.group === 'china' ? -1 : 1;
  if (left.userCount === null) return right.userCount === null ? 0 : 1;
  if (right.userCount === null) return -1;
  return right.userCount - left.userCount;
});

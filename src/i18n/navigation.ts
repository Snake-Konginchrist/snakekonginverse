import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/** 统一生成带语言前缀的站内链接，避免组件手写 /en 或 /ja。 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

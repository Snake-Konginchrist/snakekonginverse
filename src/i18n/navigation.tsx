import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/** 公开 URL 不显示语言，next-intl 通过请求上下文保持当前语言。 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/** 统一生成带语言上下文的站内链接，公开 URL 由 proxy 规范为语言后缀。 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

import NextLink from 'next/link';
import { localizedPath, routing, type Locale } from './routing';
import type { ComponentProps } from 'react';

type LocalizedLinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: string;
  locale?: Locale;
};

/** 公开 URL 使用语言后缀，避免 next-intl 默认生成 /zh-CN/path 前缀。 */
export function Link({ href, locale = routing.defaultLocale, ...props }: LocalizedLinkProps) {
  return <NextLink href={localizedPath(href, locale)} {...props} />;
}

export { redirect, usePathname, useRouter, getPathname } from 'next-intl/navigation';

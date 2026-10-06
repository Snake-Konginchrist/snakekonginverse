import { NextResponse, type NextRequest as NextRequestType } from 'next/server';
import { hasLocale, locales, routing } from './i18n/routing';
import { detectLocale } from './i18n/detect-locale';

/** 公开 URL 不显示语言；内部根据用户选择重写到 [locale] 路由，后台/API/静态资源保持原路径。 */
export default function proxy(request: NextRequestType) {
  if (request.headers.get('X-SK-INTERNAL-LOCALE') === '1') return NextResponse.next();
  const { pathname } = request.nextUrl;
  const localeSuffix = new RegExp(`^(.*)/(${locales.join('|')})$`).exec(pathname);
  if (localeSuffix) {
    const [, basePath, _locale] = localeSuffix;
    const canonical = request.nextUrl.clone();
    canonical.pathname = basePath || '/';
    return NextResponse.redirect(canonical);
  }

  const localePrefix = new RegExp(`^/(${locales.join('|')})(/.*)?$`).exec(pathname);
  if (localePrefix) {
    const [, _locale, basePath = '/'] = localePrefix;
    if (basePath === '/') return NextResponse.next();
    const canonical = request.nextUrl.clone();
    canonical.pathname = basePath;
    return NextResponse.redirect(canonical);
  }

  const selectedLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const locale =
    selectedLocale && hasLocale(selectedLocale)
      ? selectedLocale
      : detectLocale(request.headers.get('accept-language'), routing.defaultLocale);
  const internal = new URL(request.url);
  internal.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  const headers = new Headers(request.headers);
  headers.set('X-NEXT-INTL-LOCALE', locale);
  headers.set('X-SK-INTERNAL-LOCALE', '1');
  return NextResponse.rewrite(internal, { request: { headers } });
}

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};

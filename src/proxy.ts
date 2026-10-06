import { NextResponse, type NextRequest as NextRequestType } from 'next/server';
import { locales, localizedPath, routing } from './i18n/routing';

/** 公开 URL 使用语言后缀；内部仍重写到 [locale] 路由，后台/API/静态资源保持原路径。 */
export default function proxy(request: NextRequestType) {
  if (request.headers.get('X-SK-INTERNAL-LOCALE') === '1') return NextResponse.next();
  const { pathname } = request.nextUrl;
  const localeSuffix = new RegExp(`^(.*)/(${locales.join('|')})$`).exec(pathname);
  if (localeSuffix) {
    const [, basePath, locale] = localeSuffix;
    if (!basePath) {
      const headers = new Headers(request.headers);
      headers.set('X-NEXT-INTL-LOCALE', locale);
      headers.set('X-SK-INTERNAL-LOCALE', '1');
      return NextResponse.next({ request: { headers } });
    }
    const internal = request.nextUrl.clone();
    internal.pathname = `/${locale}${basePath}`;
    // Keep the rewrite on the public request origin. Behind Nginx, Next can
    // otherwise derive `localhost:3000` from the upstream Host header and
    // treat the rewritten destination as an external URL in production.
    const publicHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    if (publicHost) internal.host = publicHost;
    const forwardedProto = request.headers.get('x-forwarded-proto');
    if (forwardedProto) internal.protocol = `${forwardedProto}:`;
    const headers = new Headers(request.headers);
    headers.set('X-NEXT-INTL-LOCALE', locale);
    headers.set('X-SK-INTERNAL-LOCALE', '1');
    return NextResponse.rewrite(internal, { request: { headers } });
  }

  const localePrefix = new RegExp(`^/(${locales.join('|')})(/.*)?$`).exec(pathname);
  if (localePrefix) {
    const [, locale, basePath = '/'] = localePrefix;
    if (basePath === '/') return NextResponse.next();
    const canonical = request.nextUrl.clone();
    canonical.pathname = localizedPath(basePath, locale as typeof routing.defaultLocale);
    return NextResponse.redirect(canonical);
  }

  const canonical = request.nextUrl.clone();
  canonical.pathname = localizedPath(pathname, routing.defaultLocale);
  return NextResponse.redirect(canonical);
}

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};

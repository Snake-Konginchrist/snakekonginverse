import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/** 统一处理语言协商、语言前缀和语言 Cookie；后台/API/静态资源保持原路径。 */
export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};

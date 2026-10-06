import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from './routing';

/** 请求级加载词典；只将当前语言的 JSON 交给服务器组件。 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  if (!requested || !hasLocale(requested)) throw new Error('Request locale is missing or unsupported');
  const locale = requested;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return {
    locale,
    messages,
  };
});

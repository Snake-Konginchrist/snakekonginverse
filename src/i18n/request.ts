import { getRequestConfig } from 'next-intl/server';
import defaultMessages from '../../messages/zh-CN.json';
import englishMessages from '../../messages/en.json';
import { hasLocale, routing } from './routing';

function mergeMessages(base: Record<string, unknown>, override: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key];
    result[key] =
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
        ? mergeMessages(baseValue as Record<string, unknown>, value as Record<string, unknown>)
        : value;
  }
  return result;
}

/** 请求级加载词典；只将当前语言的 JSON 交给服务器组件。 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && hasLocale(requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const fallbackMessages = locale === 'ja' ? englishMessages : defaultMessages;
  return {
    locale,
    messages: mergeMessages(fallbackMessages, messages),
  };
});

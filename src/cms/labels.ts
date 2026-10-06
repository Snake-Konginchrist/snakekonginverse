import labels from '@/config/cms-labels.json';

/** CMS 界面语言与内容语言独立，字段标签随管理员的界面语言变化。 */
export function cmsLabel(key: keyof typeof labels) {
  return labels[key];
}

export type ValidationContext = { req?: { i18n?: { language?: string } } };

export function cmsError(key: keyof typeof labels, options?: ValidationContext) {
  const language = options?.req?.i18n?.language ?? 'zh';
  const translations = labels[key];
  if (!(language in translations)) throw new Error(`Unsupported CMS language: ${language}`);
  return translations[language as keyof typeof translations];
}

import { getLocale, getTranslations } from 'next-intl/server';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';

export function countNovelWords(markdown: string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const text = toString(tree, { includeImageAlt: false, includeHtml: false });
  return Array.from(text.replace(/\s/gu, '')).length;
}

export async function WordCount({ markdown }: { markdown: string }) {
  const locale = await getLocale();
  const t = await getTranslations('novels');
  return (
    <span className="novel-word-count">
      {t('wordCount', { count: new Intl.NumberFormat(locale).format(countNovelWords(markdown)) })}
    </span>
  );
}

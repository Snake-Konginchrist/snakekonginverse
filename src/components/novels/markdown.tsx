import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export function NovelMarkdown({ text }: { text: string }) {
  return (
    <div className="novel-prose">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { trust: false, strict: 'warn' }]]}
        skipHtml
      >
        {text}
      </Markdown>
    </div>
  );
}

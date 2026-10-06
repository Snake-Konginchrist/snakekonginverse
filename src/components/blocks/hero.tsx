import { ArrowUpRight } from 'lucide-react';
import type { Page } from '@/payload-types';
import { Link } from '@/i18n/navigation';
import { SectionHero } from '../section-hero';

type HeroData = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>;

/** CMS 标题、简介和按钮仍由编辑器管理；页面头图统一使用现有角色。 */
export function Hero({ block, title = block.title }: { block: HeroData; title?: string }) {
  return (
    <>
      <SectionHero
        section="about"
        title={title}
        eyebrow={block.eyebrow}
        description={block.description}
      />
      <section className="mx-auto flex w-[min(1200px,calc(100%_-_96px))] flex-wrap items-center justify-between gap-6 border-b border-[var(--line)] py-8 max-[760px]:w-[calc(100%_-_40px)]">
        {title !== block.title && <h2 className="text-2xl font-semibold">{block.title}</h2>}
        <Link
          href={block.href}
          className="inline-flex items-center gap-3 rounded-md border border-[var(--line)] px-5 py-3 text-sm text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
        >
          {block.linkLabel}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}

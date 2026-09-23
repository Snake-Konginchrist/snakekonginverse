import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Page } from '@/payload-types';
import { Link } from '@/i18n/navigation';
import { OrbitArt } from '../orbit-art';

type HeroData = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>;
/** 标题换行由 CMS 控制，视觉组件不硬编码用户身份和宣传文案。 */
export function Hero({ block, compact = false }: { block: HeroData; compact?: boolean }) {
  const t = useTranslations('hero');
  return (
    <section className={compact ? 'hero shell home-hero' : 'hero shell'}>
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" />
          {block.eyebrow}
        </p>
        <h1>
          {block.title.split('\n').map((line, index) => (
            <span key={index}>{line}</span>
          ))}
        </h1>
        <p className="hero-description">{block.description}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href={block.href}>
            {block.linkLabel}
            <ArrowUpRight size={18} />
          </Link>
          <Link href="/about" className="text-link">
            {t('about')} <span>↗</span>
          </Link>
        </div>
        {!compact && (
          <p className="hero-footnote">
            <ArrowDown size={14} /> {t('footnote')}
          </p>
        )}
      </div>
      <OrbitArt />
    </section>
  );
}

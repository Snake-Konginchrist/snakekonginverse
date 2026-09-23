import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

// 入口文案描述栏目用途，不冒充已经发布的作品或文章。
const portals = [
  {
    href: '/projects',
    title: '产品与实验',
    english: 'PRODUCTS & RESEARCH',
    description: '移动产品、AI 工具和研究项目。',
    style: 'code',
    art: '{ idea → real }',
    tag: 'PROJECTS',
  },
  {
    href: '/creations',
    title: '角色与故事',
    english: 'CHARACTERS & STORIES',
    description: '同人、角色，以及仍在生长的想象。',
    style: 'story',
    art: '另一个世界',
    tag: 'CREATIONS',
  },
  {
    href: '/journal',
    title: '记录与思考',
    english: 'NOTES & OBSERVATIONS',
    description: '开发过程、工具观察和日常想法。',
    style: 'journal',
    art: 'Note to self.',
    tag: 'JOURNAL',
  },
];

export function Portals({
  title,
  description,
  compact = false,
}: {
  title: string;
  description?: string | null;
  compact?: boolean;
}) {
  const t = useTranslations('portals');
  const localizedPortals = portals.map((item) => ({
    ...item,
    title: t(item.style === 'code' ? 'products' : item.style === 'story' ? 'creations' : 'journal'),
    english: t(
      item.style === 'code'
        ? 'productsEnglish'
        : item.style === 'story'
          ? 'creationsEnglish'
          : 'journalEnglish',
    ),
    description: t(
      item.style === 'code'
        ? 'productsDescription'
        : item.style === 'story'
          ? 'creationsDescription'
          : 'journalDescription',
    ),
    art: t(
      item.style === 'code'
        ? 'productsArt'
        : item.style === 'story'
          ? 'creationsArt'
          : 'journalArt',
    ),
  }));
  if (compact) {
    return (
      <section id="explore" className="home-explore shell">
        <div className="home-explore-intro">
          <p className="eyebrow">EXPLORE</p>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <nav className="home-quick-links" aria-label={t('aria')}>
          {localizedPortals.map((item, index) => (
            <Link key={item.href} href={item.href} className="home-quick-link">
              <span className="home-quick-link-index">0{index + 1}</span>
              <span className="home-quick-link-copy">
                <span className="home-quick-link-title">{item.title}</span>
                <span className="home-quick-link-tag">{item.tag}</span>
              </span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
    );
  }

  return (
    <section id="explore" className="section shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A FEW WAYS IN</p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>
      <div className="portal-grid">
        {localizedPortals.map((item) => (
          <Link key={item.href} href={item.href} className={`portal-card ${item.style}`}>
            <div className="portal-art" aria-hidden="true">
              <span className="portal-tag">{item.tag}</span>
              <span className="portal-art-title">{item.art}</span>
              <span className="portal-art-symbol">
                {item.style === 'story' ? '✧' : item.style === 'journal' ? '↗' : '⌘'}
              </span>
            </div>
            <div className="portal-body">
              <p className="eyebrow">{item.english}</p>
              <h3>
                {item.title}
                <ArrowUpRight size={22} />
              </h3>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

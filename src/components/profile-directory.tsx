import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { DirectoryItem, DirectorySection } from '@/data/profile';
import { Link } from '@/i18n/navigation';

type ProfileDirectoryProps = {
  namespace?: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: DirectorySection[];
};

function DirectoryLink({ item }: { item: DirectoryItem }) {
  const content = (
    <>
      <span className="directory-item-copy">
        <strong>{item.title}</strong>
        <span>{item.description}</span>
        <small>{item.meta}</small>
      </span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </>
  );

  if (item.href.startsWith('/')) {
    return (
      <Link className="directory-item" href={item.href}>
        {content}
      </Link>
    );
  }
  const isExternal = item.href.startsWith('http');
  return (
    <a
      className="directory-item"
      href={item.href}
      {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {content}
    </a>
  );
}

/** 单域名目录页的通用展示层，数据由页面级常量提供，避免复制布局。 */
export function ProfileDirectory({
  namespace,
  eyebrow,
  title,
  description,
  sections,
}: ProfileDirectoryProps) {
  const pageT = useTranslations(namespace ?? 'common');
  const socialT = useTranslations('socials');
  const text = (path: string, fallback: string, source: 'page' | 'socials' = 'page') => {
    if (!path) return fallback;
    return source === 'socials' ? socialT(path) : pageT(path);
  };
  return (
    <div className="directory-page shell section">
      <header className="directory-heading">
        <p className="eyebrow">{namespace ? pageT('eyebrow') : eyebrow}</p>
        <h1>{namespace ? pageT('title') : title}</h1>
        <p>{namespace ? pageT('description') : description}</p>
      </header>
      <div className="directory-sections">
        {sections.map((section) => (
          <section className="directory-section" key={section.title}>
            <div className="directory-section-heading">
              <div>
                <p className="eyebrow">
                  {section.key ? pageT(`${section.key}.eyebrow`) : section.eyebrow}
                </p>
                <h2>{section.key ? pageT(`${section.key}.title`) : section.title}</h2>
              </div>
              {section.description && (
                <p>{section.key ? pageT(`${section.key}.description`) : section.description}</p>
              )}
            </div>
            <div className="directory-list">
              {section.items.map((item) => {
                const source = item.translationNamespace ?? 'page';
                const prefix =
                  item.translationNamespace === 'socials'
                    ? (item.key ?? '')
                    : section.key && item.key
                      ? `${section.key}.${item.key}`
                      : '';
                const translatedItem = item.key
                  ? {
                      ...item,
                      title: text(`${prefix}.title`, item.title, source),
                      description: text(`${prefix}.description`, item.description, source),
                      meta: text(`${prefix}.meta`, item.meta, source),
                    }
                  : item;
                return (
                  <DirectoryLink item={translatedItem} key={`${section.title}-${item.title}`} />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

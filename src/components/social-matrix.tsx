import { useTranslations } from 'next-intl';
import { socialPlatforms } from '@/data/socials';

/** 用品牌图标展示完整社交矩阵；未提供账号的入口保留为可配置占位。 */
export function SocialMatrix() {
  const t = useTranslations('socials');
  const pageT = useTranslations('socialMatrix');
  return (
    <section className="social-matrix shell section" aria-labelledby="social-matrix-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{pageT('eyebrow')}</p>
          <h2 id="social-matrix-title">{pageT('title')}</h2>
        </div>
        <p>{pageT('description')}</p>
      </div>
      <div className="social-matrix-grid">
        {socialPlatforms.map(({ key, icon: Icon, href }) => {
          const content = (
            <>
              <Icon aria-hidden="true" size={22} />
              <span>{t(`${key}.title`)}</span>
              <small>{href ? t('configured') : t('pending')}</small>
            </>
          );
          return href ? (
            <a className="social-tile" key={key} href={href} target="_blank" rel="noreferrer">
              {content}
            </a>
          ) : (
            <span className="social-tile is-pending" key={key} aria-disabled="true">
              {content}
            </span>
          );
        })}
      </div>
    </section>
  );
}

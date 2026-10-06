import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function IdealHome() {
  const t = useTranslations('ideal');
  const cards = [
    {
      key: 'practice',
      description: 'practiceDescription',
      href: '/projects',
      image: 'practice',
      english: 'PRODUCTS',
    },
    {
      key: 'creations',
      description: 'creationDescription',
      href: '/creations',
      image: 'creations',
      english: 'CREATIONS',
    },
    {
      key: 'journal',
      description: 'journalDescription',
      href: '/journal',
      image: 'journal',
      english: 'JOURNAL',
    },
  ];
  return (
    <div className="ideal-home">
      <section className="ideal-hero">
        <Image className="ideal-landscape" src="/art/hero.png" alt="" fill priority sizes="100vw" />
        <div className="shell ideal-copy">
          <p className="ideal-motto">{t('eyebrow')}</p>
          <h1>
            {t('title')}
            <span>{t('accent')}</span>
          </h1>
          <p className="ideal-intro">{t('description')}</p>
          <div className="ideal-actions">
            <Link className="button button-primary" href="/projects">
              {t('primary')}
              <ArrowRight size={22} />
            </Link>
            <Link className="button ideal-secondary" href="/about">
              {t('secondary')}
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell ideal-portals" aria-label={t('primary')}>
        {cards.map((card) => (
          <Link href={card.href} className="ideal-card" key={card.key}>
            <div className="ideal-card-image">
              <Image
                src={`/art/${card.image}.png`}
                alt=""
                fill
                sizes="(max-width: 700px) 90vw, 33vw"
              />
            </div>
            <h2>
              {t(card.key)} <small>/ {card.english}</small>
            </h2>
            <p>
              {t(card.description)}
              <ArrowRight size={24} />
            </p>
          </Link>
        ))}
      </section>
      <section className="ideal-principles">
        <div className="shell ideal-principles-inner">
          <h2>{t('principles')}</h2>
          <div>
            {[1, 2, 3].map((n) => (
              <p key={n}>{t(`principle${n}`)}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useTranslations } from 'next-intl';
import { Microscope } from 'lucide-react';

export function ResearchDirection() {
  const t = useTranslations('narrative');
  return (
    <section className="mb-10 grid gap-5 border-y border-[var(--line)] py-8 md:grid-cols-[0.7fr_1.3fr]">
      <div className="flex items-center gap-3 text-[var(--accent)]">
        <Microscope size={24} aria-hidden="true" />
        <h2 className="text-xl font-semibold">{t('researchTitle')}</h2>
      </div>
      <div>
        <h3 className="text-2xl">{t('researchDirection')}</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
          {t('researchDescription')}
        </p>
      </div>
    </section>
  );
}

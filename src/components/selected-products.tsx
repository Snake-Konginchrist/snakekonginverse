import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { profileProducts } from '@/data/profile';

/** 展示已确认的公开产品，不把空的 CMS 列表填成虚构作品。 */
export function SelectedProducts({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('products');
  const copy = useTranslations('narrative');
  const products = profileProducts;
  return (
    <section aria-labelledby="selected-products-title" className="py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="selected-products-title" className="text-3xl font-semibold">
            {copy('selectedTitle')}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
            {copy('selectedDescription')}
          </p>
        </div>
        {compact && (
          <Link href="/projects" className="text-sm text-[var(--accent)]">
            {copy('allProducts')} ↗
          </Link>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((item, index) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--accent)]"
          >
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>0{index + 1}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold group-hover:text-[var(--accent)]">
              {t(`${item.key}.title`)}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {t(`${item.key}.description`)}
            </p>
            <span className="mt-6 block text-xs text-[var(--muted)]">{t(`${item.key}.meta`)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

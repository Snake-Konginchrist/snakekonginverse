import Image from 'next/image';
import heroes from '@/config/section-heroes.json';

export type HeroSection = keyof typeof heroes;

type Props = {
  section: HeroSection;
  title: string;
  description?: string | null;
  eyebrow?: string | null;
  detail?: boolean;
};

/** 头图不包含文字；窄屏完整展示插图，再在图片下方排列可本地化的文案。 */
export function SectionHero({ section, title, description, eyebrow, detail = false }: Props) {
  const hero = heroes[section];
  const light = hero.tone === 'light';
  const left = hero.textSide === 'left';
  return (
    <header className="section-hero relative isolate border-b border-[var(--line)] bg-[var(--paper)]">
      <Image
        className="section-hero-image block h-auto w-full"
        src={hero.image}
        alt=""
        width={2172}
        height={724}
        priority
        sizes="100vw"
      />
      {!detail && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 hidden min-[761px]:block ${
            light
              ? 'bg-[linear-gradient(90deg,transparent_35%,rgba(252,246,231,0.6)_60%,rgba(252,246,231,0.8)_100%)] dark:bg-[linear-gradient(90deg,transparent_30%,rgba(12,12,12,0.76)_55%,rgba(12,12,12,0.85)_100%)]'
              : left
                ? 'bg-[linear-gradient(90deg,rgba(8,13,19,0.85),rgba(8,13,19,0.65)_44%,transparent_70%)]'
                : 'bg-[linear-gradient(90deg,transparent_35%,rgba(12,12,12,0.58)_55%,rgba(12,12,12,0.85)_100%)]'
          }`}
        />
      )}
      <div
        className={`section-hero-copy relative mx-auto w-[min(1200px,calc(100%_-_96px))] py-7 max-[760px]:w-[calc(100%_-_40px)] ${detail ? 'max-w-[850px]' : 'min-[761px]:absolute min-[761px]:inset-x-0 min-[761px]:top-1/2 min-[761px]:-translate-y-1/2 min-[761px]:py-0'}`}
      >
        <div
          className={`section-hero-text text-[var(--ink)] ${detail ? '' : 'min-[761px]:w-[44%]'} ${left || detail ? '' : 'min-[761px]:ml-auto'} ${
            detail
              ? ''
              : light
                ? 'min-[761px]:text-[#201f1b] dark:min-[761px]:text-[#f1eadb]'
                : 'min-[761px]:text-[#fff7e8]'
          }`}
        >
          {eyebrow && (
            <p className="mb-3 text-xs tracking-[0.16em] opacity-90 max-[760px]:text-[var(--muted)]">
              {eyebrow}
            </p>
          )}
          <h1
            className={`wrap-anywhere font-semibold leading-[1.25] ${detail ? 'text-[clamp(28px,3vw,48px)]' : 'text-[clamp(34px,4.5vw,64px)]'}`}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-5 whitespace-pre-line text-[clamp(14px,1.2vw,18px)] leading-[1.9] max-[760px]:text-[var(--muted)]">
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

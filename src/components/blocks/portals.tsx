import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// 入口文案描述栏目用途，不冒充已经发布的作品或文章。
const portals = [
  {
    href: '/projects',
    title: '用代码构建',
    english: 'BUILD WITH CODE',
    description: '从灵感到实现，记录软件、工具与技术实验。',
    style: 'code',
    art: '{ idea → real }',
    tag: 'PROJECTS',
  },
  {
    href: '/creations',
    title: '让热爱生长',
    english: 'CREATE WITH LOVE',
    description: '同人、角色与故事，给想象力留一片自由地带。',
    style: 'story',
    art: '另一个世界',
    tag: 'CREATIONS',
  },
  {
    href: '/journal',
    title: '把思考留下',
    english: 'THINK OUT LOUD',
    description: '写开发的过程，也写偶尔不着边际的想法。',
    style: 'journal',
    art: 'Note to self.',
    tag: 'JOURNAL',
  },
];

export function Portals({ title, description }: { title: string; description?: string | null }) {
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
        {portals.map((item) => (
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

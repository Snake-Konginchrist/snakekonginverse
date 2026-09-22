import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell section archive">
      <p className="eyebrow">404 / OUTSIDE THE ORBIT</p>
      <h1>这片宇宙，还没有坐标。</h1>
      <p className="archive-intro">页面可能尚未发布，或已经换了一个地址。</p>
      <Link className="button button-primary" href="/">
        回到首页 ↗
      </Link>
    </section>
  );
}

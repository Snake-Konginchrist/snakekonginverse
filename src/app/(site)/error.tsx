'use client';

/** 不向访客暴露数据库错误和连接信息；提供明确、可操作的重试入口。 */
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="shell section archive">
      <p className="eyebrow">CONNECTION INTERRUPTED</p>
      <h1>暂时没有连接上。</h1>
      <p className="archive-intro">内容暂时无法读取，请稍后重试。</p>
      <button className="button button-primary" onClick={reset}>
        重新加载
      </button>
    </section>
  );
}

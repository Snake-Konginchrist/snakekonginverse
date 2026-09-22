/** 纯 CSS 轨道图形是品牌视觉，不依赖外部图片、Canvas 或第三方请求。 */
export function OrbitArt() {
  return (
    <div className="orbit-art" aria-hidden="true">
      <div className="orbit-coordinate top">SK / PERSONAL UNIVERSE</div>
      <div className="orbit-grid" />
      <div className="orbit-ring ring-one" />
      <div className="orbit-ring ring-two" />
      <div className="orbit-ring ring-three" />
      <div className="orbit-core">
        <span>sk</span>
        <span className="core-spark">✳</span>
      </div>
      <span className="satellite satellite-one" />
      <span className="satellite satellite-two" />
      <span className="orbit-label label-code">&lt; CODE /&gt;</span>
      <span className="orbit-label label-story">STORIES ✧</span>
      <div className="orbit-coordinate bottom">
        IMAGINATION HAS NO EDGE <span>↗</span>
      </div>
    </div>
  );
}

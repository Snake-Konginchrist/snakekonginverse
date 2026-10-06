import './admin-header.css';

/** 管理后台的固定品牌层，提醒编辑者当前正在维护哪个内容系统。 */
export function AdminHeader() {
  return (
    <div className="sk-admin-header">
      <div className="sk-admin-mark" aria-hidden="true">
        ✳
      </div>
      <div>
        <strong>SnakeKonginverse</strong>
        <span>个人主页内容工作台</span>
      </div>
      <div className="sk-admin-header-note">产品 · AI · 分布式优化 · 创作</div>
    </div>
  );
}

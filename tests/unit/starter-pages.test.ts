import assert from 'node:assert/strict';
import test from 'node:test';
import { isStarterPage, starterPages } from '../../scripts/starter-pages';

test('初始页面在写入 CMS 时提供四语言内容', () => {
  const titles = new Set<string>();
  for (const locale of ['zh-CN', 'zh-TW', 'en', 'ja'] as const) {
    const [home, about] = starterPages(locale);
    const hero = home.layout[0];
    assert.equal(hero.blockType, 'hero');
    if (hero.blockType !== 'hero') throw new Error('首页必须有首屏');
    assert.equal(hero.href, '/projects');
    titles.add(hero.title);
    assert.equal(about.path, '/about');
    assert.equal(about.layout[1].blockType, 'statement');
  }
  assert.equal(titles.size, 4);
});

test('补翻译识别初始化内容，保留用户修改及区块顺序', () => {
  const [starter] = starterPages('zh-CN');
  const saved = structuredClone(starter);
  saved.layout.forEach((block, index) => {
    block.id = `cms-id-${index}`;
  });
  assert.equal(isStarterPage(saved, starter), true);
  if (saved.layout[0].blockType !== 'hero') throw new Error('首页必须有首屏');
  saved.layout[0].title = '我的新标题';
  assert.equal(isStarterPage(saved, starter), false);
  assert.equal(
    isStarterPage({ ...starter, layout: [...starter.layout].reverse() }, starter),
    false,
  );
  assert.equal(isStarterPage({ ...starter, layout: [] }, starter), false);
  assert.equal(isStarterPage({ ...starter, title: '新的页面名称' }, starter), false);
});

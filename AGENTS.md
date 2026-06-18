<!-- Generated: 2026-06-18T08:00:00Z | Parent: ../AGENTS.md -->

# 官网 — 全球供应链大平台主站

## Architecture

```
                     index.html (首页 · 品牌第一印象)
                    /     |      \         \
           solutions  products  why-us    intel        contact    pain-points
          (5场景方案) (5大能力) (竞品对比) (新闻中心·14篇) (联系表单)  (8大痛点)
                         |
              ┌─────────┼─────────┐
              v         v         v
         css/style.css  js/       assets/
         (全局样式67KB)  ├─ i18n.js (244KB 中英字典)
                        ├─ main.js (通用交互)
                        └─ risk-globe.js (3D地球/2D地图)
```

所有页面共享统一的导航栏（navbar）+ 页脚（footer）骨架，通过 `css/style.css` 全局样式 + 各页面内嵌 `<style>` 块实现差异化。`js/i18n.js` 通过 TreeWalker 遍历 DOM 文本节点实现中英文切换。

## Role

纯静态营销网站的完整展示层——7 个核心 HTML 页面 + 14 个新闻详情页 + 全局 CSS/JS 资源 + 数据文件 + 数据库设计文档。无后端、无构建工具、无前端框架。

## Key Abstractions

| Symbol | File | Kind | Description |
|--------|------|------|-------------|
| 导航栏 (navbar) | 所有 HTML | shared-header | 5 个主链接 + 语言切换 + CTA 按钮，响应式汉堡菜单 |
| Hero 首屏 | 所有 HTML | section | 全屏（100vh）首屏，index 用视频背景，其余用 Unsplash 大图 + 暗色叠加 |
| 3D 风险地球 | index.html | component | globe.gl 渲染的交互式3D地球，标记全球供应链风险区域 |
| Leaflet 2D 地图 | intel.html | component | Leaflet 可缩放世界地图，展示港口/航线/风险分布 |
| DICT 翻译字典 | js/i18n.js | object | ~1100+ 条中英对照映射，中文文本作 key，精确匹配 DOM 节点 |
| 新闻数据模型 | news-data.json | data | 14篇文章结构化数据：id/title/catClass/ktItems/tags/blocks |
| 新闻卡片 | intel.html | component | 按4分类分组的新闻卡片网格，data-href 跳转到14个详情页 |
| 五大能力管道 | products.html | component | 水平管道流程可视化（智能撮合→安全合规→可信交付→全局风控→数据智脑） |
| 对比表 | why-us.html | component | 传统模式 vs AI 双边匹配 7 维对比表 |
| 联系表单 | contact.html | component | 姓名/公司/邮箱/电话/角色/挑战 6 字段表单 + 4 个全球办公室 |

## Files

| File | Role | Description |
|------|------|-------------|
| index.html | 首页 | Hero视频+6维危机卡片+轮播+3D地球+CTA，品牌入口 |
| solutions.html | 解决方案 | 5张场景宽卡（全球寻源/尽调/备份/交付/监控），引导到products.html锚点 |
| products.html | 产品功能（4340行） | 五大AI能力深度展示，每能力含独立案例分析区+Mock数据 |
| why-us.html | 价值对比 | 传统vs AI对比表+4个决策场景时间线+6大关键机制 |
| intel.html | 新闻中心 | 14篇新闻卡片按4分类+Leaflet交互式地图 |
| contact.html | 联系转化 | 咨询表单+全球办公室+24h响应承诺，全站CTA落地点 |
| pain-points.html | 痛点共鸣 | 8大痛点交错图文+感知→分析→决策→沉淀解决流程 |
| news-*.html (14个) | 新闻详情 | 每篇含Hero图+5条关键要点+正文+引用+来源+相关推荐 |
| news-data.json | 新闻数据 | 14篇文章结构化JSON，含id/分类/tags/内容块定义 |
| css/style.css | 全局样式 | ~1250行，:root设计令牌+BEM组件+响应式断点 |
| js/i18n.js | 国际化引擎 | ~1917行 (~1849行字典+70行逻辑)，TreeWalker文本匹配翻译 |
| js/main.js | 通用交互 | ~271行IIFE：导航高亮、菜单、滚动动画、轮播、表单反馈 |
| js/risk-globe.js | 风险可视化 | ~227行IIFE：3D地球(globe.gl)+2D地图(Leaflet)+USGS地震实时 |
| find-stale.js | i18n维护 | 检测DICT中未被HTML引用的过期翻译条目 |
| remove-stale.js | i18n维护 | 根据stale-keys.txt安全移除DICT中的过期条目 |
| stale-keys.txt | 维护数据 | 当前快照：DICT 1102条/HTML 856条/过期276条 |
| docs/database-design.md | 数据库设计 | MySQL 8.0 7张表设计文档（用户/联系人/跟进/文章/标签/配置/文件） |
| docs/schema.sql | 建表DDL | 可执行SQL：建库→建表（含DROP IF EXISTS）→外键→索引→种子数据 |

## Subdirectories

| Directory | Description | AGENTS |
|-----------|-------------|--------|
| `css/` | 全局样式系统 | [AGENTS.md](./css/AGENTS.md) |
| `js/` | 交互逻辑 + i18n + 可视化 | [AGENTS.md](./js/AGENTS.md) |
| `docs/` | 数据库设计文档与DDL | [AGENTS.md](./docs/AGENTS.md) |
| `assets/` | 静态资源（图片/视频/图标） | 无源码，跳过 |

## Conventions

- **HTML骨架**: navbar > section.hero > sections > footer，20+页面统一遵循
- **CSS命名**: BEM风格变体，short-dash命名，组件前缀（`.card`, `.btn`, `.section`）
- **CSS组织**: :root令牌 → 注释分隔区块，页面专属样式在HTML内嵌 `<style>` 中
- **JS模式**: 全部IIFE包裹，ES5语法，`window.GSCM_LANG` 为唯一全局变量
- **JS加载顺序**: i18n.js → main.js → globe.gl CDN → risk-globe.js（硬约束）
- **中英双语**: HTML中写中文原文，i18n.js DICT映射英文，`data-i18n` 属性驱动
- **localStorage**: 统一 `gscm_*` 前缀（lang/news_likes/article_views/article_likes）
- **响应式**: 1024px / 768px / 480px 三级断点
- **图标**: 内联SVG（`stroke="currentColor"`），无图标字体/图片图标
- **图片**: Unsplash CDN外链（Hero/卡片配图），品牌资源本地 `assets/`

## Entry Points

- **首页**: `index.html` — 品牌入口 / 域名根
- **解决方案**: `solutions.html` — 从导航栏"解决方案"或首页CTA进入
- **产品功能**: `products.html` — 从导航栏"产品功能"或解决方案页进入
- **价值对比**: `why-us.html` — 从导航栏"为什么选我们"进入
- **新闻中心**: `intel.html` — 从导航栏"供应链新闻台"进入，链接到14篇 `news-*.html`
- **联系我们**: `contact.html` — 全站"申请加入"CTA落地点
- **痛点与方案**: `pain-points.html` — 从Footer"了解更多"进入

## For AI Agents

- **多模态能力回退**: 当前模型不支持图片/视觉等多模态能力时，使用 `visual-primitives` MCP（已配置于 `mcp.json`）。该MCP通过 DashScope API 提供视觉理解（qwen3.6-plus）和 OCR（deepseek-ocr）能力，可用于分析页面截图、识别图片内容、提取图中文字等场景。
- **修改共享模块前跑影响分析**: `grep -rl "要改的class名" 官网/*.html` 确认影响范围
- **导航栏/Footer改动**: 必须在所有核心页面（7个）+ 新闻页面（14个）= 21个HTML文件中同步
- **CSS安全修改**: 先读 `:root` 块了解令牌 → 定位具体注释区块 → 修改后检查所有页面
- **i18n文本同步**: HTML改中文 → 立即更新 `js/i18n.js` DICT映射 → 跑 `node find-stale.js` 检测过期
- **products.html 超大文件** (4340行): 按ID锚点定位 (`#matching`/`#procurement`/`#delivery`/`#risk`/`#brain`/`#ai-engine`)
- **无构建无测试**: 直接浏览器打开HTML验证，检查导航/移动端/锚点/CTA四要素
- **Globe → Leaflet 数据共享**: 修改风险点数据需同时更新两套渲染逻辑

## Dependencies

- **Internal:** `css/style.css`, `js/main.js`, `js/i18n.js`, `js/risk-globe.js`, `assets/`, `news-data.json`
- **External:** `cdn.jsdelivr.net/npm/globe.gl` (3D地球), `unpkg.com/leaflet` (2D地图), `images.unsplash.com` (图片CDN), `earthquake.usgs.gov` (地震数据API)

<!-- MANUAL:START -->
<!-- MANUAL:END -->

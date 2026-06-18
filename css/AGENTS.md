<!-- Generated: 2026-06-18T08:00:00Z -->
<!-- Parent: ../AGENTS.md -->

# css — 全局样式系统

## Role
官网完整的视觉设计系统——约 1250 行纯 CSS，实现 Apple 风格的深色玻璃拟态（glassmorphism）视觉系统。所有页面共享此文件，页面专属样式在各自 HTML 内嵌 `<style>` 块中。

## Key Abstractions
| Symbol | File | Kind | Description |
|--------|------|------|-------------|
| `:root` 自定义属性 | style.css | CSS变量 | ~22个设计令牌：品牌色、阴影、间距、圆角、缓动函数、渐变色 |
| `.navbar` | style.css | component | 固定式深色玻璃导航栏，含霓虹光效和移动端折叠菜单 |
| `.hero` / `.hero-content` | style.css | layout | 全屏（100vh）首屏布局，视频/图片背景 + 暗色叠加层 + 居中内容 |
| `.card` / `.btn` | style.css | component | 核心卡片和按钮组件，含 hover 上浮动效 |
| `.grid-2` / `.grid-3` / `.grid-4` | style.css | utility | 响应式网格布局工具类 |
| `.reveal` / `.in` | style.css | animation | 滚动入场动画：初始透明+下移20px → 渐入+归位 |
| `.gradient-text` | style.css | utility | 品牌渐变文字效果（`-webkit-background-clip: text`） |
| `.section` / `.container` | style.css | layout | 页面区块容器（max-width: 1440px） |
| `.carousel` / `.carousel-slide` | style.css | component | 全宽轮播组件（4张），含 Ken Burns 缩放动效 |
| `footer` 样式 | style.css | component | 四栏网格页脚，深色背景 + 链接样式 |

## Key Files
| File | Role | Description |
|------|------|-------------|
| style.css | 全局样式表 | ~1250行，含设计令牌、布局、导航、Hero、轮播、卡片、对比表、时间轴、流程图、3D地球容器、Leaflet地图样式、新闻卡片、联系表单、CTA、Footer、滚动动画、响应式断点 |

## Conventions
- **命名**: BEM 风格变体，kebab-case，组件前缀化（`.card .icon`、`.carousel-dots button.active`）
- **组织**: `/* ============================================================ */` 分隔大区块
- **颜色**: 品牌蓝 `#0071e3`/`#2563EB`、绿 `#34c759`、橙 `#FF9500`、红 `#FF3B30`、紫 `#5E5CE6`、金 `#C9973A`
- **响应式**: `max-width:1024px` / `768px` 两个断点
- **字体栈**: `"Inter", "SF Pro Display", "PingFang SC", "Microsoft YaHei"`
- **图标**: 内联 SVG 通配样式 `.icon-svg`

## For AI Agents
- **修改前先看 `:root` 块** — 所有品牌色/间距定义在此，不要在组件中硬编码色值
- **定位修改区域** — 用分隔注释 `/* ==== */` 定位具体区块，精准修改
- **全局影响** — 此 CSS 被所有 21 个 HTML 页面引用，任何修改需检查影响范围
- **页面专属样式** — 各 HTML 内嵌 `<style>` 块中是页面专属覆盖，不要合并到 style.css
- **验证断点** — 修改布局后检查 1024px/768px 断点下的表现

## Dependencies
- **Internal:** 无（纯 CSS，无预处理器）
- **External:** 无

<!-- MANUAL:START -->
<!-- MANUAL:END -->

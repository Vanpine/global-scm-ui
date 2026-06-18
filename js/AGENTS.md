<!-- Generated: 2026-06-18T08:00:00Z -->
<!-- Parent: ../AGENTS.md -->

# js — 交互逻辑 + 国际化 + 可视化

## Architecture

```
i18n.js  ──(window.GSCM_LANG)──→  main.js (读取语言状态)
                                →  risk-globe.js (双语标签 + 语言切换监听)

main.js ──(独立，仅依赖 i18n.js)──→  导航高亮、滚动动画、轮播、表单

risk-globe.js ──(依赖 CDN)──→  globe.gl (3D地球) + Leaflet (2D地图)
```

**加载顺序硬约束**: `i18n.js` → `main.js` → `globe.gl CDN` → `risk-globe.js`

## Role
官网的完整前端交互层——国际化引擎、通用交互逻辑、风险地图可视化。三个 JS 文件均为 IIFE 包裹的 ES5 原生脚本，通过 `window.GSCM_LANG` 全局变量进行跨文件通信。

## Key Abstractions
| Symbol | File | Kind | Description |
|--------|------|------|-------------|
| `DICT` | i18n.js | object | ~1100+ 条中英翻译映射，中文文本作 key，精确字符串匹配 |
| `collect()` / `apply()` | i18n.js | function | i18n 核心引擎：TreeWalker 收集DOM文本节点缓存原文 → 语言切换时按DICT替换 |
| `window.GSCM_LANG` | i18n.js | global | 当前语言状态 (`'zh'`/`'en'`)，被所有 JS 文件读取 |
| `highlightNav()` | main.js | function | 根据 URL 路径高亮对应导航链接 |
| `initCarousel()` | main.js | function | 自动轮播（支持多实例），含 Ken Burns 缩放效果 |
| `initForm()` | main.js | function | 联系表单提交反馈（前端模拟，无网络请求） |
| `initGlobe()` | risk-globe.js | function | 初始化 3D 地球（纹理/弧线/光环/标签） |
| `initLeaflet()` | risk-globe.js | function | 初始化 2D 地图（风险标记+脉冲动画+航线） |
| `fetchQuakes()` | risk-globe.js | function | 从 USGS API 拉取实时地震数据，每 60 秒刷新 |

## Key Files
| File | Role | Description |
|------|------|-------------|
| i18n.js | 国际化引擎 | ~1917行（~1849行字典+70行逻辑），TreeWalker遍历+精确文本匹配翻译+localStorage持久化 |
| main.js | 通用交互 | ~271行IIFE，9个初始化函数：导航高亮、移动端菜单、滚动reveal、数字count-up、自动轮播、表单反馈、新闻卡片点击/点赞、文章统计、订阅表单 |
| risk-globe.js | 风险可视化 | ~227行IIFE，10个静态风险点+5条航线弧，USGS实时地震每60s刷新，联动3D地球和2D地图双视图 |

## Conventions
- **全部 IIFE**: `(function(){...})()` 包裹，ES5 语法（`var`/`function`）
- **全局变量**: `window.GSCM_LANG` 是唯一的跨文件通信变量
- **错误处理**: try/catch 包裹 localStorage 操作（防隐私模式崩溃）；USGS 请求 `.catch()` 优雅降级
- **localStorage 前缀**: `gscm_*`（gscm-lang, gscm_news_likes, gscm_article_views, gscm_article_likes）
- **i18n 匹配**: 精确字符串匹配 `DICT[trimmed]`，未命中保持原文字（优雅降级）
- **i18n 局限**: 只翻译初始化时存在的 DOM 文本节点，动态添加的内容需重新调用 `collect()` + `apply()`

## Entry Points
- 所有 HTML 页面在 `</body>` 前按以下顺序加载：
  1. `js/i18n.js` — DOMContentLoaded 时收集文本节点+应用语言
  2. `js/main.js` — DOMContentLoaded 时初始化所有交互
  3. `globe.gl CDN` — 外部库
  4. `js/risk-globe.js` — DOMContentLoaded 时初始化地球/地图

## For AI Agents
- **加载顺序是硬约束** — i18n.js 必须在 main.js 之前（main.js 读取 `window.GSCM_LANG`）
- **添加中英文文本**: HTML中写中文原文，在 i18n.js DICT 中添加 `"原文": "Translation"` 映射
- **i18n 精确匹配要求**: DICT key 必须与 HTML 文本节点完全一致（含标点/空格/emoji），任何差异会导致翻译失败
- **新增 JS 文件**: 必须正确读取 `window.GSCM_LANG` 以支持双语
- **表单提交**: 当前只是前端模拟（按钮禁用+文字变化），接入后端时修改 `initForm()` 和 `initNewsletter()`
- **风险点数据**: 修改 POINTS/quakes 数据需同时更新 Globe 和 Leaflet 两套渲染
- **localStorage 命名**: 遵循 `gscm_*` 前缀约定

## Dependencies
- **Internal:** 无内部 JS 依赖（但按加载顺序依赖）
- **External:** `cdn.jsdelivr.net/npm/globe.gl` (3D地球/Three.js), `unpkg.com/leaflet` (2D地图), `earthquake.usgs.gov` (地震API)

<!-- MANUAL:START -->
<!-- MANUAL:END -->

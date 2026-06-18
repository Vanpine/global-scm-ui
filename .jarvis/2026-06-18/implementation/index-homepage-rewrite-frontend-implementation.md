# 首页改写 — 前端实现文档

## 1. 当前实现目标

将 `index.html` 从品牌介绍型（intro-type）改写为实时市场仪表盘型（function-type），聚焦"全球供需网络正在运转"的实时感。

## 2. 对应需求 ID / 任务 ID

- 需求: homepage transformation — 品牌手册 → 实时市场仪表盘
- 任务: rewrite index.html 全部主体内容

## 3. 输入依据

- 当前 `index.html` 完整源码
- 当前 `css/style.css` 共享设计系统
- 当前 `js/main.js` 交互脚本（导航、滚动入场、数字 count-up）
- 任务描述中的完整 HTML 结构规范

## 4. 变更文件

| 文件 | 变更类型 |
|------|---------|
| `index.html` | 完全重写 |

## 5. 变更范围

### 5.1 保留内容

- DOCTYPE, meta charset, viewport meta
- favicon link (`assets/logo-icon.png`)
- og: meta tags（内容已更新为新的定位描述）
- Organization structured data（JSON-LD，保持原样）
- `css/style.css` 引用
- `js/i18n.js` 和 `js/main.js` 引用
- count-up 动画模式（`data-count` 属性）

### 5.2 删除内容

- Video 背景 Hero（`assets/vedio.mp4`）
- POLYCRISIS 危机卡片（6 张全宽卡片）
- 轮播图区域
- Mission/理念 section
- AI 赋能 3-card section
- 3D 风险地球图（`#globeViz`、globe.gl CDN、risk-globe.js）
- 旧版 navbar（5 项导航）和旧版 footer 结构

### 5.3 新增内容

**6 个页面区块：**

| 序号 | 区块 | 说明 |
|------|------|------|
| 1 | HERO — 动态行情滚动条 | 深色渐变背景，无视频；`home-hero` class；LIVE 标签 + 渐变标题 + 滚动 ticker + 双 CTA 按钮 |
| 2 | HOT ZONES — 供需热区 | 3 张热门需求卡 + 3 张优质资源卡；红色/绿色脉冲圆点；`hz-card--urgent` 紧急标记 |
| 3 | MATCH FEED — 匹配动态 | 5 条供需匹配记录；买方 → 供应商箭头；节省百分比徽章 |
| 4 | RISK BRIEF — 风险快报 | 4 张风险卡片（2 高危 + 2 关注）；红色/橙色标签 |
| 5 | PLATFORM DATA — 平台数据 | 4 个数据指标（今日新增需求、资源池、累计匹配、覆盖国家） |
| 6 | CTA BAND — 行动号召 | 更新文案："准备好加入了吗？" |

**导航栏（新）：**
- 首页、供需大厅、风险情报、新闻台（4 项）
- 移除了"解决方案"、"产品功能"、"为什么选我们"

**Footer（新）：**
- 供需大厅、风险情报、了解更多（3 列）
- 移除了"解决方案"、"平台能力"列

### 5.4 内联样式（`<style>` 块）

新增 CSS 规则：

- `.home-hero` — 深色径向渐变 Hero
- `.ticker-wrap` / `.ticker-track` — 滚动条容器 + flex 行
- `@keyframes tickerSlide` — 向左无限滚动动画
- `.hz-grid` — 3 列响应式网格（1024px → 2 列，768px → 1 列）
- `.hz-card` — 紧凑卡片：左侧彩色边框、标题+元信息+标签
- `.hz-dot.pulse-red` / `.hz-dot.pulse-green` — 脉冲圆点
- `@keyframes hzPulse` — 脉冲动画
- `.match-list` / `.match-item` — 匹配列表项
- `.rb-grid` — 4 列网格（1024px → 2 列，768px → 1 列）
- `.rb-card` — 风险卡片：顶部彩色边框
- `.rb-tag--high` 红色 / `.rb-tag--watch` 橙色

### 5.5 内联 JavaScript（IIFE, ES5）

```javascript
(function() { 'use strict';
  // TICKER_ITEMS (6) → initTicker() → 渲染 + 复制实现无缝循环
  // HOME_DEMANDS (3) / HOME_SUPPLIES (3) → renderHomeCards()
  // MATCHES (5) → renderMatches()
  // 全部在 DOMContentLoaded 时执行
})();
```

## 6. 实现说明

1. **纯静态 HTML/CSS/JS**：无框架、无构建工具
2. **ES5 兼容**：`var`、`function`、`for` 循环，无箭头函数，无模板字面量
3. **Apple-Style 设计**：沿用现有设计系统（`--brand-blue`、`--ease`、圆角按钮、渐变文字等）
4. **BEM 命名**：所有新组件使用 BEM 风格（`.hz-card--urgent`、`.rb-tag--high`）
5. **响应式**：媒体查询 `@media (max-width: 1024px)` 和 `@media (max-width: 768px)`
6. **滚动入场动画**：使用 `.reveal` class，由 `main.js` 的 `IntersectionObserver` 驱动
7. **数字 count-up**：使用 `data-count` / `data-suffix` 属性，由 `main.js` 驱动

## 7. 测试和验证结果

### 7.1 浏览器检查

| 检查项 | 状态 |
|-------|------|
| 页面标题 "全球供应链大平台 — 实时供需网络" | ✅ |
| `#homeTicker` 存在 | ✅ |
| `#homeDemandGrid` 存在 | ✅ |
| `#homeSupplyGrid` 存在 | ✅ |
| `#matchFeed` 存在 | ✅ |
| `<h1>` "全球供需网络正在运转" | ✅ |
| 导航链接: 首页/供需大厅/风险情报/新闻台 | ✅ |

### 7.2 JS 渲染验证

| 检查项 | 期望 | 实际 |
|-------|------|------|
| Ticker 条目数 | 12（6×2 循环） | 12 ✅ |
| 需求卡片数 | 3 | 3 ✅ |
| 资源卡片数 | 3 | 3 ✅ |
| 匹配条目数 | 5 | 5 ✅ |

### 7.3 控制台错误

无 JavaScript 错误或警告。

### 7.4 响应式截图

| 视口 | 文件 |
|------|------|
| 1280×800 | `.jarvis/tmp/screenshots/index-1280.png` |
| 1024×768 | `.jarvis/tmp/screenshots/index-1024.png` |
| 768×1024 | `.jarvis/tmp/screenshots/index-768.png` |
| 375×812 | `.jarvis/tmp/screenshots/index-375.png` |
| Hero 区域 | `.jarvis/tmp/screenshots/index-hero-viewport.png` |
| 全页面 | `.jarvis/tmp/screenshots/index-new-fullpage.png` |

## 8. 边界和异常处理

- **JS 不可用时**：卡片和 ticker 的容器元素存在于 HTML 中（`id` 属性），但不会渲染内容。页面结构仍可导航。
- **IntersectionObserver 不可用时**：`main.js` 中已有降级处理（直接显示所有 `.reveal` 元素）。
- **Ticker 暂停**：`:hover` 时暂停动画（`animation-play-state: paused`）。
- **Ticker 边缘淡出**：使用 `::before` / `::after` 伪元素渐变遮罩。

## 9. 需要后端配合的点

- 无。本页面为纯静态实现。
- 未来可接入实时 API 来动态更新 Ticker、供需卡片和匹配数据。

## 10. 风险 / 未解决项

| 风险 | 状态 |
|------|------|
| `risk-intel.html` 尚未创建 | 计划页面，链接已预留。点击导航至 404，待后续创建该页面。 |
| `marketplace.html` 中 `#flow` 锚点 | 已存在，链接可用。 |
| 旧 `solutions.html`、`products.html` 页面仍存在 | 不在本次范围内。导航栏已移除其链接，但直接 URL 仍可访问。 |

## 11. 推荐的下一步

1. 创建 `risk-intel.html` 页面（风险情报独立页面）
2. 为 `marketplace.html` 添加 `#flow` 锚点匹配流程内容
3. 将旧的 `solutions.html` 和 `products.html` 内容迁移或下线
4. 为供需卡片和匹配数据接入后端 API（替换当前静态 demo 数据）

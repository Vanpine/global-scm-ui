# risk-intel.html 前端实现文档

## 1. 当前实现目标

创建"风险情报"页面，整合以下 5 个功能区块：
1. Hero（暗色全屏标题区）
2. 3D 地球 + 实时风险 Feed（globe.gl + USGS 地震数据）
3. 情报要闻卡片区（14 篇文章，可分类筛选）
4. 2D 交互式世界地图（Leaflet）
5. CTA 行动号召区

## 2. 对应需求 ID / 任务 ID

- 需求：将 index.html 的 3D globe 区域与 intel.html 的新闻卡片合并为新独立页面
- 任务：创建 `risk-intel.html`

## 3. 输入依据

- index.html（第 284-335 行：globe section 结构）
- intel.html（第 52-234 行：news cards + Leaflet map 结构）
- css/style.css（全量现有 CSS 类名）
- js/risk-globe.js（auto-init 逻辑：DOMContentLoaded 时查找 #globeViz、#riskLeaflet、#riskFeed）
- js/main.js（导航高亮、移动端菜单、滚动入场）

## 4. 变更文件

| 文件 | 操作 |
|------|------|
| `risk-intel.html` | **新建**（481 行） |

无其他文件修改。

## 5. 实现说明

### 5.1 页面结构

```
<!DOCTYPE html> → head (meta/OG/ld+json/CSS) → body
  ├── Navbar（4-item: 首页/供需大厅/风险情报/新闻台）
  ├── Section 1: Hero（.hero.ri-hero，暗色渐变背景）
  ├── Section 2: 3D Globe + Risk Feed（#globeViz + #riskFeed）
  ├── Section 3: Intelligence News（14 cards + 5 筛选标签）
  ├── Section 4: 2D Leaflet Map（#riskLeaflet）
  ├── Section 5: CTA Band
  ├── Footer（4-column: 供需大厅/风险情报/了解更多）
  ├── Inline JS（ES5 IIFE: 新闻筛选 + 卡片点击跳转）
  └── CDN Scripts（i18n.js → main.js → globe.gl → leaflet.js → risk-globe.js）
```

### 5.2 导航栏

采用新版 4-item 导航：首页、供需大厅、风险情报（当前 active）、新闻台。
main.js 自动通过路径匹配高亮当前页。

### 5.3 Hero 区块

- 使用 `.hero.ri-hero` 类，`.ri-hero` 设置 bg-black 径向渐变作为无视频背景
- h1: "全球风险，`<span class='gradient-text'>`一眼看清`</span>`"
- p.lead + p.hero-sub（4 个 icon-pills）
- 双 CTA：查看实时地图（#globe 锚点）、订阅风险预警（contact.html）

### 5.4 3D Globe + Risk Feed

- 复用 index.html 的 `.risk-map` 布局（globe-wrap + risk-panel 双栏）
- `#globeViz` 嵌入 `.globe-wrap`，高度 600px
- `#riskFeed` 由 risk-globe.js 动态填充 USGS 实时地震数据
- 图例：高危/关注/正常（三层色标）

### 5.5 情报要闻卡片

- 完整复制 intel.html 的 14 张 `.news-card`
- 分布为 4 个 `.news-group`（3+3+2+6 张）
- 每个 `.news-group` 添加 `data-cat` 属性：war / logi / energy / policy
- 每个 `.news-card` 有 `data-href` 属性，点击跳转到对应 news-*.html

### 5.6 分类筛选

- 5 个 `.ri-tab` 按钮：全部 / 地缘冲突 / 交通物流 / 能源与环境 / 贸易政策
- 使用 `data-filter` 匹配 `.news-group` 的 `data-cat` 属性
- 点击切换时：隐藏不匹配的 `.news-group`，显示匹配的

### 5.7 2D 交互式地图

- 使用 Leaflet，`#riskLeaflet` 由 risk-globe.js 自动初始化
- 图例：高危/关注/正常（三层色标）
- 自动显示 USGS 地震标记、演示风险航线

### 5.8 内联 CSS

```css
.ri-hero        → bg-black 径向渐变
.ri-tabs        → 水平居中 flex，gap 8px
.ri-tab         → 胶囊按钮，padding 10px 20px，border-radius 999px
.ri-tab.active  → 品牌蓝背景 + 白色文字 + 发光阴影
@media 768px    → 标签栏横向滚动
```

### 5.9 内联 JS（ES5）

```javascript
// initNewsFilter() — 标签点击 → data-filter 匹配 data-cat → 显示/隐藏 .news-group
// initNewsCardClick() — 点击 .news-card[data-href] → window.location.href 跳转
// 键盘支持：Enter/Space 触发跳转
```

## 6. 测试和验证结果

### 6.1 功能测试

| 测试项 | 结果 |
|--------|------|
| 页面加载无控制台错误 | PASS |
| 导航栏 4-item 正确渲染 | PASS |
| 风险情报导航项高亮（active） | PASS |
| Hero 标题/副标题/icon-pills 渲染 | PASS |
| CTA 按钮链接正确（#globe / contact.html） | PASS |
| 3D Globe 自动初始化 | PASS |
| USGS 实时数据填充 #riskFeed | PASS |
| Leaflet 2D 地图自动初始化 | PASS |
| 14 张新闻卡片全部渲染 | PASS |
| 分类筛选功能（点击"地缘冲突"仅显示 war 组） | PASS |
| 筛选切换回"全部"恢复所有组 | PASS |
| 卡片点击跳转（data-href） | PASS |
| Footer 4-column 布局 | PASS |

### 6.2 响应式测试

| 视口 | 结果 |
|------|------|
| 1280x800（桌面） | PASS — 双栏布局正常 |
| 768x1024（平板） | PASS — globe 单栏堆叠，地图自适应 |
| 375x812（手机） | PASS — 标签栏横向滚动，卡片单列 |

### 6.3 截图证据

| 截图 | 路径 |
|------|------|
| 全页 | `.jarvis/tmp/screenshots/risk-intel-full.png` |
| Hero | `.jarvis/tmp/screenshots/risk-intel-hero.png` |
| Globe | `.jarvis/tmp/screenshots/risk-intel-globe.png` |
| News | `.jarvis/tmp/screenshots/risk-intel-news.png` |
| 768px | `.jarvis/tmp/screenshots/risk-intel-768.png` |
| 375px | `.jarvis/tmp/screenshots/risk-intel-375.png` |

## 7. 边界和异常处理

- **图片加载失败**：`.news-thumb` 内 img 的 `onerror` 处理，隐藏图片并添加 `.noimg` 类（显示 emoji 占位）
- **globe.gl CDN 失败**：globe 区域显示空白暗色背景，不影响其他区块
- **Leaflet CDN 失败**：地图区域显示空白暗色背景，不影响其他区块
- **USGS API 不可用**：risk-globe.js 自动回退到演示供应链事件
- **无 JavaScript**：所有内容是静态 HTML，筛选标签和地图不工作但卡片仍然可见
- **空状态**：无（所有内容为静态 HTML）

## 8. 风险 / 未解决项

1. **globe.gl CDN 依赖**：页面依赖 `cdn.jsdelivr.net/npm/globe.gl`，CDN 不可用时 3D 地球无法渲染
2. **Leaflet CDN 依赖**：页面依赖 `unpkg.com/leaflet`，CDN 不可用时 2D 地图无法渲染
3. **USGS API CORS**：USGS 地震 API 为 CORS 开放，但网络环境可能限制访问
4. **跨页面导航**：部分链接指向 `marketplace.html`（供需大厅）——该页面待实现
5. **SEO**：已添加 OG 标签和 JSON-LD 结构化数据，但正式上线需更新 OG 图片 URL

## 9. 需要后端配合的点

无。本页面为纯静态前端页面。

## 10. 推荐的下一步

1. 实现 `marketplace.html`（供需大厅页面）——当前 navbar 已引用
2. 实现各 `news-*.html` 详情页（14 篇文章详情）
3. 将 navbar 更新推送到其他页面（index.html、intel.html 等）以统一导航结构
4. 添加实际 OG 图片 `assets/og-risk.png`

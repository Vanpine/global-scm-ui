# marketplace.html 前端实现文档

## 1. 当前实现目标

创建"供需大厅"页面（marketplace.html），作为全球供应链大平台的双边撮合入口。

## 2. 对应需求 ID / 任务 ID

- 需求：编排者分配，新建 marketplace.html 页面
- 页面路由：`/marketplace.html`
- 对应导航项：供需大厅（4-item navbar 第2项）

## 3. 输入依据

- 编排者提供的 skeleton template（navbar + footer 结构）
- 现有 index.html 设计模式（Apple-Style、BEM 命名、CSS tokens）
- css/style.css 全局样式系统
- js/main.js 共享脚本（导航高亮、滚动入场动画）
- js/i18n.js 国际化引擎（TreeWalker 文本匹配）

## 4. 变更文件 / 变更范围

| 文件 | 操作 | 说明 |
|------|------|------|
| `marketplace.html` | **新建** | 供需大厅完整页面，单文件约 420 行 |

未修改任何共享文件（css/style.css、js/i18n.js、js/main.js）。

## 5. 实现说明

### 5.1 页面结构（5个区块）

```
┌─────────────────────────────────────┐
│  NAVBAR (4-item: 首页/供需大厅/风险情报/新闻台) │
├─────────────────────────────────────┤
│  Section 1: HERO                    │
│  - 深色背景 (bg-black radial)       │
│  - h1: "全球供需，实时匹配"          │
│  - 3个 icon-pill: 发布需求/AI匹配/安全交易 │
│  - CTA: [发布需求] [展示产能]        │
├─────────────────────────────────────┤
│  Section 2: DEMANDS & SUPPLIES      │
│  - Tab切换: [热门需求] [优质资源]    │
│  - 需求面板: 6张卡片 (3-column grid) │
│  - 供应面板: 6张卡片 (3-column grid) │
│  - 模拟数据通过 JS 动态渲染          │
├─────────────────────────────────────┤
│  Section 3: MATCHING PIPELINE        │
│  - bg-gray 背景                      │
│  - 5步横向流程: 发布→解析→匹配→尽调→合作 │
│  - 每步含编号圆圈 + SVG图标 + 描述    │
├─────────────────────────────────────┤
│  Section 4: FIVE CAPABILITIES       │
│  - 5张卡片 (grid-3): 智能撮合/安全合规/可信交付/全局风控/数据智脑 │
│  - 复用 .card .reveal 模式            │
├─────────────────────────────────────┤
│  Section 5: CTA BAND                │
│  - 复用 .cta-band 样式              │
│  - [免费申请加入] + hello@globalscm.com │
├─────────────────────────────────────┤
│  FOOTER (4-column: 品牌/供需大厅/风险情报/了解更多) │
└─────────────────────────────────────┘
```

### 5.2 CSS 组件（inline style 块）

| 类名 | 用途 |
|------|------|
| `.mp-hero` | 全屏 hero，深色径向渐变背景 |
| `.mp-tabs` | Tab 按钮容器（flex + 居中） |
| `.mp-tab-btn` | Tab 按钮，含 `.active` 态（品牌渐变填充） |
| `.sd-grid` | 3-column 卡片网格（响应式：2-col@1024, 1-col@768） |
| `.sd-panel` | Tab 面板（display:none/block 切换） |
| `.sd-card` | 供需卡片（玻璃感、边框、阴影、hover lift） |
| `.sd-card--urgent` | 紧急修饰（红色左边框 + 脉冲动画） |
| `.sd-badge` | 状态标签（紧急/正常） |
| `.sd-card__tag` | 品类/认证标签 pill |
| `.pipeline-flow` | 5步横向流程 flex 容器 |
| `.pipeline-step` | 流程节点（编号圆、图标、标题、描述） |
| `.pipeline-arrow` | 流程连接箭头 → |

### 5.3 JavaScript（inline IIFE, ES5 严格模式）

- `DEMANDS` 数组：6 条模拟需求数据（含 urgency、tags、spec）
- `SUPPLIES` 数组：6 条模拟供应数据（含 certs、tags、spec）
- `initTabs()`：`.mp-tab-btn` 点击切换面板
- `renderCards()`：遍历数据通过 innerHTML 拼接创建 DOM
- `DOMContentLoaded` 时执行初始化

### 5.4 国际化适配

所有中文文本节点在 DOM 中以静态文本形式存在，兼容 `js/i18n.js` 的 TreeWalker 遍历匹配机制。未在字典中找到匹配的词条将优雅降级保留中文。

### 5.5 响应式

- 默认：3-column 卡片网格，5步横向 pipeline
- `@media (max-width: 1024px)`：2-column 网格，pipeline 折行
- `@media (max-width: 768px)`：1-column 网格，pipeline 纵向堆叠

## 6. 测试和验证结果

| 验证项 | 状态 | 证据 |
|--------|------|------|
| HTTP 200 响应 | PASS | curl 返回 200 |
| 控制台错误 | PASS | 0 错误/警告 |
| 需求卡片渲染 | PASS | 6 张卡片完整显示（a11y snapshot） |
| 供应卡片渲染 | PASS | Tab 切换后 6 张卡片显示 |
| Tab 切换交互 | PASS | 点击"优质资源"，面板切换正确 |
| 导航高亮 | PASS | "供需大厅"链接 active=true |
| 响应式 375px | PASS | 截图 `.jarvis/tmp/screenshots/marketplace-375.png` |
| 响应式 768px | PASS | 截图 `.jarvis/tmp/screenshots/marketplace-768.png` |
| 响应式 1024px | PASS | 截图 `.jarvis/tmp/screenshots/marketplace-1024.png` |
| 全页截图 | PASS | 截图 `.jarvis/tmp/screenshots/marketplace-full.png` |
| 全页截图（供应Tab）| PASS | 截图 `.jarvis/tmp/screenshots/marketplace-supply-tab.png` |

### 截图清单

| 文件 | 视口 | 内容 |
|------|------|------|
| `marketplace-full.png` | 1280x900 | 全页默认（需求Tab） |
| `marketplace-supply-tab.png` | 1280x900 | 全页（供应Tab切换后） |
| `marketplace-375.png` | 375x812 | 移动端 |
| `marketplace-768.png` | 768x1024 | 平板 |
| `marketplace-1024.png` | 1024x800 | 小桌面 |

## 7. 边界和异常处理

- **Tab 无按钮/面板**：`if (!tabBtns.length || !panels.length) return;` 卫语句
- **Grid 容器不存在**：`if (demandGrid)` / `if (supplyGrid)` 卫语句
- **紧急/正常标签**：根据 `d.urgent` 布尔值条件渲染
- **空标签数组**：`.map().join('')` 对空数组产生空字符串，不影响渲染
- **i18n 未覆盖词条**：优雅降级保留中文，参见 js/i18n.js 设计

## 8. 风险 / 未解决项

- **i18n 词典未更新**：新增的中文词条（如"供需大厅"、"实时匹配"、"热门需求"等）在当前 i18n.js 词典中没有对应英文翻译。这是设计行为——词典由独立任务维护，新增页面不绑定词典更新。英文环境下这些词条将显示中文。
- **模拟数据**：供需卡片数据为前端硬编码的演示数据，正式版需接入真实 API。

## 9. 需要后端配合的点

- **供需数据 API**：正式版需要 `GET /api/demands` 和 `GET /api/supplies` 接口，支持分页、筛选、搜索
- **匹配流程状态**：如需要实时步骤状态，需 `GET /api/matching-pipeline/{requestId}` 接口
- **平台能力数据**：当前为静态卡片，如需动态化需配置管理接口

## 10. 推荐的下一步

1. 由编排者分配 i18n 词典更新任务，为 marketplace 页面新增词条添加英文翻译
2. 构建 `risk-intel.html` 页面（导航第3项）
3. 如需真实数据，由后端团队对接供需匹配 API

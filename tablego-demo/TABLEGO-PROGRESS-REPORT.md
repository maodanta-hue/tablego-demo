# TableGo 项目开发进度报告

**报告生成日期：** 2026-07-27

---

## 1. 项目基本信息

| 项目 | 内容 |
|------|------|
| **项目名称** | TableGo（tablego-demo） |
| **技术栈** | React 19 + TypeScript 6 + Vite 8 + TailwindCSS 4 |
| **路由方案** | React Router DOM v7 |
| **数据存储** | localStorage（统一键 `tablego_db`） |
| **包管理器** | npm |
| **当前版本** | v0.8（git tag/commit message） |
| **开发阶段** | Alpha — 原型验证 + 功能搭建中 |
| **代码库规模** | 3 次 commit，约 50+ 核心源文件 |
| **目标** | 从 Demo 原型演进为 SaaS 原型 |

---

## 2. 已完成任务总览

### A. 数据架构

- [x] **统一持久层 `src/services/storage.ts`**
  - 所有数据统一存储在 `localStorage` 的 `tablego_db` 键下
  - 数据版本号控制（当前 `version = 1`）
  - 完整 CRUD：getSlice / setSlice / removeSlice
  - 数据库管理：resetDatabase / seedDemo / initializeIfEmpty
  - 导入导出：exportDatabase / importDatabase（JSON 格式）
  - 包含默认种子数据（10 张桌子、8 个菜单项、5 个分类）

- [x] **Store 层（基于 localStorage 的数据访问层）**
  - `restaurantStore.ts` — 餐厅信息读写
  - `menuStore.ts` — 菜单项 CRUD + 分类过滤
  - `categoryStore.ts` — 分类 CRUD
  - `orderStore.ts` — 订单 CRUD + 状态流转
  - 统一导出入口 `store/index.ts`

- [x] **多端数据共享**
  - 顾客端和后台共用同一份 `tablego_db` 数据
  - 后台修改菜单/分类后，顾客端刷新即可看到
  - 订单数据两端互通

- [x] **数据同步服务 `src/services/sync.ts`**
  - 初步实现数据同步逻辑（mock 层面）

### B. 顾客端

- [x] **首页 / 欢迎页面** `WelcomePage.tsx`
  - 餐厅介绍 + 入口导航
  - 底部 AppLayout 导航栏

- [x] **菜单页面** `MenuPage.tsx`
  - 水平分类导航（CategorySidebar）
  - 商品网格展示（ProductCard）
  - 底部购物车浮窗（BottomCart）
  - 桌号参数从 URL 获取（`?table=A01`）

- [x] **商品详情页** `MenuDetailPage.tsx`
  - 商品图片、描述、价格展示
  - 加入购物车按钮

- [x] **购物车页面** `CartPage.tsx`
  - 购物车商品列表（CartItemRow）
  - 数量加减
  - 桌号信息展示
  - 下单按钮

- [x] **下单流程**
  - `OrderContext.tsx` 管理订单状态
  - 提交订单 → 订单存入 `tablego_db`

- [x] **订单成功页** `OrderSuccessPage.tsx`
  - 订单号展示
  - 订单概要

- [x] **订单查看** `OrderCard.tsx`
  - 顾客端查看已提交订单

### C. 老板后台

- [x] **后台布局** `AdminLayout.tsx`
  - 侧边栏导航
  - 响应式布局

- [x] **Dashboard** `DashboardPage.tsx`
  - 今日订单统计概览
  - 订单状态分布

- [x] **订单管理** `OrdersPage.tsx`
  - 订单列表
  - 订单状态流转（pending → preparing → completed → paid）

- [x] **菜单管理** `MenuManagePage.tsx`
  - 菜单项完整 CRUD（名称、价格、图片、库存、多语言）
  - 分类管理

- [x] **桌台管理** `TablesPage.tsx`
  - 桌台列表展示
  - QR 码链接生成

- [x] **设置页面** `SettingsPage.tsx`
  - 餐厅基本信息编辑（名称、地址、电话、Logo）
  - 营业状态开关

- [x] **管理员登录** `AdminLoginPage.tsx`
  - 简单的登录入口

### D. 图片系统

- [x] **图片存储方式**：目前使用外部 URL（Unsplash CDN）
- [ ] **图片上传功能**：尚未实现，后台菜单管理使用 URL 输入
- [x] **图片展示**：菜单卡片、详情页均正常展示图片

### E. 多语言

- [x] **已支持语言**：中文（zh）、英文（en）、越南语（vi）
- [x] **翻译文件**：
  - `src/data/translations.ts` — 顾客端翻译
  - `src/data/adminTranslations.ts` — 后台翻译
- [x] **语言切换组件** `LanguageSwitcher.tsx`
- [x] **多语言覆盖范围**：
  - 菜单名称、描述（全部三语）
  - 分类名称（全部三语）
  - 餐厅信息（全部三语）
  - 页面 UI 文案（全部三语）
  - 后台管理文案（全部三语）
- **完成程度：约 90%**，少量新增页面文案可能未完全覆盖

### F. 二维码 / 扫码点餐

- [x] **桌号系统** `src/data/tables.ts`
  - 预置 10 张桌台（A01-A10）
  - 桌台状态管理（active / disabled）
  - 按桌号查找

- [x] **扫码入口** `/table/:tableNo`
  - `TableEntryPage.tsx` — 自动重定向到菜单页并携带桌号参数
  - URL 参数模式：`/menu?table=A01`

- [x] **QR 链接生成** `getTableQRUrl(tableNo)` → 返回 `/table/{tableNo}`

---

## 3. 当前已经解决的问题

| 问题 | 解决方案 | 状态 |
|------|---------|------|
| 数据不持久、刷新丢失 | 统一 localStorage 持久层 `tablego_db` | ✅ 已解决 |
| 顾客和后台数据不互通 | 两端共用同一份 `tablego_db` 数据 | ✅ 已解决 |
| 桌号需要用户手动输入 | URL 参数自动携带，`/table/:tableNo` 扫码跳转 | ✅ 已解决 |
| UI 模板感重 | 重新设计顾客端（RestaurantHeader + CategorySidebar + ProductCard + BottomCart） | ✅ 已解决 |
| 后台功能过于简单 | 完整 CRUD：菜单管理、分类管理、桌台管理、订单流转 | ✅ 已解决 |
| 菜单项无多语言支持 | MenuItem / Category 数据结构内置 `{ zh, en, vi }` | ✅ 已解决 |
| 购物车/订单数据无持久化 | 存入 localStorage 持久化 | ✅ 已解决 |
| 演示数据无初始化流程 | `initializeIfEmpty()` 自动填充演示种子数据 | ✅ 已解决 |

---

## 4. 当前剩余 Bug / 未完成事项

### 页面问题
- [ ] WelcomePage 和 OwnerPage 使用旧版 AppLayout，可能未完全适配新 UI
- [ ] 部分页面在移动端布局可能存在适配问题
- [ ] AdminLayout 的侧边栏在窄屏上的折叠行为可能不完善

### 功能问题
- [ ] **无图片上传功能** — 后台菜单管理仅支持 URL 输入，无文件上传/裁剪
- [ ] **无真实二维码生成** — `getTableQRUrl` 仅返回路径字符串，未生成真实 QR 码图片
- [ ] **无真实后端 API** — 全部基于 localStorage，无法跨设备/跨浏览器同步
- [ ] **无用户认证系统** — 管理员登录仅为前端模拟，无真实鉴权
- [ ] **订单无实时推送** — 后台需要手动刷新才能看到新订单

### 用户体验问题
- [ ] 缺少加载状态骨架屏（部分页面已有 Skeleton 组件但未全部覆盖）
- [ ] Toast 提示系统可能尚未完全接入所有操作流程
- [ ] 首次加载无引导流程
- [ ] 后台菜单管理缺少批量操作功能

### 数据问题
- [ ] `tablego_db` 数据存储在浏览器 localStorage，清除缓存会导致数据丢失
- [ ] 多端同时操作时无冲突处理机制
- [ ] 订单状态变更无审计日志

---

## 5. 下一阶段开发建议

### P0 — 必须完成（MVP 必须项）

| 优先级 | 任务 | 说明 |
|--------|------|------|
| P0 | 接入真实后端 API | 替换 localStorage 为服务端存储，实现跨设备数据同步 |
| P0 | 管理员认证系统 | 接入 JWT / Session 登录，保护后台路由 |
| P0 | 生成真实二维码 | 集成 QR 码库（如 qrcode.js）生成可打印的桌台二维码 |

### P1 — 重要优化

| 优先级 | 任务 | 说明 |
|--------|------|------|
| P1 | 图片上传功能 | 集成文件上传（如 Imgur / Cloudinary / 自建上传接口） |
| P1 | 订单实时推送 | 使用 WebSocket / SSE 实现新订单实时通知 |
| P1 | 移动端布局全面适配 | 确保所有页面在手机端体验良好 |
| P1 | 骨架屏全覆盖 | 所有列表/详情页添加 Skeleton 加载状态 |
| P1 | 错误边界处理 | 添加 ErrorBoundary 和全局异常捕获 |

### P2 — 后续功能

| 优先级 | 任务 | 说明 |
|--------|------|------|
| P2 | 数据导出/报表 | 后台订单统计导出 CSV/Excel |
| P2 | 多店铺支持 | 允许同一个账号管理多家餐厅 |
| P2 | 顾客端主题定制 | 允许后台自定义餐厅主题色、Logo |
| P2 | 订单打印 | 对接小票打印机 |
| P2 | 评价系统 | 顾客下单后可以评价菜品 |

---

## 6. 当前完成度评估

| 维度 | 完成度 | 说明 |
|------|--------|------|
| **整体完成度** | **65%** | 核心功能链路已通，但缺少后端接入和认证系统 |
| **顾客端** | **75%** | 菜单浏览、购物车、下单、订单查看均可使用，但无实时状态更新 |
| **后台管理** | **70%** | Dashboard / 订单 / 菜单 / 桌台 CRUD 齐全，管理员登录为模拟态 |
| **数据层** | **80%** | localStorage 持久化 + 统一数据层 + 种子数据完整，但无服务端同步 |
| **商业化程度** | **30%** | 缺少认证、支付、打印、多店支持、部署方案，尚不可用于真实餐厅 |

**理由说明：**

1. **整体 65%**：从前端功能角度看，一个点餐系统所需的页面和流程基本齐全，但距离可上线运营还缺少后端基础设施。
2. **顾客端 75%**：顾客核心体验链路完整（进店→看菜单→加购→下单→查看订单），但缺少支付集成和实时订单状态推送。
3. **后台 70%**：管理后台功能模块完整，但缺少认证鉴权、批量操作和数据分析能力。
4. **数据层 80%**：数据架构设计合理，持久化方案可用，但 localStorage 不适合生产环境，必须替换为服务端数据库。
5. **商业化 30%**：目前是单机 Demo 级别，无法同时服务多桌顾客，无支付、无部署方案。

---

## 7. Git 版本记录

| Commit Hash | Message | 完成内容 |
|-------------|---------|---------|
| `e776950` | Initial commit | 项目初始化，Vite + React + TypeScript 脚手架搭建 |
| `866a920` | Fix build errors | 修复编译错误，完善类型定义 |
| `2e68622` | **TableGo v0.8** | 统一数据持久层、重构顾客端 UI、完整后台 CRUD、多语言支持、扫码点餐入口 |

**v0.8 变更文件列表（共 49 个文件变更）：**

| 类别 | 文件 |
|------|------|
| 文档 | UPGRADE-PLAN.md |
| 路由/入口 | App.tsx, main.tsx |
| 顾客端组件 | RestaurantHeader.tsx, CategorySidebar.tsx, ProductCard.tsx, BottomCart.tsx, OrderCard.tsx |
| 后台页面 | AdminLayout.tsx, DashboardPage.tsx, OrdersPage.tsx, MenuManagePage.tsx, TablesPage.tsx, SettingsPage.tsx |
| 顾客端页面 | MenuPage.tsx, MenuDetailPage.tsx, CartPage.tsx, OrderSuccessPage.tsx, TableEntryPage.tsx, WelcomePage.tsx, OwnerPage.tsx |
| 通用组件 | MenuCard.tsx, CartItemRow.tsx, AppLayout.tsx, LanguageSwitcher.tsx |
| 数据层 | storage.ts（新增统一持久层） |
| Store | restaurantStore.ts, menuStore.ts, categoryStore.ts, orderStore.ts, store/index.ts |
| 类型定义 | menu.ts, order.ts, cart.ts, index.ts |
| 数据文件 | translations.ts, adminTranslations.ts, tables.ts |
| 样式 | index.css, design-tokens.css |
| 上下文 | OrderContext.tsx |
| 工具 | devtools.ts, useFormat.ts, sync.ts |

---

**报告结束**
# 🍜 TableGo — 东南亚餐饮 SaaS 扫码点餐系统

**TableGo** 是一款面向东南亚餐饮市场的轻量级扫码点餐 SaaS 系统。顾客扫码即可浏览菜单、下单、跟踪订单；老板通过管理后台实时管理菜单、订单和桌号。支持 **中文 / English / Tiếng Việt / 한국어 / 日本語** 五语言切换。

> 在线演示：**[https://tablego-demo-jwbb.vercel.app](https://tablego-demo-jwbb.vercel.app)**

---

## ✨ 功能列表

### 🧑 顾客端（扫码点餐）

- 📱 **扫码入座** — 扫描桌号二维码自动绑定桌号
- 📋 **菜单浏览** — 左侧分类栏 + 右侧商品卡片，搜索过滤
- 🛒 **购物车** — 规格选择（冰量/甜度/加料）+ 数量调整，实时计价
- 📦 **订单跟踪** — 查看当前桌号的所有订单，状态实时更新
- 🌐 **多语言** — 五语言即时切换（zh / en / vi / ko / ja）

### 👨‍🍳 老板端（管理后台）

- 📊 **Dashboard** — 营业额、订单数、热销商品数据概览
- 📋 **订单管理** — 查看所有订单，状态流转（待确认 → 准备中 → 已完成）
- 🍽️ **菜单管理** — 新增/编辑/删除菜品，多语言名称，上下架
- 🪑 **桌号管理** — 新增桌号、生成二维码、打印
- ⚙️ **设置** — 修改餐厅信息、管理分类

---

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| **React 19** | 函数组件 + Hooks，`memo` / `lazy` 性能优化 |
| **TypeScript 6.0** | 全量类型覆盖 |
| **Vite 8** | 开发/构建工具，HMR 热更新 |
| **TailwindCSS 4** | 原子化 CSS，商业级设计系统 |
| **React Router 7** | SPA 路由，懒加载分割 |
| **Vercel** | 免费部署，自动 HTTPS，边缘网络 |

---

## 🚀 快速启动

```bash
# 1. 克隆仓库
git clone https://github.com/maodanta-hue/tablego-demo.git
cd tablego-demo

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开
# 顾客端: http://localhost:5173/menu?table=A1
# 老板端: http://localhost:5173/admin/login
```

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (默认端口 5173) |
| `npm run build` | TypeScript 检查 + Vite 生产构建 |
| `npm run lint` | Oxlint 代码检查 |
| `npm run preview` | 预览生产构建 |

---

## 📸 界面截图（文字描述）

### 顾客端

- **WelcomePage** — 品牌 Logo + "开始点单"按钮 + 输入桌号
- **MenuPage** — 顶部：餐厅名 / 桌号 / 搜索栏 / 🌐语言切换 / 菜单Tab | 订单Tab；左侧：分类图标栏（☕🍵🧋🍰🍜🥤）；右侧：商品卡片（80×80 图片 + 名称 + 月售 + 价格 + "选规格"按钮）；底部：购物车浮条（图标角标 + 合计 + "选好了"）
- **CartPage / CartDrawer** — 购物车商品列表 + 备注输入 + 提交订单
- **SpecModal** — Bottom Sheet 规格选择：冰量 / 甜度 / 加料 / 数量 ±
- **OrderCard** — 订单卡片：序号 / 桌号 / 时间 / 状态彩色标签（待确认🟠/准备中🔵/已完成🟢）

### 老板端

- **AdminLoginPage** — 简洁登录表单
- **DashboardPage** — 今日营业额卡片 + 订单数 + 热销排行
- **OrdersPage** — 订单列表，可切换状态
- **MenuManagePage** — 菜品 CRUD 表格 + 搜索 + 上/下架开关
- **TablesPage** — 桌号列表 + 生成二维码按钮
- **SettingsPage** — 餐厅名称 / 语言配置 / 分类管理

---

## 📁 项目结构

```
tablego-demo/
├── public/                    # 静态资源
├── src/
│   ├── components/
│   │   ├── cart/              # 购物车相关组件
│   │   ├── common/            # 通用组件（LanguageSwitcher）
│   │   ├── customer/          # 顾客端组件
│   │   ├── dashboard/         # 老板端组件
│   │   ├── layout/            # 布局组件
│   │   ├── menu/              # 菜单组件
│   │   └── ui/                # UI 基础组件（Button/Modal/...）
│   ├── context/               # React Context（语言/订单）
│   ├── data/                  # 静态数据（翻译/语言配置/桌号）
│   ├── hooks/                 # 自定义 Hooks
│   ├── lib/                   # 工具库
│   ├── pages/                 # 页面组件
│   │   ├── admin/             # 老板端页面
│   │   └── customer/          # 顾客端页面
│   ├── services/              # 服务层（storage/sync）
│   ├── store/                 # 数据 Store（menu/order/category/restaurant）
│   ├── styles/                # 全局样式 + 设计 Token
│   ├── types/                 # TypeScript 类型定义
│   ├── utils/                 # 工具函数（i18n）
│   ├── App.tsx                # 根组件 + 路由
│   ├── index.css              # TailwindCSS 入口
│   └── main.tsx               # 应用入口
├── vercel.json                # Vercel 部署配置
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置
├── package.json               # 依赖 & 脚本
├── README.md                  # 本文件
├── USER_MANUAL.md             # 用户手册
└── DEPLOYMENT.md              # 部署指南
```

---

## 🧪 技术亮点

- **性能优化** — 路由懒加载（`lazy` + `Suspense`）、组件 `React.memo`、图片 LQIP + 懒加载、vendor chunk 拆分
- **商业级 UI** — 像素级还原外卖平台风格（圆角/阴影/动画/毛玻璃）
- **五语言国际化** — Context 驱动，无刷新切换，Vercel 生产环境兜底
- **SPA 路由** — React Router v7，SPA fallback（Vercel rewrites）
- **TypeScript 全量覆盖** — types/ 集中管理所有接口定义

---

## 📄 许可证

MIT License © 2025 TableGo

---

> 💡 此项目为 TableGo 演示版本。生产环境需接入后端 API（订单持久化、支付、打印等）。
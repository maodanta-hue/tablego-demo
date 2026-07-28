# 🚀 TableGo 部署指南

本指南介绍如何将 TableGo 部署到 **Vercel**（免费、自动 HTTPS、全球 CDN）。

---

## 📋 前置条件

| 工具 | 说明 |
|------|------|
| **GitHub 账号** | 代码托管 |
| **Vercel 账号** | 部署平台（用 GitHub 直接登录） |
| **Git** | 版本控制 |
| **Node.js 18+** | 本地开发环境 |

---

## 🔧 方式一：Vercel 一键部署（推荐）

### Step 1: 推送代码到 GitHub

```bash
# 1. 克隆项目（如果还没有）
git clone https://github.com/maodanta-hue/tablego-demo.git
cd tablego-demo

# 2. 确保是最新版本
git pull origin main

# 3. （可选）推送到你自己的仓库
git remote add myrepo https://github.com/YOUR_USERNAME/tablego-demo.git
git push myrepo main
```

### Step 2: 在 Vercel 导入项目

1. 打开 **[vercel.com](https://vercel.com)**，用 GitHub 登录
2. 点击 **Add New** → **Project**
3. 选择你的 GitHub 仓库 `tablego-demo`
4. Vercel 自动识别为 Vite 项目（通过 `vercel.json`）

### Step 3: 部署配置

Vercel 会自动读取项目根目录的 `vercel.json`，无需手动配置：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

| 配置项 | 值 | 说明 |
|------|------|------|
| **Framework** | Vite | 自动识别 |
| **Build Command** | `npm run build` | tsc 检查 + vite build |
| **Output Directory** | `dist` | 构建产物目录 |
| **Root Directory** | `./` | 项目根目录 |

### Step 4: 点击 Deploy

1. 确认配置无误
2. 点击 **Deploy**
3. 等待 30-60 秒，构建完成
4. Vercel 自动分配域名：`https://tablego-demo.vercel.app`
5. 自动配置 HTTPS 证书

### Step 5: 绑定自定义域名（可选）

1. 进入项目 Settings → **Domains**
2. 添加你的域名（如 `order.your-restaurant.com`）
3. 在域名 DNS 添加 CNAME 记录指向 `cname.vercel-dns.com`
4. Vercel 自动签发 Let's Encrypt SSL 证书

---

## 💻 方式二：本地构建 + 手动部署

### Step 1: 本地构建

```bash
# 安装依赖
npm install

# 生产构建（TypeScript 检查 + Vite 构建）
npm run build

# 构建产物在 dist/ 目录
ls dist/
# index.html  assets/  ...
```

### Step 2: 部署 dist/ 目录

将 `dist/` 目录内容上传到任意静态托管服务：

| 平台 | 说明 |
|------|------|
| **Vercel CLI** | `npx vercel --prod` |
| **Netlify** | 拖拽 `dist/` 到 Netlify Drop |
| **Cloudflare Pages** | 连接 GitHub 自动部署 |
| **Nginx** | 复制 `dist/` 到 `/var/www/html` |
| **任何静态服务器** | 部署 `dist/` 目录，配置 SPA fallback |

### SPA Fallback 配置（重要！）

由于 TableGo 是 SPA（单页应用），所有路由请求必须 fallback 到 `index.html`：

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name order.your-restaurant.com;
    root /var/www/tablego-demo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Netlify 配置（`_redirects` 文件）：**

```
/*    /index.html   200
```

**Vercel（`vercel.json`，已内置）：**

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔄 持续部署（每次 git push 自动部署）

Vercel 默认启用自动部署：

1. 本地修改代码
2. `git add . && git commit -m "update" && git push`
3. Vercel 自动检测 push → 自动构建 → 自动部署
4. 生产环境 URL 自动更新

> 💡 每次 push 都会触发自动部署，无需手动操作。

### 预览部署（Preview Deploy）

每个 Pull Request 自动生成预览 URL：

1. 创建 feature 分支
2. 提交 PR
3. Vercel Bot 自动评论预览链接
4. 合并前验证预览无误

---

## 🌍 环境变量（可选）

当前演示版不需要环境变量。生产环境可能需要配置：

| 变量名 | 说明 | 默认值 |
|------|------|------|
| `VITE_API_BASE` | 后端 API 地址 | 无（纯前端） |
| `VITE_DEFAULT_LANG` | 默认语言 | `zh` |

在 Vercel 中配置环境变量：

1. 项目 Settings → **Environment Variables**
2. 添加 Key-Value 对
3. 重新部署生效

在代码中使用：

```ts
const apiBase = import.meta.env.VITE_API_BASE || 'https://api.tablego.com';
```

---

## ✅ 验证部署成功

1. 浏览器打开 Vercel 分配的 URL
2. 检查以下页面均可访问：
   - 首页重定向到 `/welcome`
   - `/menu?table=A1` — 顾客端菜单
   - `/admin/login` — 老板端登录
   - 刷新任意页面不 404（SPA fallback 生效）
3. 检查右上角 🌐 语言切换正常
4. 检查控制台无报错

---

## 🛠 构建命令参考

```bash
# 本地开发
npm run dev               # 启动开发服务器 http://localhost:5173

# 构建
npm run build             # tsc -b && vite build → dist/

# 预览构建产物
npm run preview           # 预览 http://localhost:4173

# 代码检查
npm run lint              # oxlint

# Vercel CLI 部署
npx vercel                # 预览部署
npx vercel --prod         # 生产部署
```

---

## ❓ 常见问题

### Q: 部署后刷新页面显示 404？
**A:** SPA fallback 未配置。确保静态服务器将未知路由指向 `index.html`。Vercel 已通过 `vercel.json` 自动配置。

### Q: 构建失败："Cannot find package 'esbuild'"？
**A:** Vite 8 使用 Oxc 替代 esbuild，已在 `vite.config.ts` 中处理。确保使用项目提供的配置文件。

### Q: 如何回滚到上一个版本？
**A:** Vercel → 项目 → Deployments → 选择历史版本 → **Promote to Production**。

### Q: 如何查看构建日志？
**A:** Vercel → 项目 → Deployments → 点击部署记录 → 查看完整构建日志。

### Q: 免费额度够用吗？
**A:** Vercel 免费版：100GB 带宽/月、6000 分钟构建/月。小型餐厅完全够用。

### Q: 如何连接自定义域名？
**A:** Settings → Domains → 添加域名 → 配置 DNS CNAME → 等待 SSL 自动签发（约 1-2 分钟）。

---

## 📞 技术支持

- **GitHub Issues**: [https://github.com/maodanta-hue/tablego-demo/issues](https://github.com/maodanta-hue/tablego-demo/issues)
- **Vercel 文档**: [https://vercel.com/docs](https://vercel.com/docs)
- **在线演示**: [https://tablego-demo-jwbb.vercel.app](https://tablego-demo-jwbb.vercel.app)

---

> 💡 **提示**：此部署流程适用于 TableGo 演示版。正式版后端服务需额外部署（建议使用 Railway、Fly.io 或自建服务器）。
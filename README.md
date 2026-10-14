# 小小数学实验室

给四年级孩子的互动数学网页：从生活问题出发，用动画、滑块和小练习理解数学。

正式网址：[https://little-math-lab.vercel.app](https://little-math-lab.vercel.app)

2026-10-14 已发布到 Shane 的 Vercel Hobby 项目 `little-math-lab`，正式域名已验证免登录返回 200。今后更新此项目，网址保持不变。

## 当前内容

1. 风筝与角度：两根 30 米的直线、相同握线高度，对比 0°～90° 的角度变化。
2. 认识角：锐角、直角、钝角、平角。
3. 角与边的长度：保持方向不变，伸长画出的边，角度不变。

风筝的高度数值是相对握线位置的高度，使用 `L * sin(angle)` 计算。三角函数只用于程序内部，不作为四年级教学要求。忽略风、线弯曲和实际飞行动力学，这是几何示意实验。

## 开发和检查

```powershell
npm install
npm run dev
npm run build
npm test
```

也可双击「启动数学实验室.bat」。开发端口为 5173。

## 以后如何加题

家长把题目文字或照片发到原来的 Codex 聊天；说明孩子卡在哪一步。由 Codex 核对条件、设计可交互动画、增加课程，检查后更新同一 Vercel 项目。

`src/lessons.js` 保存课程内容、讲解步骤、练习与演示初值。`src/main.jsx` 保存交互和 SVG 场景。每道不同类型的题，需要制作相应场景，不能只更换标题。网站「下一个问题」可以本地保存草稿并复制请求；它没有 AI 接口，也不会自动上传题目。

## 开源来源

- [Motion](https://github.com/motiondivision/motion)：实际使用的开源动画库（MIT）。动画始终在角度空间计算，再计算风筝坐标，从而保持线长。
- [React](https://github.com/facebook/react)：界面和状态管理（MIT）。
- [Vite](https://github.com/vitejs/vite)：本地开发和静态构建（MIT）。
- [Lucide](https://github.com/lucide-icons/lucide)：图标（ISC）。
- [JSXGraph](https://github.com/jsxgraph/jsxgraph)：调研过的交互几何项目，当前版本未引入。

依赖的许可文件保留在各 npm 包中。课程内容和场景为本项目编写，没有整站复制其他教育产品。

## 发布

使用 Vercel Hobby 的静态 Vite 项目即可，无后端、数据库、API 密钥、付费 AI 调用或外部字体。`npm run build` 输出 `dist/`。

首次授权后，在此项目目录执行 `npx vercel --prod`。后续复用 `.vercel/project.json` 中的项目；不要新建重复的 Vercel 项目。

朗读使用浏览器自身的语音服务；是否有中文声音取决于设备。题目草稿仅保存在当前浏览器的 localStorage，浏览器清理数据后会丢失。

## GitHub 私有备份与换电脑

私有源码仓库：`https://github.com/shanelau068-a11y/little-math-lab`。

新电脑先登录具有此仓库访问权限的 GitHub 账号，并安装 Git 与 Node.js 22 LTS 或更新的兼容版本。当前发布与本地检查使用 Node.js 24。

```powershell
git clone https://github.com/shanelau068-a11y/little-math-lab.git
cd little-math-lab
npm ci
npm run dev
```

访问 `http://localhost:5173/`，或在安装依赖后双击「启动数学实验室.bat」。这是静态网页，没有数据库，也不需要数据库迁移。

Vercel 登录凭据与 `.vercel/` 项目连接配置不会备份到 GitHub。新电脑需要发布时，先执行 `npx vercel login`，再执行 `npx vercel link --scope shane-9bc4 --project little-math-lab` 连接现有项目，最后执行 `npx vercel deploy --prod --scope shane-9bc4`。

换电脑前，如要保留网页中的题目草稿，先从原浏览器手动复制保存。浏览器 localStorage、登录凭据、原始错题照片、授权截图、依赖与构建产物都不随 GitHub 源码迁移。上传到本地 `uploads/` 或 `raw-questions/` 的照片需要自行另存。

以后每次修改后，需要提交并推送到这个仓库才会更新备份。当前 Vercel 使用命令行发布，GitHub 推送和 Vercel 发布是两个步骤。

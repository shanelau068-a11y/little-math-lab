# 小小数学实验室

给四年级孩子的互动数学网页：从生活问题出发，用动画、滑块和小练习理解数学。

主站网址：[https://shanelau068-a11y.github.io/little-math-lab/](https://shanelau068-a11y.github.io/little-math-lab/)

源码仓库：[shanelau068-a11y/little-math-lab](https://github.com/shanelau068-a11y/little-math-lab)。仓库公开，GitHub Actions 会在 `main` 分支每次提交后自动检查、构建并发布 GitHub Pages。主站的更新不需要操作 Vercel。

原来的 [Vercel 网址](https://little-math-lab.vercel.app)仍保留已发布版本。GitHub Pages 的自动发布不会更新这个旧网址。

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

家长把题目文字或照片发到原来的 Codex 聊天；说明孩子卡在哪一步。由 Codex 核对条件、设计可交互动画、增加课程并推送到此仓库，自动发布到同一个 GitHub Pages 网址。

`src/lessons.js` 保存课程内容、讲解步骤、练习与演示初值。`src/main.jsx` 保存交互和 SVG 场景。每道不同类型的题，需要制作相应场景，不能只更换标题。网站「下一个问题」可以本地保存草稿并复制请求；它没有 AI 接口，也不会自动上传题目。

## 开源来源

- [Motion](https://github.com/motiondivision/motion)：实际使用的开源动画库（MIT）。动画始终在角度空间计算，再计算风筝坐标，从而保持线长。
- [React](https://github.com/facebook/react)：界面和状态管理（MIT）。
- [Vite](https://github.com/vitejs/vite)：本地开发和静态构建（MIT）。
- [Lucide](https://github.com/lucide-icons/lucide)：图标（ISC）。
- [JSXGraph](https://github.com/jsxgraph/jsxgraph)：调研过的交互几何项目，当前版本未引入。

依赖的许可文件保留在各 npm 包中。课程内容和场景为本项目编写，没有整站复制其他教育产品。

## 发布

网站是静态 Vite 项目，无后端、数据库、API 密钥、付费 AI 调用或外部字体。`npm run build` 输出 `dist/`。

GitHub Pages 已使用 `.github/workflows/pages.yml` 自动发布：

1. 在 GitHub 仓库中打开要修改的文件，点击编辑按钮。
2. 完成修改后，选择 **Commit changes**，提交到 `main` 分支。若创建了其他分支，合并到 `main` 后才会发布。
3. 在仓库 **Actions** 页面查看 `Deploy math lab to GitHub Pages`。运行成功后，刷新主站网址即可看到修改。

`src/lessons.js` 用于题目、讲解与练习文字；`src/main.jsx` 用于动画场景与交互；`src/style.css` 用于外观。更新图片或文字不会自动生成新的动画逻辑，新题型仍需要制作对应的场景。

自动发布会先运行数学测试和构建。如代码错误导致检查失败，此次不会替换现有网站，可在 Actions 日志查看原因。还可以在 Actions 页面手动 **Run workflow** 再次发布。

工作流构建时设置 `GITHUB_PAGES=true`，资源路径使用 `/little-math-lab/`，避免项目子路径下出现白屏。本地开发和手动 Vercel 构建使用根路径 `/`。

朗读使用浏览器自身的语音服务；是否有中文声音取决于设备。题目草稿仅保存在当前浏览器的 localStorage，浏览器清理数据后会丢失。

## 源码与换电脑

公开源码仓库：`https://github.com/shanelau068-a11y/little-math-lab`。

新电脑安装 Git 与 Node.js 24。查看或下载公开源码不需要登录 GitHub；向原仓库提交修改仍需拥有写入权限。

```powershell
git clone https://github.com/shanelau068-a11y/little-math-lab.git
cd little-math-lab
npm ci
npm run dev
```

访问 `http://localhost:5173/`，或在安装依赖后双击「启动数学实验室.bat」。这是静态网页，没有数据库，也不需要数据库迁移。

新电脑推送到 `main` 后，GitHub Pages 会自动发布，无需登录 Vercel。Vercel 登录凭据与 `.vercel/` 项目连接配置保留在本地。

换电脑前，如要保留网页中的题目草稿，先从原浏览器手动复制保存。浏览器 localStorage、登录凭据、原始错题照片、授权截图、依赖与构建产物都不随 GitHub 源码迁移。上传到本地 `uploads/` 或 `raw-questions/` 的照片需要自行另存。

在本地修改时，先拉取 GitHub 上的最新提交，再完成修改、检查、提交和推送；推送到 `main` 会自动更新 GitHub Pages。

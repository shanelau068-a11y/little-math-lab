import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  // GitHub 项目站点使用仓库子路径；本地和 Vercel 仍从根路径访问。
  base: process.env.GITHUB_PAGES === 'true' ? '/little-math-lab/' : '/',
});

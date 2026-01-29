# 部署到 GitHub Pages

這個專案可以免費部署到 GitHub Pages！

## 🚀 快速部署（推薦）

### 方法一：使用 gh-pages 套件（最簡單）

1. **安裝 gh-pages**
```bash
npm install -D gh-pages
```

2. **在 package.json 加入部署指令**
已為您加入以下指令：
```json
"deploy": "npm run build && gh-pages -d dist"
```

3. **執行部署**
```bash
npm run deploy
```

4. **設定 GitHub Pages**
- 前往 GitHub 儲存庫
- Settings → Pages
- Source 選擇 `gh-pages` 分支
- 完成！網站會在 `https://你的帳號.github.io/2048web/`

### 方法二：手動部署

1. **建置專案**
```bash
npm run build
```

2. **部署到 gh-pages 分支**
```bash
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
git checkout main
```

3. **啟用 GitHub Pages**
- GitHub 儲存庫 → Settings → Pages
- Source 選擇 `gh-pages` 分支
- 儲存

### 方法三：GitHub Actions 自動部署

已為您建立 `.github/workflows/deploy.yml`，每次推送到 main 分支時自動部署。

## 📝 注意事項

### 如果網站路徑不是根目錄

如果您的儲存庫名稱不是 `你的帳號.github.io`，需要設定 base path：

在 `vite.config.ts` 中加入：
```typescript
export default defineConfig({
  base: '/2048web/', // 改成您的儲存庫名稱
  // ...
})
```

然後重新建置：
```bash
npm run build
npm run deploy
```

## 🔗 訪問網站

部署完成後，您的網站會在：
- `https://你的帳號.github.io/2048web/`（如果儲存庫名稱是 2048web）
- `https://你的帳號.github.io/`（如果儲存庫名稱是 你的帳號.github.io）

## ⚡ 更新網站

每次修改後：
```bash
npm run deploy
```

就會自動建置並部署最新版本！

## 🎯 優點

- ✅ 完全免費
- ✅ 自動 HTTPS
- ✅ 全球 CDN 加速
- ✅ 支援自訂網域
- ✅ 無流量限制

## 疑難排解

### 問題：404 錯誤
確認 GitHub Pages 設定中的分支是 `gh-pages`

### 問題：CSS/JS 載入失敗
檢查 `vite.config.ts` 中的 `base` 設定

### 問題：部署後是舊版本
清除瀏覽器快取（Ctrl+Shift+R）

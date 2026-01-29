# 🚀 快速部署指南

## 最簡單的方式（給朋友）

### 方法 1：分享壓縮檔
1. 已為您建立 `2048-web.zip`
2. 分享這個檔案給朋友
3. 朋友解壓後，在資料夾中執行：
   ```bash
   python3 -m http.server 8000
   ```
4. 開啟 `http://localhost:8000/`

### 方法 2：本地預覽
```bash
npm run preview
```
開啟 `http://localhost:4173/`

## 部署到網路上（免費）

### Vercel（推薦）
```bash
npx vercel --prod
```
或直接在 [vercel.com](https://vercel.com) 上傳 `dist` 資料夾

### Netlify
拖曳 `dist` 資料夾到 [netlify.com](https://netlify.com)

### GitHub Pages
```bash
npx gh-pages -d dist
```

## 檔案位置
- 網頁版檔案：`dist/` 資料夾
- 壓縮檔：`2048-web.zip`（已建立）

詳細說明請見 [docs/deployment.md](docs/deployment.md)

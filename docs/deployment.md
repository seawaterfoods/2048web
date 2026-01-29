# 2048 網頁版部署指南

## 快速部署

網頁版已經建置在 `dist` 資料夾中，可以直接部署到任何靜態網站託管服務。

## 方法一：本地啟動（最簡單）

### 使用內建預覽伺服器
```bash
npm run preview
```
然後開啟 `http://localhost:4173/`

### 使用 Python（如果有安裝）
```bash
cd dist
python3 -m http.server 8000
```
然後開啟 `http://localhost:8000/`

### 使用 Node.js serve
```bash
npx serve dist
```

## 方法二：部署到雲端平台

### 1. Vercel（推薦，最簡單）
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

或直接在 [vercel.com](https://vercel.com) 上傳 `dist` 資料夾

### 2. Netlify
1. 前往 [netlify.com](https://netlify.com)
2. 拖曳 `dist` 資料夾到網頁上
3. 完成！

### 3. GitHub Pages
```bash
# 安裝 gh-pages
npm install -D gh-pages

# 部署
npx gh-pages -d dist
```

### 4. Cloudflare Pages
1. 前往 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 連接 GitHub 儲存庫
3. 建置命令：`npm run build`
4. 輸出目錄：`dist`

## 方法三：傳統網頁伺服器

### 直接複製檔案
將 `dist` 資料夾的所有內容複製到您的網頁伺服器：

```bash
# 複製到伺服器
scp -r dist/* user@your-server.com:/var/www/html/2048/

# 或使用 rsync
rsync -avz dist/ user@your-server.com:/var/www/html/2048/
```

### Nginx 配置範例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/2048;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 啟用 gzip 壓縮
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

### Apache 配置範例
在 `dist` 資料夾中建立 `.htaccess`：
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 方法四：Docker 部署

建立 `Dockerfile`：
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

執行：
```bash
docker build -t 2048-game .
docker run -p 8080:80 2048-game
```

## 分享給朋友

### 選項 1：壓縮 dist 資料夾
```bash
# 建立壓縮檔
cd /Users/joewu/AiProject/2048web
zip -r 2048-web.zip dist

# 分享 2048-web.zip
# 朋友解壓後，在 dist 資料夾中執行：
# python3 -m http.server 8000
```

### 選項 2：使用臨時分享服務
```bash
# 使用 ngrok（需先安裝）
npm run preview  # 在一個終端機
ngrok http 4173  # 在另一個終端機

# 會得到一個公開網址，可以分享給任何人
```

## 檔案大小

- **未壓縮**: ~1.5MB
- **Gzip 壓縮後**: ~340KB
- **載入速度**: 極快（單頁應用）

## PWA 功能

網頁版已包含 PWA 支援，使用者可以：
1. 在手機上「加入主畫面」
2. 離線遊玩
3. 獲得類似原生 App 的體驗

## 建置新版本

當您修改程式碼後，重新建置：
```bash
npm run build
```

新的檔案會在 `dist` 資料夾中，直接替換舊的即可。

## 疑難排解

### 問題：部署後頁面空白
- 檢查瀏覽器控制台是否有錯誤
- 確認所有檔案都已上傳
- 檢查 `base` 路徑設定（在 `vite.config.ts`）

### 問題：Service Worker 快取問題
```bash
# 清除快取
在瀏覽器中按 Ctrl+Shift+R (或 Cmd+Shift+R)
```

## 效能優化建議

1. **啟用 CDN**：使用 Cloudflare 或其他 CDN
2. **啟用 HTTP/2**：大部分現代伺服器預設支援
3. **設定快取標頭**：靜態資源可快取 1 年
4. **啟用 Brotli 壓縮**：比 gzip 更小

## 監控與分析

建議加入：
- Google Analytics
- Sentry（錯誤追蹤）
- Lighthouse（效能監控）

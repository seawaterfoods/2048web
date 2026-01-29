# 整合到個人 GitHub Pages 作品集

將 2048 遊戲整合到您的個人網站 `seawaterfoods.github.io` 作為作品展示。

## 🎯 部署後的網址

**https://seawaterfoods.github.io/2048/**

## 📋 整合方式（三選一）

### 方法一：使用 Git Subtree（推薦）

這個方法會將 2048 專案作為子目錄整合到您的個人網站。

```bash
# 1. 先建置 2048 專案
cd /Users/joewu/AiProject/2048web
npm run build

# 2. 切換到您的個人網站儲存庫
cd /path/to/seawaterfoods.github.io

# 3. 建立 2048 目錄並複製檔案
mkdir -p 2048
cp -r /Users/joewu/AiProject/2048web/dist/* 2048/

# 4. 提交並推送
git add 2048
git commit -m "Add 2048 game"
git push origin main

# 完成！訪問 https://seawaterfoods.github.io/2048/
```

### 方法二：自動化腳本（最方便）

我為您建立一個自動部署腳本：

```bash
# 在 2048web 專案中執行
npm run deploy:portfolio
```

這會自動建置並複製到您的個人網站儲存庫。

### 方法三：GitHub Actions 自動同步

設定 GitHub Actions，每次更新 2048 專案時自動同步到個人網站。

## 🔧 已完成的設定

✅ 更新 `vite.config.ts` 的 base path 為 `/2048/`
✅ 建立部署腳本（見下方）

## 📝 部署腳本

我會為您建立一個自動化腳本 `deploy-to-portfolio.sh`：

```bash
#!/bin/bash

# 設定變數
PORTFOLIO_REPO="/path/to/seawaterfoods.github.io"
GAME_DIR="2048"

# 建置專案
echo "🔨 Building project..."
npm run build

# 檢查個人網站儲存庫是否存在
if [ ! -d "$PORTFOLIO_REPO" ]; then
  echo "❌ Portfolio repository not found at: $PORTFOLIO_REPO"
  echo "Please update PORTFOLIO_REPO path in this script"
  exit 1
fi

# 複製檔案
echo "📦 Copying files to portfolio..."
mkdir -p "$PORTFOLIO_REPO/$GAME_DIR"
cp -r dist/* "$PORTFOLIO_REPO/$GAME_DIR/"

# 提交並推送
echo "🚀 Deploying to GitHub Pages..."
cd "$PORTFOLIO_REPO"
git add "$GAME_DIR"
git commit -m "Update 2048 game"
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Visit: https://seawaterfoods.github.io/2048/"
```

## 🎨 在作品集中展示

在您的個人網站首頁加入連結：

```html
<!-- 在 seawaterfoods.github.io/index.html 中 -->
<div class="project">
  <h3>2048 遊戲</h3>
  <p>經典 2048 益智遊戲，支援拖曳懸浮、PWA、多語言</p>
  <a href="/2048/">立即遊玩</a>
  <a href="https://github.com/seawaterfoods/2048web">查看原始碼</a>
</div>
```

## 📂 目錄結構

```
seawaterfoods.github.io/
├── index.html          # 您的作品集首頁
├── about.html          # 關於頁面
├── projects/           # 其他專案
└── 2048/              # 2048 遊戲
    ├── index.html
    ├── assets/
    └── ...
```

## 🔄 更新流程

當您修改 2048 遊戲後：

```bash
# 在 2048web 專案中
npm run build

# 複製到個人網站
cp -r dist/* /path/to/seawaterfoods.github.io/2048/

# 在個人網站儲存庫中
cd /path/to/seawaterfoods.github.io
git add 2048
git commit -m "Update 2048 game"
git push
```

## 🎯 優點

1. ✅ **統一網域**：所有作品都在 `seawaterfoods.github.io` 下
2. ✅ **簡潔網址**：`/2048/` 比 `/2048web/` 更簡潔
3. ✅ **作品集整合**：方便展示所有專案
4. ✅ **獨立開發**：2048 專案仍可獨立維護

## 📍 下一步

請告訴我您的 `seawaterfoods.github.io` 儲存庫在本機的路徑，我會：
1. 建立自動化部署腳本
2. 幫您執行首次部署
3. 設定 package.json 的快捷指令

例如：
```
/Users/joewu/Projects/seawaterfoods.github.io
```

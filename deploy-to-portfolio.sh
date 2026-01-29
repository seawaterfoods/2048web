#!/bin/bash

# 2048 遊戲自動部署到個人作品集腳本
# 使用方式: npm run deploy:portfolio

set -e

echo "🎮 2048 Game - Deploy to Portfolio"
echo "=================================="

# 設定路徑
PORTFOLIO_PATH="/Users/joewu/AiProject/seawaterfoods.github.io"
GAME_DIR="2048"

# 1. 建置專案
echo ""
echo "🔨 Building project..."
npm run build

# 2. 檢查個人網站儲存庫
if [ ! -d "$PORTFOLIO_PATH" ]; then
  echo "❌ Portfolio repository not found at: $PORTFOLIO_PATH"
  exit 1
fi

# 3. 複製檔案
echo "📦 Copying files to portfolio..."
mkdir -p "$PORTFOLIO_PATH/$GAME_DIR"
cp -r dist/* "$PORTFOLIO_PATH/$GAME_DIR/"

# 4. 提交並推送
echo "🚀 Deploying to GitHub Pages..."
cd "$PORTFOLIO_PATH"

git add "$GAME_DIR"

if git diff --staged --quiet; then
  echo "ℹ️  No changes to deploy"
else
  git commit -m "Update 2048 game - $(date '+%Y-%m-%d %H:%M:%S')"
  git push origin master
  echo ""
  echo "✅ Deployment complete!"
  echo "🌐 Visit: https://seawaterfoods.github.io/2048/"
fi

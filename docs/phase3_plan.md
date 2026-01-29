# 第三階段實作計畫：進階動畫與視覺層優化 - [已完成 COMPLETED]

## 目標 (Goal)
透過 Framer Motion 提升動畫品質，加入細緻的粒子特效，並實作主題切換功能，使遊戲更具現代感與個人化。

## 實作內容 (Implementation Details)

### 1. Framer Motion 整合
- 使用 `framer-motion` 取代 CSS Transition。
- 實作 `layout` 動畫，讓方塊移動具備自然彈簧物理效果 (Spring Physics)。
- 使用 `AnimatePresence` 處理方塊進入與消失的動畫。

### 2. 特效增強 (Merge Particle Effect)
- **粒子系統**：新增 `ParticleContainer` 元件，在方塊合併時產生噴濺效果。
- **得分動畫**：優化 `ScoreBoard`，得分時數字會向上飄移並放大淡出。

### 3. 主題切換 (Dark/Light Mode)
- **CSS 變數系統**：重構全域樣式，使用 CSS Variables (`--bg-color`, `--text-dark` 等) 管理主題色。
- **切換機制**：在 `Layout` 元件中實作主題切換邏輯，狀態持久化至 LocalStorage。

### 4. 行動裝置優化
- **Viewport 鎖定**：設定 `overscroll-behavior: contain` 與 `touch-action: none` 防止滑動干擾。
- **手勢精確度**：優化觸控手勢的回調處理。

## 驗證結果 (Verification)
- [x] 安裝並整合 `framer-motion` 庫。
- [x] 方塊移動動畫流暢，無錯位現象。
- [x] 主題切換後，文字與背景色對比度符合預期。
- [x] 行動裝置瀏覽器下拉不會觸發頁面重整。

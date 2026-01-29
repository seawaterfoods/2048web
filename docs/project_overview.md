# 2048 Web 專案概觀

這是一個使用 React + TypeScript + Vite 實作的 2048 網頁版遊戲。支援桌面瀏覽器、觸控操作，並包含多項進階功能。

## 已實作功能 (Features)

1.  **核心遊戲邏輯 (MVP)**
    - 方塊合併、移動、加分邏輯。
    - 4x4 遊戲盤面。
    - 遊戲勝負偵測 (達到 2048 獲勝，無法移動則失敗)。

2.  **進階功能 (Phase 2)**
    - **觸控操作 (Touch Support)**：支援手機與平板上的滑動手勢。
    - **進度儲存 (Persistence)**：遊戲自動儲存至 LocalStorage，重整頁面不遺失進度。
    - **回上一步 (Undo)**：支援紀錄最近 5 步的歷史紀錄。
    - **行動裝置與電腦版支援**：
        - PWA 支援：可安裝至手機主畫面。
        - **桌面應用程式 (Desktop App)**：提供 macOS (.dmg) 與 Windows (.exe) 執行檔。
    - **動畫效果**：方塊移動、合併與生成的平滑動畫。

3.  **視覺與版面優化 (Phase 3)**
    - **Framer Motion 動畫**：方塊移動具備彈簧物理效果。
    - **主題切換**：支援深色/淺色模式 (Dark/Light Mode)。
    - **粒子特效**：方塊合併時產生視覺噴濺。
    - **動態縮放系統**：使用 CSS 變數實作全動態縮放，解決各種解析度與縮放比例下的方塊對齊問題。
    - **Viewport 鎖定**：防止行動裝置下拉重整干擾遊戲。

4.  **自動操作 (Auto Play)**
    - 使用 Expectimax 演算法的 AI 自動玩遊戲功能。
    - 提供手動開關與即時演示。

5.  **多語系與操控優化 (Phase 4)**
    - **多語系支援**：支援 **繁體中文、英文、日文** 一鍵切換。
    - **畫面控制按鈕**：新增「上下左右」方向鍵，提供 PC 與行動裝置更直覺的操作方式。
    - **座標對齊修正**：解決了各種解析度下的方塊對齊偏移。
    - **狀態持久化**：使用自定義 React Context 實作，支援語系與遊戲狀態持久化。

## 專案結構

- `src/components/`: UI 元件 (Board, Tile, ScoreBoard, Layout 等)。
- `src/hooks/`: 狀態管理與邏輯 Hook (useGameLogic, useAutoPlay, useTouchGestures, useEventSubscription)。
- `src/utils/`: 純函式工具 (遊戲邏輯、AI 演算法、網格處理)。
- `src/styles/`: 全域樣式與 SCSS 變數。

## 專案文件 (Documentation)

詳細的開發細節與導覽請參考以下文件：

- [開發規劃書 (Development Plan)](development_plan.md)
- [遊戲功能導覽 (Game Walkthrough)](game_walkthrough.md)
- [第二階段功能實作計畫 (Phase 2 Plan)](phase2_plan.md)
- [第三階段功能實作計畫 (Phase 3 Plan)](phase3_plan.md)
- [自動操作功能導覽 (Auto Play Walkthrough)](autoplay_walkthrough.md)
- [開發日誌 (Changelog)](changelog.md)

- **React 19**
- **TypeScript**
- **SCSS (Modules)**
- **Vite**
- **Vite PWA Plugin**

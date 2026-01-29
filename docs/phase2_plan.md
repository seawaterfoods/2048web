# 第二階段實作計畫：功能擴充與優化 - [已完成 COMPLETED]

## 目標 (Goal)
增強 2048 遊戲的功能，加入行動裝置支援 (觸控手勢)、狀態持久化 (自動存檔) 以及復原 (Undo) 功能，以提升遊戲完整性與體驗。

## 需使用者審閱 (User Review Required)
無。這些是預期的功能擴充。

## 預計變更 (Proposed Changes)

### 1. 行動裝置支援 (觸控手勢)
 實作 `useTouchGestures` hook 來偵測滑動方向。
#### [新增] [src/hooks/useTouchGestures.ts](file:///Users/joewu/AiProject/2048web/src/hooks/useTouchGestures.ts)
 - 監聽 `touchstart`, `touchmove`, `touchend` 事件。
 - 計算向量差異 (Vector Difference)。
 - 若超過閾值 (Threshold) 則觸發回調。

#### [修改] [src/App.tsx](file:///Users/joewu/AiProject/2048web/src/App.tsx)
 - 整合 `useTouchGestures` 並呼叫 `move(direction)`。

### 2. 狀態持久化 (自動存檔)
 每次移動後自動將遊戲狀態儲存至 LocalStorage，載入頁面時自動回復。
#### [修改] [src/hooks/useGameLogic.ts](file:///Users/joewu/AiProject/2048web/src/hooks/useGameLogic.ts)
 - 更新 `initialState` 初始化邏輯，檢查 LocalStorage 中的 `2048-game-state`。
 - 新增 `useEffect`，當 `grid`, `score`, `status` 變更時寫入 LocalStorage。

### 3. 復原功能 (Undo)
 允許玩家回復上一步操作。
#### [修改] [src/types/index.ts](file:///Users/joewu/AiProject/2048web/src/types/index.ts)
 - 考慮在 `GameState` 中加入 `history` 堆疊。
 - 為了保持狀態乾淨，我們將在 `useReducer` 的狀態中管理歷史記錄，但不儲存過多的歷史以避免記憶體問題 (堆疊上限 5 層)。

#### [修改] [src/hooks/useGameLogic.ts](file:///Users/joewu/AiProject/2048web/src/hooks/useGameLogic.ts)
 - 新增 `UNDO` 動作類型 (Action Type)。
 - 在執行 `MOVE` 前，將當前 grid, score 推入歷史堆疊。
 - 在執行 `UNDO` 時，從堆疊彈出並回復狀態。

#### [修改] [src/components/Layout/Layout.tsx](file:///Users/joewu/AiProject/2048web/src/components/Layout/Layout.tsx)
 - 在「新遊戲」按鈕旁新增「復原 (Undo)」按鈕。

## 驗證計畫 (Verification Plan)

### 自動化測試
- `npm test` 確保現有邏輯未被破壞。
- 針對 `useGameLogic` reducer 的 undo 邏輯進行單元測試（若時間允許）。

### 手動驗證
1.  **觸控 (Touch)**: 使用 Chrome DevTools 行動模式，測試上/下/左/右滑動是否正常移動方塊。
2.  **持久化 (Persistence)**: 移動幾步後刷新頁面，確認棋盤與分數是否回復。
3.  **復原 (Undo)**: 移動一步後點擊 Undo，確認棋盤回復至上一步狀態，分數也隨之回復。

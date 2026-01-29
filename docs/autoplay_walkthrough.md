# 2048 自動操作功能 (Auto Play)

我已經成功實作了自動操作功能，讓 AI 可以自動玩這個遊戲。

## 功能說明

在遊戲介面上方，新增了一個 **"Auto Play"** 按鈕。
- 點擊按鈕後，AI 會接管遊戲控制。
- 再次點擊或遊戲結束時，自動操作會停止。
- 您可以隨時介入操作（雖然 AI 會很快地進行下一步）。
- **多語系支持**：按鈕文字會根據您選擇的語系（繁/EN/日）自動切換為 "自動操作" / "Auto Play" / "オートプレイ"。

## 技術細節

### 演算法 (Expectimax)
我使用了一種稱為 **Expectimax** 的演算法，這是一種常用於 2048 的 AI 策略。它不像傳統的 Minimax 假設對手會選擇最差的一步，而是考慮到隨機生成方塊（2 或 4）的機率。

### 啟發式評估 (Heuristics)
AI 使用以下指標來評分當前的盤面：
1.  **角落策略 (Corner Strategy)**：嘗試將最大的數字保持在角落。
2.  **單調性 (Monotonicity)**：保持數字按順序排列，方便合併。
3.  **平滑度 (Smoothness)**：相鄰方塊的數值差距越小越好。
4.  **空方塊數 (Empty Cells)**：保留越多空間越好。

### 效能
為了確保遊戲流暢，搜尋深度設定為 2-3 層，並且只對最有希望的步驟進行運算。

## 檔案變更
- **[App.tsx](../src/App.tsx)**: 整合 `useAutoPlay` Hook。
- **[Layout.tsx](../src/components/Layout/Layout.tsx)**: 新增 Auto Play 按鈕 UI。
- **[useAutoPlay.ts](../src/hooks/useAutoPlay.ts)**: 管理自動播放的狀態與計時器。
- **[ai.ts](../src/utils/ai.ts)**: 包含 Expectimax 演算法與評分邏輯。

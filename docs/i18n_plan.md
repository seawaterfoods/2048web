# 多語系支援實作計畫 (Multi-language Support Plan)

## 目標 (Goal)
為遊戲增加多語系支持（繁體中文、英文、日文），提升全球用戶的使用體驗。

## 實作內容 (Proposed Changes)

### 1. 翻譯字典與 Context 系統
- **[NEW] [LanguageContext.tsx](file:///Users/joewu/AiProject/2048web/src/contexts/LanguageContext.tsx)**: 
    - 定義支持的語言 (zh-TW, en, ja)。
    - 建立翻譯字典物件。
    - 實作 `LanguageProvider` 與 `useTranslation` Hook。
    - 將語言偏好儲存於 `localStorage`。

### 2. UI 調整
- **[修改] [Layout.tsx](file:///Users/joewu/AiProject/2048web/src/components/Layout/Layout.tsx)**:
    - 在 Header 中加入語言切換開關。
    - 使用翻譯後的標題與子標題。
- **[修改] [ScoreBoard.tsx](file:///Users/joewu/AiProject/2048web/src/components/ScoreBoard/ScoreBoard.tsx)**:
    - 翻譯 "SCORE" 與 "BEST" 標籤。

### 3. 字串對照表 (Sample)
| Key | English | 繁體中文 | 日本語 |
| :--- | :--- | :--- | :--- |
| title_sub | Join the numbers... | 合併數字以得到 2048！ | 2048を作るために数字を合体させよう！ |
| score | SCORE | 分數 | スコア |
| best | BEST | 最高分 | ベスト |
| undo | Undo | 復原 | 元に戻す |
| new_game | New Game | 新遊戲 | 新しいゲーム |
| auto_play | Auto Play | 自動操作 | オートプレイ |
| stop_auto | Stop Auto | 停止自動 | オート停止 |

## 驗證計畫 (Verification Plan)
- [ ] 確認切換語言後，所有介面文字立即更新且不需重新整理頁面。
- [ ] 確認語言狀態在重新整理後依然維持使用者的選擇。
- [ ] 檢查日文與中文在小螢幕上的排版是否正確（避免文字溢出）。

# 2048 小遊戲開發規劃書

## 1. 技術選型建議

### 核心技術棧選擇

為了構建一個現代、高效、可維護且易已成功實作基於瀏覽器的 2048 小遊戲。本專案從零開始，使用現代化前端技術棧構建，包含完整且經過測試的遊戲核心邏輯、流暢的動畫效果與響應式介面。**目前已完成第三階段的視覺全面優化。**
*   **視圖框架 (View Framework)**: **React**
*   **建置工具 (Build Tool)**: **Vite**
*   **樣式處理 (Styling)**: **SCSS (Sass) + CSS Modules**
*   **狀態管理 (State Management)**: **React Hooks (useReducer/Context)**
*   **測試框架 (Testing)**: **Vitest**

### 選型理由說明

#### 1. TypeScript
*   **型別安全 (Type Safety)**: 2048 涉及大量的矩陣運算、座標轉換與數值合併邏輯。TypeScript 的靜態型別檢查能在編譯階段捕捉 `undefined`、型別錯誤等常見問題，大幅降低執行時期錯誤。
*   **可維護性**: 定義明確的介面 (Interfaces)，如 `Grid`、`Tile`、`Vector`，能讓代碼結構自我文檔化，便於後續擴充（如增加 undo 功能或改變棋盤大小）。

#### 2. React
*   **聲明式 UI (Declarative UI)**: 遊戲畫面本質上是核心資料（4x4 矩陣）的視覺映射。React 的「UI = f(State)」模式非常適合處理這種狀態驅動的介面更新，避免手動操作 DOM 帶來的複雜度與效能問題。
*   **組件化**: 可將 `Board`（棋盤）、`Tile`（方塊）、`ScoreBoard`（記分板）拆分為獨立組件，便於管理與複用。
*   **虛擬 DOM**: 雖然 2048 畫面簡單，但 React 的 Diff 演算法能有效處理頻繁的畫面更新，且生態系豐富，支援豐富的動畫庫（如 Framer Motion）。

#### 3. Vite
*   **開發體驗**: 提供極快的熱更新 (HMR)，讓調整遊戲邏輯與樣式時能即時看到反饋。
*   **效能**: 採用原生 ES Modules，冷啟動速度遠快於 Webpack，適合現代前端開發。

#### 4. SCSS + CSS Modules
*   **樣式隔離**: CSS Modules 避免全域樣式污染，確保組件樣式獨立。
*   **功能強大**: SCSS 支援變數、巢狀與 Mixin，方便管理 2048 的動態顏色主題（不同數字對應不同顏色）與格線佈局邏輯。

#### 5. React Hooks (useReducer)
*   **複雜邏輯管理**: 2048 的核心邏輯（上下左右移動）屬於複雜的狀態轉移。`useReducer` 能將狀態更新邏輯（Action -> Reducer -> New State）與 UI 渲染分離，符合單一職責原則，且易於針對核心邏輯進行單元測試。

#### 6. Vitest
*   **邏輯驗證**: 遊戲核心算法（如合併規則、是否 Game Over）需要嚴謹的單元測試覆蓋。Vitest 與 Vite 整合良好，執行速度快，適合 TDD（測試驅動開發）流程。

## 2. 系統與模組架構設計

本專案將採用「MVC (Model-View-Controller) 變體」架構，將遊戲邏輯（Model）、畫面渲染（View）與使用者輸入（Controller）明確分離，確保各模組職責單一。

### 2.1 遊戲核心邏輯模組 (Model / Core)
此層級負責維護遊戲的純資料狀態，不依賴任何 UI 或瀏覽器 API，便於移植與測試。

*   **Grid Module (棋盤模組)**
    *   **資料結構**: 使用一維陣列 `Array(16)` 或二維陣列 `Array(4][4)` 儲存方塊狀態。每個單元格儲存 `Tile` 物件或 `null`。
    *   **職責**: 管理棋盤格子的佔用狀態、尋找空閒格子 (Available Cells)、邊界檢查。
*   **Tile Module (方塊模組)**
    *   **資料結構**: 包含 `id` (唯一識別碼，用於 React List Key)、`value` (數值)、`x, y` (座標)、`previousPosition` (用於動畫計算)。
    *   **職責**: 產生新方塊、處理方塊的合併狀態（`mergedFrom` 標記）。
*   **Game Engine (遊戲引擎)**
    *   **核心算法**:
        *   `move(direction)`: 執行移動邏輯。
        *   `merge()`: 處理相同數值方塊的結合。
        *   `spawnTile()`: 在隨機空位產生 2 或 4。
    *   **狀態判斷**:
        *   `isGameTerminated()`: 檢查是否無空位且無可合併方塊。
        *   `isGameWon()`: 檢查是否出現 2048。

### 2.2 UI / Rendering 模組 (View)
負責將核心邏輯的狀態視覺化，只讀取 State，不直接修改 State。

*   **Board Component (棋盤組件)**: 繪製 4x4 的背景網格。
*   **TileContainer Component (方塊容器)**: 根據 `Tile` 的座標與狀態，渲染動態方塊層。負責處理移動與合併的 CSS 動畫過渡。
*   **Overlay Component (遮罩層)**: 顯示 Game Over 或 You Win 訊息，以及「重新開始」按鈕。
*   **Header Component**: 顯示當前分數、最高分與遊戲標題。

### 2.3 使用者輸入處理 (Controller / Input)
負責監聽外部輸入並轉換為遊戲指令。

*   **Input Manager**:
    *   監聽 `keydown` 事件（Arrow keys, WASD）。
    *   (擴充預留) 監聽 `touchstart`, `touchmove`, `touchend` 處理滑動手勢。
    *   **防抖動 (Debounce/Throttle)**: 防止使用者快速連按導致動畫錯位或邏輯錯誤（視過渡效果需求調整）。
    *   將原始輸入轉換為統一的 `Direction`列舉 (`UP`, `DOWN`, `LEFT`, `RIGHT`) 並發送給 Game Engine。

### 2.4 資料流架構 (Data Flow)

採用單向資料流 (Unidirectional Data Flow)：

1.  **Input**: 使用者按下鍵盤 → `InputManager` 捕捉。
2.  **Action**: 觸發 `MOVE_LEFT` Action。
3.  **Reducer**: `GameReducer` 呼叫核心算法，計算移動後的新棋盤狀態、分數變化、是否有方塊合併。
4.  **State Update**: React State 更新 (`board`, `score`, `status`)。
5.  **Render**: UI 根據新 State 重新渲染，CSS Transition 處理位置變化的補間動畫。

## 3. 遊戲流程說明

### 3.1 遊戲初始化流程 (Initialization)

當使用者載入頁面或點擊「重新開始」時，系統將執行以下初始化步驟：

1.  **重置狀態**:
    *   清除棋盤所有方塊 (Clear Grid)。
    *   重置分數 (Score = 0)。
    *   重置遊戲狀態 (Game Status = PLAYING)。
    *   (可選) 讀取本地端最高分紀錄 (LocalStorage)。

2.  **初始生成**:
    *   呼叫 `spawnTile()` 兩次，在 4x4 的隨機空位生成 2 個初始方塊（數值通常為 2，有 10% 機率為 4）。

3.  **首次渲染**:
    *   React 根據初始狀態渲染背景網格與這兩個新生成的方塊。
    *   顯示初始分數與控制面板。

### 3.2 遊戲核心循環 (Game Loop: Input → Update → Render)

這是遊戲運行的主要生命週期，完全由使用者操作觸發：

#### 步驟 1: 使用者操作 (User Action)
*   使用者按下方向鍵 (例如：**向上 ArrowUp**)。
*   **InputManager**: 攔截事件，阻止瀏覽器預設滾動行為 (`e.preventDefault()`)。
*   將事件轉換為 `MOVE_UP` Action 派發給 `useReducer`。

#### 步驟 2: 狀態計算 (State Update)
*   **Grid Module**: 接收到移動指令，依序執行：
    1.  **複製狀態**: 建立當前棋盤的深拷貝，確保 React 不可變性 (Immutability)，並記錄每個 Tile 的 `previousPosition` 用於動畫。
    2.  **移動運算**: 針對每一列（或行），將方塊向指定方向推移，移除中間空隙。
    3.  **合併運算**: 檢查相鄰且數值相同的方塊。若符合合併條件：
        *   將被合併方塊標記為「待刪除」。
        *   生成一個數值翻倍的新方塊（例如 2+2=4）。
        *   增加當前分數 (Score += 合併數值)。
        *   設置 `mergedFrom` 屬性指向來源方塊，讓 UI 知道此方塊是由哪兩個合併而來（用於播放 "Pop" 合併動畫）。
    4.  **變更檢查**: 比對移動前後的棋盤。若**完全無變化**（所有方塊皆受阻），則不進行後續步驟（不生成新方塊、不重繪動畫），直接結束此回合。
    5.  **生成新方塊**: 若棋盤有變動，則在隨機空位生成一個新方塊 (2 或 4)。
    6.  **遊戲結束判斷**:
        *   檢查是否達成 2048 (Win)。
        *   檢查是否棋盤已滿且無法再進行任何合併 (Lose)。
        *   更新 `Game Status`。

#### 步驟 3: 畫面重繪 (Render & Animation)
*   **React Re-render**: 收到新的 `grid` 與 `score` 狀態。
*   **CSS Transition**:
    *   `Tile` 組件偵測到座標 (x, y) 改變，觸發 CSS `transform: translate(...)` 位移動畫。
    *   新生成的方塊觸發 `scale(0) -> scale(1)` 出現動畫。
    *   合併產生的方塊觸發 `scale(1.2) -> scale(1)` 彈跳 (Pop) 動畫。
*   **狀態同步**: 動畫結束後（通常透過 CSS transition-duration 設定，如 100ms），UI 視覺位置與邏輯位置一致，等待下一次輸入。

## 4. MVP 功能範圍定義

本階段以「最小可行性產品 (MVP)」優先，專注於完成核心玩法閉環，暫不考量複雜的動畫特效與週邊功能。

### 4.1 核心操作與移動規則
*   **支援按鍵**:
    *   方向鍵 (ArrowUp, ArrowDown, ArrowLeft, ArrowRight)
    *   WASD 鍵
*   **邊界阻擋**: 方塊移動至邊界時應停止。
*   **滑動邏輯**:
    *   所有方塊必須同時向指定方向滑動至最遠可達位置。
    *   若單次移動中有多次合併機會，優先處理**移動方向上最先遇到**的方塊 (例如 `[2, 2, 2, 2]` 向左移應變為 `[4, 4, 0, 0]` 而非 `[4, 2, 2, 0]` 或 `[8, 0, 0, 0]`)。
    *   **單次合併限制**: 同一回合內，每個方塊最多只能參與一次合併。

### 4.2 數值與合併規則
*   **基本合併**: 兩個相同數值 `N` 合併產生 `2N`。
*   **生成規則**:
    *   每次有效移動後，在空閒格隨機生成一個新方塊。
    *   數值權重：**90% 機率生成 2，10% 機率生成 4**。
*   **分數計算**:
    *   每次合併發生時，`Score = Score + 新方塊數值`。
    *   單純移動不增加分數。

### 4.3 遊戲狀態判斷 (Game Over / Win)
*   **Victory (勝利)**:
    *   當棋盤上出現數值為 **2048** 的方塊時，觸發勝利狀態。
    *   **MVP 處理**: 彈出提示視窗，並允許玩家選擇「繼續遊戲 (Keep Playing)」(進入 Endless Mode) 或「重新開始」。
*   **Defeat (失敗)**:
    *   觸發條件 (AND 邏輯):
        1.  棋盤 16 格全滿。
        2.  水平方向無相鄰相同數字。
        3.  垂直方向無相鄰相同數字。
    *   **MVP 處理**: 顯示 "Game Over" 遮罩層與最終分數，僅提供「重新開始」按鈕。

### 4.4 UI 基礎需求 (MVP)
*   **RWD**: 支援 400px ~ 600px 寬度的容器自適應，確保在不同螢幕解析度下的桌機瀏覽器可見。
*   **色彩系統**: 需為 2, 4, 8 ... 2048 定義區分度高的背景色與文字色 (參考原版配色)。
*   **動畫**:
    *   **必要**: 移動時的平滑位移 (Transition)。
    *   **非必要 (可後續補)**: 合併時的 Pop 效果、生成時的 Zoom-in。

## 5. 專案目錄結構建議

### 5.1 目錄結構樹 (Directory Tree)

建議採用「功能導向 (Feature-based)」與「類型導向 (Type-based)」混合的結構，將通用元件與業務邏輯分開。

```
src/
├── assets/                 # 靜態資源 (如有圖片、字型)
├── components/             # UI 元件 (View Layer)
│   ├── Board/              # 棋盤相關
│   │   ├── Board.tsx
│   │   └── Board.module.scss
│   ├── Tile/               # 方塊相關
│   │   ├── Tile.tsx
│   │   └── Tile.module.scss
│   ├── GameOverlay/        # 遊戲結束/選單遮罩
│   │   └── GameOverlay.tsx
│   ├── ScoreBoard/         # 分數顯示
│   │   └── ScoreBoard.tsx
│   └── Layout/             # 全局佈局容器
│       └── Layout.tsx
├── hooks/                  # Custom Hooks (Logic Layer)
│   ├── useGameLogic.ts     # 整合遊戲主迴圈
│   └── useEventSubscription.ts # 鍵盤事件監聽
├── styles/                 # 全局樣式
│   ├── _variables.scss     # 色票、尺寸變數
│   ├── _mixins.scss        # RWD 斷點、字型設定
│   └── main.scss           # 全局重置與基礎設定
├── types/                  # TypeScript 型別定義
│   └── index.ts            # Grid, Tile, Direction 等介面
├── utils/                  # 純函數工具 (Core Algorithm)
│   ├── grid.ts             # 矩陣操作、空位搜尋
│   ├── tile.ts             # 方塊生成、合併判斷
│   └── storage.ts          # LocalStorage 存取封裝
├── App.tsx                 # 根組件
└── main.tsx                # 入口點
```

### 5.2 模組職責詳解

1.  **`src/utils/` (Core Logic)**
    *   此目錄存放「不含 React 依賴」的純 TypeScript 函數。
    *   這是核心商業邏輯，**必須**包含完整的單元測試 (.test.ts)。
    *   例如 `moveGrid(grid, direction)` 函數應在此實作，輸入舊 Grid，回傳新 Grid 與分數變化。

2.  **`src/hooks/` (State Binding)**
    *   負責將 `utils` 的邏輯綁定到 React State。
    *   `useGameLogic` 內部使用 `useReducer` 管理 `grid` 和 `score` 狀態。
    *   處理副作用 (Side Effects)，如監聽鍵盤事件、寫入 LocalStorage。

3.  **`src/components/` (Presentation)**
    *   傻瓜組件 (Dumb Components)，只透過 Props 接收資料並渲染。
    *   樣式透過 CSS Modules (`*.module.scss`) 引入，確保樣式不衝突。

4.  **`src/styles/` (Theme System)**
    *   為了方便調整「數字顏色」與「棋盤尺寸」，應將相關數值提取為 SCSS 變數 (`$tile-2-bg`, `$tile-4-bg`, `$grid-gap`)。

## 6. 已實作之功能擴充 (Implemented Extensions)

本專案已完成以下進階功能的開發，顯著提升了遊戲的完整度與玩家體驗。

### 6.1 行動裝置支援與觸控手勢
*   **Touch Events**: 實作了 `useTouchGestures` Hook，透過計算 `touchstart` 與 `touchend` 的座標差異來偵測滑動手勢。
*   **介面優化**: 針對行動裝置微調了格子尺寸與間距，並在 `index.html` 中加入了適當的 Viewport 設定，防止不必要的頁面捲動與縮放。

### 6.2 狀態持久化 (Persistence)
*   **LocalStorage 自動存檔**: 每一次移動後，系統會自動將目前的 `grid`、`score` 與遊戲狀態序列化為 JSON 並儲存至瀏覽器的 LocalStorage 中。
*   **無縫回復**: 使用者重新開啟頁面時，`useGameLogic` 會自動載入存檔，讓玩家可以接續進度。

### 6.3 復原功能 (Undo)
*   **歷史紀錄堆疊**: 在 `GameState` 中維護了一個最近 5 步的 `history` 陣列。
*   **狀態回退**: 每次執行有效移動前，會將目前狀態推入堆疊。玩家點擊 Undo 時，則從堆疊中彈出最上層狀態並套用。

### 6.4 PWA 支援
*   **離線遊玩**: 透過 `vite-plugin-pwa` 產生 Service Worker，實現資源快取與離線存取。
*   **可安裝性**: 提供完整 Manifest 檔案與適配不同解析度的應用程式圖示，讓使用者可將遊戲安裝至手機主畫面。

### 6.5 核心動畫優化
*   **Pop & Appear**: 針對方塊生成與合併使用了 CSS 動畫進行增強。
*   **Score Float**: 實作了得分時數字向上飄移淡出的視覺效果。

### 6.6 進階動畫與視覺層優化 (Phase 3)
*   **Framer Motion 整合**: 使用 `framer-motion` 實現了自然的彈簧物理效果，取代了純 CSS Transition。
*   **合併粒子特效**: 實作了隨機角度噴濺的粒子效果，增強方塊合併的視覺打擊感。
*   **主題系統**: 透過 CSS Variables 實作了 Dark Mode 支援，允許玩家自訂視覺風格。
*   **行動裝置 Viewport 鎖定**: 解決了滑動時觸發下拉重整的問題。

## 7. AI 自動操作實作 (Auto Play Implementation)

為了解決 2048 高難度的挑戰並展示演算法能力，本專案實作了內建的 AI 自動操作功能。

### 7.1 演算法選擇：Expectimax
相對於傳統的 Minimax（假設對手會選擇最差步驟），Expectimax 更適合包含「機率要素」的遊戲。
*   **隨機性考量**: AI 在預測時會考慮隨機格子產生 2 (90%) 或 4 (10%) 的期望值。
*   **搜尋深度**: 設定為 2~3 層，在效能與決策品質間取得平衡。

### 7.2 評分啟發式 (Heuristics)
AI 根據以下四個核心指標評估局面優劣：
1.  **單調性 (Monotonicity)**: 確保數字按一定的方向（如左下至右上）遞增/遞減，方便連鎖合併。
2.  **平滑度 (Smoothness)**: 減少相鄰方塊間的數值跳動，數值越接近則分數越高。
3.  **角落策略 (Corner)**: 強力驅使最大數字停留在角落（通常是左上角）。
4.  **空位權重 (Empty Cells)**: 保留更多的格子意味著更大的靈活性，因此空位置越多則分數加成越高。

### 7.3 實作機制
*   **`ai.ts`**: 純邏輯計算核心，遞迴計算每一步的潛在分數。
*   **`useAutoPlay` Hook**: 管理定時器與 AI 執行週期，確保在每步之間有 100ms 的視覺延遲，方便使用者觀察。

## 8. 多語系與版面對齊優化 (Phase 4)

為了解決跨平台顯示差異與全球化需求，本專案進行了一次重大的架構重構。

### 8.1 座標系重構與動態縮放
*   **CSS Variable System**: 引入了 `--grid-size`, `--tile-size`, `--grid-padding` 等動態變數，基於 `min(500px, 100vw - 40px)` 進行即時計算。
*   **解決偏移問題**: 透過共用座標容器，確保方塊 (Tile) 層與背景網格 (Grid) 層完全重合，解決了在高解析度或螢幕縮放時出現的「對齊偏移」問題。

### 8.2 多語系架構與操控優化
*   **LanguageProvider**: 使用 React Context 實作，支援 **繁體中文、英文、日文**。
*   **同步切換**: UI 同時呈現所有語系按鈕，點擊後立即更新全站文字。
*   **畫面控制按鍵 (Control Pad)**：針對 PC 滑鼠用戶與習慣按鈕的行動端用戶，新增了實體方向鍵組件，提供除了鍵盤與手勢之外的第三種操控選擇。

## 9. 安裝與部署指南

### 9.1 手機安裝 (PWA)
1.  **環境準備**: 電腦端執行 `npm run preview:host`。
2.  **掃描/連線**: 手機與電腦連至同 Wi-Fi，在手機瀏覽器開啟電腦顯示的網路 URL。
3.  **加入主畫面**: 
    *   **iOS**: 使用 Safari，點擊「分享」->「加入主畫面」。
    *   **Android**: 使用 Chrome，點擊「...」->「安裝應用程式」。

### 9.2 本地開發
1.  安裝依賴: `npm install`
2.  啟動開發服務: `npm run dev`
3.  執行測試: `npm test`



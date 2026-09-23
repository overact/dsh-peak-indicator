# dsh-peak-indicator (DeepSeek 高峰/平峰时段提示器)

[English](./README.md) | 中文 (Chinese)

**DeepSeek Harness (DSH) Web GUI 官方峰谷分时时段提示器**：实时显示 DeepSeek 官方 API 高峰与平峰时段状态、秒级切换倒计时、多时区智能转换、24 小时全景可视化时段轴与官方最新价格对照表（V4.1 计费规则）。

---

## 📖 背景与设计目的

根据 DeepSeek 官方于 **2026 年 9 月 10 日 12:00（北京时间）** 起实行的分时定价政策及 **2026 年 9 月 19 日**发布的《DeepSeek API 峰谷时间说明》：
- **业务高峰时段（Peak Hours）**：每周一至周五（法定节假日除外）**`09:00~12:00`** 与 **`14:00~18:00`**（北京时间 UTC+8），按官方标准价计费。
- **空闲平峰时段（Off-Peak Hours）**：工作日其余时段、**周六日全天**、**中国法定节假日全天**以及**调休上班的周末全天**，缓存命中、未命中输入与模型输出全部享受 **5 折（50% 半价）** 优惠。
- **核心模型支持**：覆盖 `DeepSeek-V4.1-Flash` 与 `DeepSeek-V4-Pro` 旗舰模型，均支持分时 5 折优惠（Pro 模型独立计费）。

本插件为 DSH Web GUI 原生打造，旨在帮助开发者与团队在使用 Agent 进行高频对话、批量长任务（如代码审计、架构重构、批处理）时，实时掌握当前费率窗口，合理避峰省费。

---

## 📸 插件界面效果预览

### 1. 顶栏原生指示器与全局悬浮胶囊效果
![顶栏与悬浮胶囊效果图](./assets/preview-header.svg)

### 2. 24 小时全景时间轴、官方分时价格对照表与快捷设置面板
<p align="center">
  <img src="./assets/preview-modal.svg" alt="全景详情弹窗效果图" width="600"/>
</p>

---

## 🌟 核心特性

1. **精炼排版与优雅显示 (Concise Typography)**：
   - 英文状态：**`Peak Rate`** 与 **`Off-Peak`**。
   - 中文状态：**`高峰价`** 与 **`平峰`**。
   - 严格控制宽度与排版行距，与会话标题、模型切换器及额度 Chip 自然对齐。

2. **会话顶栏原生集成（零遮挡、零穿透）**：
   - 原生注册于 `conversation.session.header.actions` 插槽（Order `35`），紧邻额度 Chip 右侧，严格保持在 Session Log 与导出按钮的左侧。
   - 遵循 Flexbox 标准文档流，不遮挡任何既有按钮。
   - 提供可选的全局悬浮胶囊模式（支持右上、左上、居中停靠）。

3. **精准的 DeepSeek 官方定价规则 (V4.1 & 2026-09-19 节假日新规)**：
   - **高峰窗口**：仅在正常工作日（周一至周五，法定节假日除外）`09:00~12:00` 与 `14:00~18:00`（北京时间）。
   - **平峰窗口**：工作日其余时段、周末全天、中国法定节假日全天及调休上班日全天均享 5 折半价。
   - **双核心模型支持**：完整展示 `DeepSeek-V4.1-Flash`（V4.1 F）与 `DeepSeek-V4-Pro` 最新分档阶梯单价，两者独立计费。

4. **多时区自动识别与双时钟对照**：
   - 自动探测浏览器本地时区（如 `America/New_York`、`Europe/London`、`Asia/Tokyo`）及 UTC 偏移。
   - 实时双时钟展示**本地时间**与**北京时间**，并将下一次时段切换自动换算为本地时刻。

5. **秒级实时倒计时与紧凑模式**：
   - 顶栏默认紧凑模式显示高亮状态图标与秒级切换倒计时。
   - 动态更新距离下一轮时段切换的剩余时间（如 `距平峰还剩 01:24:10` / `距高峰还剩 03:00:00`）。

6. **24 小时全景时间轴 (Timeline Visualizer)**：
   - 点击指示器即可展开全景详情卡片。
   - 24 小时色块分段对齐（🟢 绿色代表平峰半价，🟠 橙色代表高峰价格），实时游标指示当前北京时间进度。
   - 支持鼠标悬浮或键盘聚焦查看任意分段的具体起止时间。

7. **原生国际化支持 (DSH i18n)**：
   - 接入 DSH 原生 `ctx.locale`（命名空间 `dsh-peak-indicator`）。
   - 语言跟随 DSH 系统设置自动切换，支持中英双语无刷新热重载。

8. **侧边栏边缘快捷入口**：
   - 在左侧栏底部操作区（`sidebar.footer.action`，Order `1000`）右边缘嵌入彩色状态圆点，点击同样可展开全景详情。

---

## 📊 DeepSeek 官方 API 定价对照表 (V4.1)

| 适用模型 | 基础输入 / 未命中<br>*(平峰 / 高峰)* | 缓存命中输入<br>*(平峰 / 高峰)* | 模型输出<br>*(平峰 / 高峰)* |
| :--- | :---: | :---: | :---: |
| **DeepSeek-V4.1-Flash (V4.1 F)** | **¥1.00** / ¥2.00 | **¥0.02** / ¥0.04 | **¥4.00** / ¥8.00 |
| **DeepSeek-V4-Pro** | **¥4.50** / ¥9.00 | **¥0.15** / ¥0.30 | **¥13.50** / ¥27.00 |

*注：*
1. *DeepSeek-V4-Pro 独立计费（不再自动路由至 Flash），与 V4.1 Flash 均享峰谷分时优惠。*
2. *价格单位为人民币（元）/ 百万 tokens。官方计费文档见 [api-docs.deepseek.com/pricing](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)。*

---

## 🚀 安装与配置

### 1. 配置 Profile 依赖（`~/.dsh/profiles/web/package.json`）
```json
{
  "dependencies": {
    "dsh-peak-indicator": "link:/path/to/dsh-peak-indicator"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "dsh-peak-indicator"
      ]
    }
  }
}
```

### 2. 自动挂载
插件自带 bundle patch 声明，启动时由 DSH Profile Loader 自动加载，无需手动编写 patch 规则。

---

## 📄 开源许可

MIT License.

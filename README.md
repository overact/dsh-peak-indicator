# dsh-peak-indicator

English | [中文 (Chinese)](./README.zh-CN.md)

**DeepSeek Peak / Off-Peak Time Banner & Indicator for DSH Web GUI**: Real-time status chip, live countdown, multi-timezone auto-conversion, 24-hour visual schedule timeline, and official DeepSeek V4 API pricing table.

---

## 📖 Overview

Following DeepSeek API's new dynamic pricing policy effective **August 17, 2026 00:00 (Beijing Time / UTC+8)**, API requests during peak hours are billed at regular rates, while off-peak hours enjoy a **50% discount (half price)** across cache-hit input, cache-miss input, and output tokens.

**`dsh-peak-indicator`** integrates seamlessly into the DeepSeek Harness (DSH) Web GUI to give developers and teams instantaneous awareness of current pricing windows, countdowns to the next schedule switch, and transparent cost references.

---

## 🌟 Key Features

1. **Concise & Non-Intrusive Typography**:
   - **English labels**: `Peak Rate` & `Off-Peak 50%`.
   - **Chinese labels**: `高峰价` & `平峰 5折`.
   - Balanced compact width that aligns gracefully with session titles, model selectors, and token quota chips.

2. **Native Session Header Docking (Zero Overlay Conflict)**:
   - Registers via `conversation.session.header.actions` slot at order `35` (immediately adjacent to the quota chip, safely positioned to the left of the Session Log export button).
   - Participates in standard flexbox flow layout with zero element overlap.
   - Optional global floating pill mode (`top-right`, `top-left`, `top-center`).

3. **Accurate DeepSeek V4 Peak & Off-Peak Schedule Rules**:
   - **Peak Windows**: Daily **`09:00~12:00`** & **`14:00~18:00`** (Beijing Time / UTC+8).
   - **Off-Peak Windows**: Remaining 17 hours (`00:00~09:00`, `12:00~14:00`, `18:00~24:00`), where all tokens are discounted by 50%.
   - **Focus on V4 Flagship Models**: Comprehensive pricing table covering `DeepSeek-V4-Flash-0731` and `DeepSeek-V4-Pro-0813`.

4. **Multi-Timezone Auto-Detection & Dual Clocks**:
   - Automatically detects user browser local timezone and UTC offset.
   - Concurrently displays **Local Time** and **Beijing Time (UTC+8)**, automatically converting schedule switches to the user's local wall clock.

5. **Live Per-Second Countdown**:
   - Live ticker displaying the remaining duration until the next schedule transition (e.g., `To Peak in 02:28:15` / `To Off-Peak in 01:14:02`).

6. **Interactive 24-Hour Visual Schedule Timeline**:
   - Click the indicator chip to open a details modal.
   - View a full 24-hour visual bar with color-coded segments (🟢 Green for Off-Peak, 🟠 Orange for Peak) and a real-time cursor showing current progress through the day.
   - Hover over segments or the cursor pin for precise time ranges.

7. **Native DSH Internationalization (i18n)**:
   - Registers dictionary via `ctx.locale` (`dsh-peak-indicator`).
   - Automatically follows DSH system language preferences with live hot-switching support.

8. **Sidebar Footer Quick-Access Action**:
   - Mounts a status dot at the right edge of the sidebar footer (`sidebar.footer.action`, order `1000`) without disturbing existing action buttons.

---

## 📊 DeepSeek V4 Official Pricing Reference

| Model Name | Cache Hit (Off-Peak / Peak) | Cache Miss (Off-Peak / Peak) | Output (Off-Peak / Peak) |
| :--- | :---: | :---: | :---: |
| **DeepSeek-V4-Flash** | **¥0.05** / ¥0.10 | **¥1.50** / ¥3.00 | **¥4.50** / ¥9.00 |
| **DeepSeek-V4-Pro** | **¥0.15** / ¥0.30 | **¥4.50** / ¥9.00 | **¥13.50** / ¥27.00 |

*Prices in CNY (¥) per 1 Million Tokens.*

---

## 🚀 Installation & Profile Configuration

### 1. In `~/.dsh/profiles/web/package.json`
Add the dependency:
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

### 2. Auto-Mounting via `cordis.patch.yml`
The plugin provides its own bundle patch declaration, which is automatically merged into the profile roster upon launch.

---

## 📄 License

MIT License.

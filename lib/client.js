window.__ModuleLoader__.load({
  id: 'dsh-peak-indicator',
  factory: function (require) {
    'use strict'
    var module = { exports: {} }
    var exports = module.exports
    var React = require('react')

    // =========================================================================
    // 1. Constants & i18n Dictionaries (100% Pure, Zero-Mixed Localization)
    // =========================================================================

    var STORAGE_KEY = 'dsh.dsPeakIndicator.v1'

    var DEFAULT_SETTINGS = {
      ruleType: 'v4_peak', // 'v4_peak' (09-12, 14-18 高峰，其余空闲半价) | 'custom'
      showInHeader: true, // Show in session header actions (right of quota)
      displayStyle: 'compact', // 'icon_only' | 'compact' | 'full'
      floatingMode: 'none', // 'none' (default, header/sidebar only) | 'right' | 'left' | 'center'
      showCountdown: true,
      showDualTime: true,
      notifyOnSwitch: false,
      customStartHour: 9,
      customStartMin: 0,
      customEndHour: 18,
      customEndMin: 0,
    }

    var I18N = {
      zh: {
        pluginName: 'DeepSeek 高峰/平峰定价指示器',
        ruleTypeLabel: '时段判定规则',
        ruleV4Peak: 'DeepSeek V4 官方时段 (高峰 09~12 / 14~18，其余平峰 5 折)',
        ruleCustom: '自定义高峰时段',

        // V4 Peak Rule Strings
        offPeakStatus_v4: 'DeepSeek 官方平峰 · 5 折优惠',
        offPeakSub_v4: '当前按平峰优惠价格计费，全量输入与输出均为高峰价的 50%',
        offPeakShort_v4: '平峰 5 折',
        offPeakIconOnly_v4: '平峰',
        peakStatus_v4: 'DeepSeek 官方高峰价格',
        peakSub_v4: '高峰窗口：09:00~12:00 与 14:00~18:00（北京时间）',
        peakShort_v4: '高峰价',
        peakIconOnly_v4: '高峰',
        countdownToPeak_v4: '距高峰还剩',
        countdownToOffPeak_v4: '距平峰还剩',

        rate1x: '平峰 5 折',
        rate2x: '高峰价格',

        localTime: '本地时间',
        beijingTime: '北京时间 (UTC+8)',
        utcTime: '世界协调时 (UTC)',
        timeZone: '时区',
        detailsTitle: 'DeepSeek V4 高峰/平峰时段与定价说明',
        timelineTitle: '24 小时全景时段分布 (北京时间)',
        timelineOffPeakDesc_v4: '平峰时段 (00:00~09:00, 12:00~14:00, 18:00~24:00) 享 5 折半价',
        timelinePeakDesc_v4: '高峰时段 (09:00~12:00, 14:00~18:00) 执行官方标准价',
        timelineOffPeakHover: '平峰 5 折 · {start}–{end}（北京时间）',
        timelinePeakHover: '高峰价 · {start}–{end}（北京时间）',
        timelineCurrentHover: '当前北京时间 {time} · {status}',
        beijingTzSub: 'DeepSeek 官方服务器时区 (东八区)',
        localConvertedOffPeak: '换算为本地平峰时段',
        localConvertedPeak: '换算为本地高峰时段',
        currentCursor: '当前时刻',
        timezoneTitle: '多时区实时对照',
        detectedTimezone: '本地识别时区',
        nextSwitchLabel: '下次时段切换',
        nextSwitchDetail: '将于本地时间 {time} 切换为【{target}】',

        pricingTitle: 'DeepSeek V4 官方 API 定价表',
        pricingOfficialSource: '官方文档来源：https://api-docs.deepseek.com/zh-cn/quick_start/pricing',
        pricingUnitNote: '单位：元 / 百万 tokens',
        pricingEffective: '计费规则于 2026-08-17 00:00（北京时间）起生效：',
        pricingRule1: '高峰时段：每日 09:00~12:00 与 14:00~18:00（北京时间）。',
        pricingRule2: '平峰时段：其余 17 个小时，缓存命中、未命中输入与模型输出全部 5 折。',
        pricingRule3: '适用模型：DeepSeek-V4-Flash-0731 与 DeepSeek-V4-Pro-0813。',
        modelCol: '模型名称',
        inputHitCol: '缓存命中 (平峰 / 高峰)',
        inputMissCol: '未命中输入 (平峰 / 高峰)',
        outputCol: '模型输出 (平峰 / 高峰)',

        flashHitPrice: '¥0.05 / ¥0.10',
        flashMissPrice: '¥1.50 / ¥3.00',
        flashOutPrice: '¥4.50 / ¥9.00',

        proHitPrice: '¥0.15 / ¥0.30',
        proMissPrice: '¥4.50 / ¥9.00',
        proOutPrice: '¥13.50 / ¥27.00',

        displayStyleLabel: '顶栏显示样式',
        styleIconOnly: '仅圆点图标 (极简)',
        styleCompact: '圆点 + 状态 (吸附在额度右侧)',
        styleFull: '完整模式 (带实时倒计时)',

        settingsTitle: '指示器显示与停靠设置',
        optShowInHeader: '在会话顶栏集成 (吸附在周额度右侧，不遮挡任何内容)',
        optFloatingMode: '全局悬浮胶囊位置',
        posNone: '关闭悬浮 (仅在顶栏与侧边栏显示)',
        posRight: '右上角悬浮',
        posLeft: '左上角悬浮',
        posCenter: '顶部居中悬浮',
        optCountdown: '显示秒级倒计时',
        optDualTime: '显示本地与北京双时区时钟',
        optNotify: '时段切换时桌面通知',
        notifyPermRequired: '（需允许浏览器通知权限）',
        notifyPeakTitle: '🟠 DeepSeek 已进入高峰价格时段',
        notifyPeakBody: '当前为业务高峰时段 (北京时间 09:00~12:00 / 14:00~18:00)，按官方正常价计费。',
        notifyOffPeakTitle: '🟢 DeepSeek 已进入平峰优惠时段',
        notifyOffPeakBody: '当前为空闲平峰时段，按高峰价格的 50% (半价) 计费。',
        btnDetails: '查看详情',
        btnSettings: '设置',
        btnClose: '关闭',
        btnReset: '恢复默认',
        btnOpenVisualizer: '打开全景时间轴与计费说明',
      },
      en: {
        pluginName: 'DeepSeek Peak / Off-Peak Indicator',
        ruleTypeLabel: 'Schedule Rule',
        ruleV4Peak: 'DeepSeek V4 Official Schedule (Peak 09-12 / 14-18)',
        ruleCustom: 'Custom Peak Schedule',

        // V4 Peak Rule Strings
        offPeakStatus_v4: 'DeepSeek Official Off-Peak · 50% Discount',
        offPeakSub_v4: 'Official off-peak pricing is 50% of the standard peak rate',
        offPeakShort_v4: 'Off-Peak 50%',
        offPeakIconOnly_v4: 'Off-Peak',
        peakStatus_v4: 'DeepSeek Official Peak Pricing',
        peakSub_v4: 'Peak Windows: 09:00~12:00 & 14:00~18:00 (UTC+8)',
        peakShort_v4: 'Peak Rate',
        peakIconOnly_v4: 'Peak',
        countdownToPeak_v4: 'To Peak in',
        countdownToOffPeak_v4: 'To Off-Peak in',

        rate1x: 'Off-Peak 50%',
        rate2x: 'Peak Rate',

        localTime: 'Local Time',
        beijingTime: 'Beijing Time (UTC+8)',
        utcTime: 'UTC Standard Time',
        timeZone: 'Time Zone',
        detailsTitle: 'DeepSeek V4 Peak / Off-Peak Official Pricing',
        timelineTitle: '24-Hour Timeline (Beijing Time UTC+8)',
        timelineOffPeakDesc_v4: 'Off-Peak (00:00~09:00, 12:00~14:00, 18:00~24:00) 50% discount',
        timelinePeakDesc_v4: 'Peak (09:00~12:00, 14:00~18:00) Standard Official Rate',
        timelineOffPeakHover: 'Off-Peak 50% · {start}–{end} (Beijing Time)',
        timelinePeakHover: 'Peak Rate · {start}–{end} (Beijing Time)',
        timelineCurrentHover: 'Current Beijing time {time} · {status}',
        beijingTzSub: 'DeepSeek Official Server Timezone (UTC+8)',
        localConvertedOffPeak: 'Converted to Your Local Off-Peak Hours',
        localConvertedPeak: 'Converted to Your Local Peak Hours',
        currentCursor: 'Current Time',
        timezoneTitle: 'Multi-Timezone Comparison',
        detectedTimezone: 'Detected Local Timezone',
        nextSwitchLabel: 'Next Schedule Switch',
        nextSwitchDetail: 'Switches to [{target}] at local time {time}',

        pricingTitle: 'Official DeepSeek V4 API Pricing',
        pricingOfficialSource: 'Official Source: https://api-docs.deepseek.com/quick_start/pricing',
        pricingUnitNote: 'Unit: CNY / 1M Tokens',
        pricingEffective: 'New prices took effect at 00:00 Beijing time on Aug 17, 2026 (16:00 UTC Aug 16):',
        pricingRule1: 'Peak windows: 09:00~12:00 & 14:00~18:00 Beijing time (UTC+8).',
        pricingRule2: 'Off-peak: Remaining 17 hours (hit, miss, & output are 50% of peak rates).',
        pricingRule3: 'Current official models: DeepSeek-V4-Flash-0731 & DeepSeek-V4-Pro-0813.',
        modelCol: 'Model Name',
        inputHitCol: 'Cache Hit (Off / Peak)',
        inputMissCol: 'Cache Miss (Off / Peak)',
        outputCol: 'Output (Off / Peak)',

        flashHitPrice: '¥0.05 / ¥0.10',
        flashMissPrice: '¥1.50 / ¥3.00',
        flashOutPrice: '¥4.50 / ¥9.00',

        proHitPrice: '¥0.15 / ¥0.30',
        proMissPrice: '¥4.50 / ¥9.00',
        proOutPrice: '¥13.50 / ¥27.00',

        displayStyleLabel: 'Header Display Style',
        styleIconOnly: 'Dot Icon Only (Minimal)',
        styleCompact: 'Dot + Status (Beside Quota)',
        styleFull: 'Full Mode (With Timer)',

        settingsTitle: 'Indicator Display & Dock Settings',
        optShowInHeader: 'Integrate in Session Header (Beside Quota on the Left)',
        optFloatingMode: 'Floating Pill Position',
        posNone: 'Disabled (Header & Sidebar Only)',
        posRight: 'Top Right',
        posLeft: 'Top Left',
        posCenter: 'Top Center',
        optCountdown: 'Show Live Countdown',
        optDualTime: 'Show Dual Time Clocks',
        optNotify: 'Desktop Notification on Switch',
        notifyPermRequired: '(Requires browser permission)',
        notifyPeakTitle: '🟠 DeepSeek Switched to Peak Pricing',
        notifyPeakBody: 'Peak pricing is now active (09:00~12:00 / 14:00~18:00 UTC+8).',
        notifyOffPeakTitle: '🟢 DeepSeek Switched to Off-Peak',
        notifyOffPeakBody: 'Off-peak pricing is active at 50% of standard peak prices.',
        btnDetails: 'View Details',
        btnSettings: 'Settings',
        btnClose: 'Close',
        btnReset: '恢复默认',
        btnOpenVisualizer: '打开全景时间轴与计费说明',
      },
      en: {
        pluginName: 'DeepSeek Peak / Off-Peak Pricing',
        ruleTypeLabel: 'Schedule Rule',
        ruleV4Peak: 'DeepSeek V4 Official Schedule (Peak 09-12 / 14-18)',
        ruleCustom: 'Custom Peak Schedule',

        // V4 Peak Rule Strings
        offPeakStatus_v4: 'DeepSeek Official Off-Peak · 50% of Peak',
        offPeakSub_v4: 'Official off-peak pricing is 50% of the peak rate',
        offPeakShort_v4: 'Off-Peak 50%',
        offPeakIconOnly_v4: 'Off-Peak',
        peakStatus_v4: 'DeepSeek Official Peak Pricing',
        peakSub_v4: 'Peak Windows: 09:00~12:00 & 14:00~18:00 (UTC+8)',
        peakShort_v4: 'Peak Rate',
        peakIconOnly_v4: 'Peak',
        countdownToPeak_v4: 'To Peak in',
        countdownToOffPeak_v4: 'To Off-Peak in',

        rate1x: 'Off-Peak 50%',
        rate2x: 'Peak Rate',

        localTime: 'Local Time',
        beijingTime: 'Beijing Time (UTC+8)',
        utcTime: 'UTC Standard Time',
        timeZone: 'Time Zone',
        detailsTitle: 'DeepSeek V4 Peak / Off-Peak Official Pricing',
        timelineTitle: '24-Hour Timeline (Beijing Time UTC+8)',
        timelineOffPeakDesc_v4: 'Off-Peak (00:00~09:00, 12:00~14:00, 18:00~24:00) 50% of Peak',
        timelinePeakDesc_v4: 'Peak (09:00~12:00, 14:00~18:00) Official Peak Rate',
        timelineOffPeakHover: 'Off-Peak 50% · {start}–{end} (Beijing Time)',
        timelinePeakHover: 'Peak Rate · {start}–{end} (Beijing Time)',
        timelineCurrentHover: 'Current Beijing time {time} · {status}',
        beijingTzSub: 'DeepSeek Official Server Timezone (UTC+8)',
        localConvertedOffPeak: 'Converted to Your Local Off-Peak Hours',
        localConvertedPeak: 'Converted to Your Local Peak Hours',
        currentCursor: 'Current Time',
        timezoneTitle: 'Multi-Timezone Comparison',
        detectedTimezone: 'Detected Local Timezone',
        nextSwitchLabel: 'Next Schedule Switch',
        nextSwitchDetail: 'Switches to [{target}] at local time {time}',

        pricingTitle: 'Official DeepSeek V4 API Pricing',
        pricingOfficialSource: 'Official Source: https://api-docs.deepseek.com/quick_start/pricing',
        pricingUnitNote: 'Unit: CNY / 1M Tokens',
        pricingEffective: 'The new prices took effect at 16:00 UTC on Aug 16, 2026 (00:00 Beijing time on Aug 17).',
        pricingRule1: 'Peak windows: 09:00~12:00 and 14:00~18:00 Beijing time (UTC+8).',
        pricingRule2: 'Off-peak: all remaining hours; cache-hit input, cache-miss input, and output are 50% of peak prices.',
        pricingRule3: 'Current official versions: DeepSeek-V4-Flash-0731 and DeepSeek-V4-Pro-0813.',
        modelCol: 'Model Name',
        inputHitCol: 'Cache Hit (Off-Peak / Peak)',
        inputMissCol: 'Cache Miss (Off-Peak / Peak)',
        outputCol: 'Output (Off-Peak / Peak)',

        flashHitPrice: '¥0.05 / ¥0.10',
        flashMissPrice: '¥1.50 / ¥3.00',
        flashOutPrice: '¥4.50 / ¥9.00',

        proHitPrice: '¥0.15 / ¥0.30',
        proMissPrice: '¥4.50 / ¥9.00',
        proOutPrice: '¥13.50 / ¥27.00',

        displayStyleLabel: 'Header Display Style',
        styleIconOnly: 'Dot Icon Only (Minimal)',
        styleCompact: 'Dot + Status (Beside Quota)',
        styleFull: 'Full Mode (With Timer)',

        settingsTitle: 'Indicator Display & Dock Settings',
        optShowInHeader: 'Integrate in Session Header (Beside Quota on the Left)',
        optFloatingMode: 'Floating Pill Position',
        posNone: 'Disabled (Header & Sidebar Only)',
        posRight: 'Top Right',
        posLeft: 'Top Left',
        posCenter: 'Top Center',
        optCountdown: 'Show Live Countdown',
        optDualTime: 'Show Dual Time Clocks',
        optNotify: 'Desktop Notification on Switch',
        notifyPermRequired: '(Requires browser permission)',
        notifyPeakTitle: '🟠 DeepSeek Switched to Peak Pricing',
        notifyPeakBody: 'Peak pricing is now active (09:00~12:00 / 14:00~18:00 UTC+8).',
        notifyOffPeakTitle: '🟢 DeepSeek Switched to Off-Peak',
        notifyOffPeakBody: 'Off-peak pricing is active at 50% of peak prices.',
        btnDetails: 'View Details',
        btnSettings: 'Settings',
        btnClose: 'Close',
        btnReset: 'Reset Defaults',
        btnOpenVisualizer: 'Open Timeline & Pricing Info',
      },
    }

    var LOCALE_NS = 'dsh-peak-indicator'
    var localeService = null
    var localeTranslate = null

    function getLocale() {
      if (typeof window !== 'undefined' && window.__DSH_LOCALE__) {
        try {
          var snap = window.__DSH_LOCALE__.getSnapshot && window.__DSH_LOCALE__.getSnapshot()
          if (snap && snap.active && typeof snap.active === 'string') {
            return snap.active.toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en'
          }
        } catch (_) {}
      }
      if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
        var l = String(document.documentElement.lang).toLowerCase()
        if (l.indexOf('zh') === 0) return 'zh'
      }
      if (typeof navigator !== 'undefined' && navigator.language) {
        if (navigator.language.toLowerCase().indexOf('zh') === 0) return 'zh'
      }
      return 'zh'
    }

    function t(key, params) {
      if (localeTranslate) return localeTranslate(key, params)
      var lang = getLocale()
      var dict = I18N[lang] || I18N.zh
      var str = dict[key] !== undefined ? dict[key] : (I18N.zh[key] || key)
      if (params) {
        for (var k in params) {
          str = str.replace(new RegExp('\\\\{' + k + '\\\\}', 'g'), String(params[k]))
        }
      }
      return str
    }

    function subscribeLocale(listener) {
      if (!localeService || typeof localeService.subscribe !== 'function') return function () {}
      return localeService.subscribe(listener)
    }

    function getLocaleRevision() {
      if (!localeService || typeof localeService.getSnapshot !== 'function') return 0
      var snapshot = localeService.getSnapshot()
      return snapshot && typeof snapshot.revision === 'number' ? snapshot.revision : 0
    }

    function useLocaleRevision() {
      React.useSyncExternalStore(subscribeLocale, getLocaleRevision, getLocaleRevision)
    }

    // =========================================================================
    // 2. Clean Solid & Glowing Colored Dot SVGs (Off-Peak = Green, Peak = Orange-Yellow)
    // =========================================================================

    var ICONS = {
      dotGreen: '<svg viewBox=\"0 0 16 16\" width=\"10\" height=\"10\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"8\" cy=\"8\" r=\"4.5\" fill=\"#10b981\"/><circle cx=\"8\" cy=\"8\" r=\"6.5\" stroke=\"#10b981\" stroke-width=\"1.2\" stroke-opacity=\"0.45\"/></svg>',
      dotOrange: '<svg viewBox=\"0 0 16 16\" width=\"10\" height=\"10\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"8\" cy=\"8\" r=\"4.5\" fill=\"#f59e0b\"/><circle cx=\"8\" cy=\"8\" r=\"6.5\" stroke=\"#f59e0b\" stroke-width=\"1.2\" stroke-opacity=\"0.45\"/></svg>',
      clock: '<svg viewBox=\"0 0 24 24\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/></svg>',
      globe: '<svg viewBox=\"0 0 24 24\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/></svg>',
      settings: '<svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>',
      close: '<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/></svg>',
      activity: '<svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/></svg>',
    }

    // =========================================================================
    // 3. Settings Storage Helper
    // =========================================================================

    function loadSettings() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          var parsed = JSON.parse(raw)
          return Object.assign({}, DEFAULT_SETTINGS, parsed)
        }
      } catch (e) {}
      return Object.assign({}, DEFAULT_SETTINGS)
    }

    function saveSettings(cfg) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
      } catch (e) {}
    }

    // =========================================================================
    // 4. Time Calculation & State Engine
    // =========================================================================

    var userTimezone = (function () {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      } catch (_) {
        return 'UTC'
      }
    })()

    function getTzOffsetString() {
      var offsetMin = -new Date().getTimezoneOffset()
      var sign = offsetMin >= 0 ? '+' : '-'
      var absMin = Math.abs(offsetMin)
      var h = Math.floor(absMin / 60)
      var m = absMin % 60
      return 'UTC' + sign + h + (m > 0 ? ':' + (m < 10 ? '0' + m : m) : '')
    }

    function padZero(n) {
      return n < 10 ? '0' + n : String(n)
    }

    function escapeHtmlAttr(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    function getBeijingTime(date) {
      var d = date || new Date()
      var bjFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      var parts = bjFormatter.formatToParts(d)
      var map = {}
      for (var i = 0; i < parts.length; i++) {
        map[parts[i].type] = parts[i].value
      }
      var hour = parseInt(map.hour, 10)
      // Some Intl implementations still emit 24:xx for midnight; the timeline scale is 00:00–24:00.
      if (hour === 24) hour = 0
      return {
        year: parseInt(map.year, 10),
        month: parseInt(map.month, 10),
        day: parseInt(map.day, 10),
        hour: hour,
        minute: parseInt(map.minute, 10),
        second: parseInt(map.second, 10),
      }
    }

    function calculateStatus(settings) {
      var now = new Date()
      var bj = getBeijingTime(now)
      var bjMinutes = bj.hour * 60 + bj.minute + bj.second / 60

      var isPeak = false
      var targetYear = bj.year
      var targetMonth = bj.month
      var targetDay = bj.day
      var targetHour = 0
      var targetMin = 0

      var ruleType = settings.ruleType || 'v4_peak'

      if (ruleType === 'custom') {
        var startMin = settings.customStartHour * 60 + settings.customStartMin
        var endMin = settings.customEndHour * 60 + settings.customEndMin
        isPeak = (bjMinutes >= startMin && bjMinutes < endMin)

        if (isPeak) {
          targetHour = Math.floor(endMin / 60)
          targetMin = endMin % 60
        } else {
          targetHour = Math.floor(startMin / 60)
          targetMin = startMin % 60
          if (bjMinutes >= endMin) {
            targetDay += 1
          }
        }
      } else {
        // DeepSeek V4 Official 2 Peak Windows:
        // Window 1: 09:00 ~ 12:00 (540 ~ 720 min)
        // Window 2: 14:00 ~ 18:00 (840 ~ 1080 min)
        // Remainder: Off-Peak (00:00~09:00, 12:00~14:00, 18:00~24:00)
        var inW1 = bjMinutes >= 540 && bjMinutes < 720   // 09:00 ~ 12:00
        var inW2 = bjMinutes >= 840 && bjMinutes < 1080  // 14:00 ~ 18:00
        isPeak = inW1 || inW2

        if (bjMinutes < 540) {
          targetHour = 9; targetMin = 0
        } else if (bjMinutes < 720) {
          targetHour = 12; targetMin = 0
        } else if (bjMinutes < 840) {
          targetHour = 14; targetMin = 0
        } else if (bjMinutes < 1080) {
          targetHour = 18; targetMin = 0
        } else {
          targetHour = 9; targetMin = 0; targetDay += 1
        }
      }

      var isOffPeak = !isPeak
      var statusKey = isPeak ? 'peakStatus_v4' : 'offPeakStatus_v4'
      var subKey = isPeak ? 'peakSub_v4' : 'offPeakSub_v4'
      var shortKey = isPeak ? 'peakShort_v4' : 'offPeakShort_v4'
      var iconOnlyKey = isPeak ? 'peakIconOnly_v4' : 'offPeakIconOnly_v4'
      var countdownKey = isPeak ? 'countdownToOffPeak_v4' : 'countdownToPeak_v4'

      // Convert target Beijing Time to UTC timestamp
      var targetUtcMs = Date.UTC(targetYear, targetMonth - 1, targetDay, targetHour - 8, targetMin, 0)
      var remainingSec = Math.max(0, Math.floor((targetUtcMs - now.getTime()) / 1000))

      var rHours = Math.floor(remainingSec / 3600)
      var rMins = Math.floor((remainingSec % 3600) / 60)
      var rSecs = remainingSec % 60
      var countdownStr = padZero(rHours) + ':' + padZero(rMins) + ':' + padZero(rSecs)

      var localTimeStr = padZero(now.getHours()) + ':' + padZero(now.getMinutes()) + ':' + padZero(now.getSeconds())
      var localShortTimeStr = padZero(now.getHours()) + ':' + padZero(now.getMinutes())
      var beijingTimeStr = padZero(bj.hour) + ':' + padZero(bj.minute) + ':' + padZero(bj.second)
      var beijingShortTimeStr = padZero(bj.hour) + ':' + padZero(bj.minute)

      var targetDate = new Date(targetUtcMs)
      var targetLocalStr = padZero(targetDate.getHours()) + ':' + padZero(targetDate.getMinutes())

      var dayProgressPercent = Math.min(100, Math.max(0, ((bj.hour * 3600 + bj.minute * 60 + bj.second) / 86400) * 100))

      return {
        isOffPeak: isOffPeak,
        isPeak: isPeak,
        ruleType: ruleType,
        statusKey: statusKey,
        subKey: subKey,
        shortKey: shortKey,
        iconOnlyKey: iconOnlyKey,
        countdownKey: countdownKey,
        countdownStr: countdownStr,
        remainingSec: remainingSec,
        localTimeStr: localTimeStr,
        localShortTimeStr: localShortTimeStr,
        beijingTimeStr: beijingTimeStr,
        beijingShortTimeStr: beijingShortTimeStr,
        targetLocalStr: targetLocalStr,
        userTimezone: userTimezone,
        tzOffsetStr: getTzOffsetString(),
        dayProgressPercent: dayProgressPercent.toFixed(2),
      }
    }

    // =========================================================================
    // 5. Dynamic CSS Stylesheet Injector
    // =========================================================================

    function injectStyles() {
      var styleId = 'dsh-peak-indicator-styles'
      if (document.getElementById(styleId)) return

      var css = [
        ':root {',
        '  --dspi-bg-offpeak: rgba(16, 185, 129, 0.12);',
        '  --dspi-border-offpeak: rgba(16, 185, 129, 0.35);',
        '  --dspi-text-offpeak: #10b981;',
        '  --dspi-bg-peak: rgba(245, 158, 11, 0.12);',
        '  --dspi-border-peak: rgba(245, 158, 11, 0.35);',
        '  --dspi-text-peak: #f59e0b;',
        '  --dspi-timeline-offpeak: #10b981;',
        '  --dspi-timeline-peak: #f59e0b;',
        '  --dspi-card-bg: var(--color-bg-surface, #ffffff);',
        '  --dspi-border: var(--color-border-subtle, rgba(0, 0, 0, 0.08));',
        '  --dspi-text-primary: var(--color-text-primary, #111827);',
        '  --dspi-text-secondary: var(--color-text-secondary, #4b5563);',
        '  --dspi-text-tertiary: var(--color-text-tertiary, #9ca3af);',
        '}',
        '@media (prefers-color-scheme: dark) {',
        '  :root {',
        '    --dspi-card-bg: var(--color-bg-surface, #1e2430);',
        '    --dspi-border: var(--color-border-subtle, rgba(255, 255, 255, 0.1));',
        '    --dspi-text-primary: var(--color-text-primary, #f3f4f6);',
        '    --dspi-text-secondary: var(--color-text-secondary, #9ca3af);',
        '    --dspi-text-tertiary: var(--color-text-tertiary, #6b7280);',
        '  }',
        '}',

        /* In-Flow Header Actions Chip (order: 35) */
        '.dspi-header-chip {',
        '  display: inline-flex;',
        '  align-items: center;',
        '  gap: 6px;',
        '  height: 26px;',
        '  padding: 0 9px;',
        '  border-radius: 6px;',
        '  font-size: 12px;',
        '  font-weight: 500;',
        '  cursor: pointer;',
        '  user-select: none;',
        '  transition: all 0.18s ease;',
        '  white-space: nowrap;',
        '  flex-shrink: 0;',
        '  border: 1px solid transparent;',
        '}',
        '.dspi-header-chip-offpeak {',
        '  background: var(--dspi-bg-offpeak);',
        '  border-color: var(--dspi-border-offpeak);',
        '  color: var(--dspi-text-offpeak);',
        '}',
        '.dspi-header-chip-offpeak:hover {',
        '  background: rgba(16, 185, 129, 0.2);',
        '  border-color: rgba(16, 185, 129, 0.55);',
        '}',
        '.dspi-header-chip-peak {',
        '  background: var(--dspi-bg-peak);',
        '  border-color: var(--dspi-border-peak);',
        '  color: var(--dspi-text-peak);',
        '}',
        '.dspi-header-chip-peak:hover {',
        '  background: rgba(245, 158, 11, 0.2);',
        '  border-color: rgba(245, 158, 11, 0.55);',
        '}',
        '.dspi-header-chip-icononly {',
        '  padding: 0 6px;',
        '  height: 26px;',
        '}',
        '.dspi-countdown-val {',
        '  font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);',
        '  font-size: 11.5px;',
        '  opacity: 0.9;',
        '  letter-spacing: 0.2px;',
        '}',

        /* Floating Pill Mode */
        '.dspi-floating-pill {',
        '  position: fixed;',
        '  top: 14px;',
        '  z-index: 9999;',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 7px;',
        '  padding: 5px 12px;',
        '  border-radius: 9999px;',
        '  font-size: 12px;',
        '  font-weight: 500;',
        '  box-shadow: 0 4px 14px rgba(0,0,0,0.14);',
        '  backdrop-filter: blur(10px);',
        '  -webkit-backdrop-filter: blur(10px);',
        '  cursor: pointer;',
        '  user-select: none;',
        '  transition: transform 0.18s ease, box-shadow 0.18s ease;',
        '}',
        '.dspi-floating-pill:hover {',
        '  transform: translateY(-1px);',
        '  box-shadow: 0 6px 18px rgba(0,0,0,0.2);',
        '}',
        '.dspi-floating-right { right: 20px; }',
        '.dspi-floating-left { left: 260px; }',
        '.dspi-floating-center { left: 50%; transform: translateX(-50%); }',

        /* Modal Overlay & Card */
        '.dspi-modal-overlay {',
        '  position: fixed;',
        '  inset: 0;',
        '  z-index: 100000;',
        '  background: rgba(0, 0, 0, 0.45);',
        '  backdrop-filter: blur(4px);',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  padding: 16px;',
        '  opacity: 0;',
        '  pointer-events: none;',
        '  transition: opacity 0.2s ease;',
        '}',
        '.dspi-modal-overlay.dspi-open {',
        '  opacity: 1;',
        '  pointer-events: auto;',
        '}',
        '.dspi-modal-card {',
        '  background: var(--dspi-card-bg);',
        '  border: 1px solid var(--dspi-border);',
        '  border-radius: 14px;',
        '  width: 100%;',
        '  max-width: 580px;',
        '  max-height: 90vh;',
        '  overflow-y: auto;',
        '  box-shadow: 0 20px 40px rgba(0,0,0,0.22);',
        '  color: var(--dspi-text-primary);',
        '  font-family: inherit;',
        '  transform: scale(0.96);',
        '  transition: transform 0.2s ease;',
        '  display: flex;',
        '  flex-direction: column;',
        '}',
        '.dspi-modal-overlay.dspi-open .dspi-modal-card {',
        '  transform: scale(1);',
        '}',
        '.dspi-modal-header {',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: space-between;',
        '  padding: 16px 20px;',
        '  border-bottom: 1px solid var(--dspi-border);',
        '}',
        '.dspi-modal-title {',
        '  font-size: 15px;',
        '  font-weight: 600;',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 8px;',
        '}',
        '.dspi-modal-body {',
        '  padding: 20px;',
        '  display: flex;',
        '  flex-direction: column;',
        '  gap: 16px;',
        '}',

        /* Hero Status Box */
        '.dspi-status-hero {',
        '  display: flex;',
        '  align-items: center;',
        '  justify-content: space-between;',
        '  padding: 14px 18px;',
        '  border-radius: 10px;',
        '  border: 1px solid transparent;',
        '}',
        '.dspi-status-hero-offpeak {',
        '  background: var(--dspi-bg-offpeak);',
        '  border-color: var(--dspi-border-offpeak);',
        '}',
        '.dspi-status-hero-peak {',
        '  background: var(--dspi-bg-peak);',
        '  border-color: var(--dspi-border-peak);',
        '}',
        '.dspi-hero-title {',
        '  font-size: 15px;',
        '  font-weight: 600;',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 8px;',
        '}',
        '.dspi-hero-desc {',
        '  font-size: 12px;',
        '  color: var(--dspi-text-secondary);',
        '  margin-top: 3px;',
        '}',
        '.dspi-hero-countdown {',
        '  text-align: right;',
        '}',
        '.dspi-countdown-lbl {',
        '  font-size: 11px;',
        '  color: var(--dspi-text-tertiary);',
        '  text-transform: uppercase;',
        '  letter-spacing: 0.5px;',
        '}',
        '.dspi-countdown-clock {',
        '  font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);',
        '  font-size: 20px;',
        '  font-weight: 700;',
        '  letter-spacing: 0.5px;',
        '  margin-top: 2px;',
        '}',

        /* Dual Clocks */
        '.dspi-clocks-grid {',
        '  display: grid;',
        '  grid-template-columns: 1fr 1fr;',
        '  gap: 10px;',
        '}',
        '.dspi-clock-card {',
        '  background: rgba(125, 125, 125, 0.05);',
        '  border: 1px solid var(--dspi-border);',
        '  border-radius: 8px;',
        '  padding: 10px 14px;',
        '}',
        '.dspi-clock-label {',
        '  font-size: 11px;',
        '  color: var(--dspi-text-secondary);',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 5px;',
        '}',
        '.dspi-clock-time {',
        '  font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);',
        '  font-size: 16px;',
        '  font-weight: 600;',
        '  margin-top: 4px;',
        '}',

        /* 24h Timeline Visualizer */
        '.dspi-timeline-box {',
        '  background: rgba(125, 125, 125, 0.05);',
        '  border: 1px solid var(--dspi-border);',
        '  border-radius: 10px;',
        '  padding: 14px 16px;',
        '}',
        '.dspi-section-h {',
        '  font-size: 12px;',
        '  font-weight: 600;',
        '  color: var(--dspi-text-primary);',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 6px;',
        '  margin-bottom: 10px;',
        '}',
        '.dspi-timeline-track {',
        '  position: relative;',
        '  height: 22px;',
        '  border-radius: 6px;',
        '  background: rgba(125, 125, 125, 0.12);',
        '  overflow: visible;',
        '  border: 1px solid var(--dspi-border);',
        '  margin-top: 30px;',
        '  margin-bottom: 8px;',
        '}',
        '.dspi-timeline-segment {',
        '  position: absolute;',
        '  top: 0;',
        '  bottom: 0;',
        '  cursor: help;',
        '  outline: none;',
        '}',
        '.dspi-timeline-segment-edge-left {',
        '  border-radius: 5px 0 0 5px;',
        '}',
        '.dspi-timeline-segment-edge-right {',
        '  border-radius: 0 5px 5px 0;',
        '}',
        '.dspi-timeline-segment-offpeak {',
        '  background: var(--dspi-timeline-offpeak);',
        '  opacity: 0.85;',
        '}',
        '.dspi-timeline-segment-peak {',
        '  background: var(--dspi-timeline-peak);',
        '  opacity: 0.82;',
        '}',
        '.dspi-timeline-segment:hover, .dspi-timeline-segment:focus-visible {',
        '  opacity: 1;',
        '  z-index: 20;',
        '  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.7);',
        '}',
        '.dspi-timeline-segment::after, .dspi-timeline-pin::before {',
        '  content: attr(data-tooltip);',
        '  position: absolute;',
        '  left: 50%;',
        '  bottom: calc(100% + 7px);',
        '  transform: translateX(-50%);',
        '  padding: 4px 7px;',
        '  border-radius: 5px;',
        '  background: rgba(17, 24, 39, 0.94);',
        '  color: #ffffff;',
        '  font-size: 10.5px;',
        '  font-weight: 500;',
        '  line-height: 1.2;',
        '  white-space: nowrap;',
        '  pointer-events: none;',
        '  opacity: 0;',
        '  transition: opacity 0.12s ease;',
        '  z-index: 30;',
        '}',
        '.dspi-timeline-segment:hover::after, .dspi-timeline-segment:focus-visible::after,',
        '.dspi-timeline-pin:hover::before, .dspi-timeline-pin:focus-visible::before {',
        '  opacity: 1;',
        '}',
        '.dspi-timeline-segment-edge-left::after {',
        '  left: 4px;',
        '  transform: none;',
        '}',
        '.dspi-timeline-segment-edge-right::after {',
        '  left: auto;',
        '  right: 4px;',
        '  transform: none;',
        '}',
        '.dspi-timeline-pin {',
        '  position: absolute;',
        '  top: 0;',
        '  bottom: 0;',
        '  width: 3px;',
        '  background: #ffffff;',
        '  box-shadow: 0 0 6px rgba(0,0,0,0.6);',
        '  z-index: 10;',
        '  cursor: help;',
        '  outline: none;',
        '}',
        '.dspi-timeline-pin::after {',
        '  content: \"\";',
        '  position: absolute;',
        '  top: -2px;',
        '  left: -3px;',
        '  width: 9px;',
        '  height: 9px;',
        '  background: #ffffff;',
        '  border-radius: 50%;',
        '  box-shadow: 0 1px 3px rgba(0,0,0,0.5);',
        '}',
        '.dspi-timeline-labels {',
        '  position: relative;',
        '  height: 14px;',
        '  font-size: 10.5px;',
        '  color: var(--dspi-text-tertiary);',
        '  font-family: var(--font-mono, monospace);',
        '}',
        '.dspi-timeline-label {',
        '  position: absolute;',
        '  top: 0;',
        '  transform: translateX(-50%);',
        '  white-space: nowrap;',
        '}',
        '.dspi-timeline-label:first-child { transform: none; }',
        '.dspi-timeline-label:last-child { transform: translateX(-100%); }',
        '.dspi-timeline-legend {',
        '  display: flex;',
        '  flex-direction: column;',
        '  gap: 4px;',
        '  margin-top: 10px;',
        '  font-size: 11px;',
        '  color: var(--dspi-text-secondary);',
        '}',
        '.dspi-legend-item {',
        '  display: flex;',
        '  align-items: center;',
        '  gap: 6px;',
        '}',

        /* Official Pricing Table */
        '.dspi-table {',
        '  width: 100%;',
        '  border-collapse: collapse;',
        '  font-size: 11.5px;',
        '  margin-top: 6px;',
        '}',
        '.dspi-table th, .dspi-table td {',
        '  padding: 7px 10px;',
        '  text-align: left;',
        '  border-bottom: 1px solid var(--dspi-border);',
        '}',
        '.dspi-table th {',
        '  color: var(--dspi-text-secondary);',
        '  font-weight: 600;',
        '  background: rgba(125,125,125,0.04);',
        '}',
        '.dspi-rate-highlight {',
        '  color: #f59e0b;',
        '  font-weight: 600;',
        '}',

        /* Form Controls & Buttons */
        '.dspi-btn {',
        '  display: inline-flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  gap: 6px;',
        '  padding: 6px 12px;',
        '  border-radius: 6px;',
        '  font-size: 12px;',
        '  font-weight: 500;',
        '  cursor: pointer;',
        '  border: 1px solid var(--dspi-border);',
        '  background: var(--dspi-card-bg);',
        '  color: var(--dspi-text-primary);',
        '  transition: background 0.15s ease;',
        '}',
        '.dspi-btn:hover { background: rgba(125, 125, 125, 0.08); }',
        '.dspi-btn-icon {',
        '  background: transparent;',
        '  border: none;',
        '  color: var(--dspi-text-secondary);',
        '  cursor: pointer;',
        '  border-radius: 6px;',
        '  display: inline-flex;',
        '  align-items: center;',
        '  justify-content: center;',
        '  padding: 4px;',
        '}',
        '.dspi-btn-icon:hover { color: var(--dspi-text-primary); background: rgba(125,125,125,0.1); }',
      ].join('\n')

      var styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = css
      document.head.appendChild(styleEl)
    }

    // =========================================================================
    // 6. Modal Overlay Component & Manager
    // =========================================================================

    var modalContainer = null

    function closeModal() {
      if (modalContainer) {
        modalContainer.classList.remove('dspi-open')
        setTimeout(function () {
          if (modalContainer && modalContainer.parentNode) {
            modalContainer.parentNode.removeChild(modalContainer)
            modalContainer = null
          }
        }, 220)
      }
    }

    function openDetailsModal() {
      renderModal()
    }

    function renderModal() {
      injectStyles()
      var settings = loadSettings()
      var status = calculateStatus(settings)

      if (!modalContainer) {
        modalContainer = document.createElement('div')
        modalContainer.className = 'dspi-modal-overlay'
        document.body.appendChild(modalContainer)
      }

      var heroClass = status.isOffPeak ? 'dspi-status-hero-offpeak' : 'dspi-status-hero-peak'
      var heroDot = status.isOffPeak ? ICONS.dotGreen : ICONS.dotOrange

      var nextTargetText = status.isOffPeak ? t('peakShort_v4') : t('offPeakShort_v4')
      var nextSwitchText = t('nextSwitchDetail', {
        time: status.targetLocalStr,
        target: nextTargetText,
      })

      // Render all five windows explicitly so colors, hover targets, and labels share the same 24-hour scale.
      var timelineSegments = [
        { start: 0, end: 9, isOffPeak: true },
        { start: 9, end: 12, isOffPeak: false },
        { start: 12, end: 14, isOffPeak: true },
        { start: 14, end: 18, isOffPeak: false },
        { start: 18, end: 24, isOffPeak: true },
      ]
      var timelineTrackHtml = ''
      for (var segmentIndex = 0; segmentIndex < timelineSegments.length; segmentIndex++) {
        var segment = timelineSegments[segmentIndex]
        var segmentStart = padZero(segment.start) + ':00'
        var segmentEnd = padZero(segment.end) + ':00'
        var segmentTooltip = t(segment.isOffPeak ? 'timelineOffPeakHover' : 'timelinePeakHover', {
          start: segmentStart,
          end: segmentEnd,
        })
        var segmentEdgeClass = segmentIndex === 0
          ? ' dspi-timeline-segment-edge-left'
          : (segmentIndex === timelineSegments.length - 1 ? ' dspi-timeline-segment-edge-right' : '')
        timelineTrackHtml += '<div class="dspi-timeline-segment dspi-timeline-segment-' +
          (segment.isOffPeak ? 'offpeak' : 'peak') + segmentEdgeClass + '" style="left:' +
          ((segment.start / 24) * 100).toFixed(4) + '%;width:' +
          (((segment.end - segment.start) / 24) * 100).toFixed(4) + '%;" title="' +
          escapeHtmlAttr(segmentTooltip) + '" data-tooltip="' + escapeHtmlAttr(segmentTooltip) +
          '" aria-label="' + escapeHtmlAttr(segmentTooltip) + '" tabindex="0"></div>'
      }

      var timelineMarks = [0, 9, 12, 14, 18, 24]
      var timelineLabelsHtml = ''
      for (var markIndex = 0; markIndex < timelineMarks.length; markIndex++) {
        var mark = timelineMarks[markIndex]
        timelineLabelsHtml += '<span class="dspi-timeline-label" style="left:' +
          ((mark / 24) * 100).toFixed(4) + '%;">' + padZero(mark) + ':00</span>'
      }

      var currentTooltip = t('timelineCurrentHover', {
        time: status.beijingTimeStr,
        status: t(status.shortKey),
      })

      var timelineLegendHtml = [
        '<div class="dspi-legend-item">',
        '  <span style="display:inline-block;width:10px;height:10px;background:var(--dspi-timeline-offpeak);border-radius:50%;flex-shrink:0;"></span>',
        '  <span>' + t('timelineOffPeakDesc_v4') + '</span>',
        '</div>',
        '<div class="dspi-legend-item">',
        '  <span style="display:inline-block;width:10px;height:10px;background:var(--dspi-timeline-peak);border-radius:50%;flex-shrink:0;"></span>',
        '  <span>' + t('timelinePeakDesc_v4') + '</span>',
        '</div>',
      ].join('')

      var pricingTableHtml = [
        '<div class="dspi-timeline-box">',
        '  <div class="dspi-section-h" style="justify-content:space-between;">',
        '    <span>' + t('pricingTitle') + '</span>',
        '    <span style="font-size:11px;font-weight:normal;color:var(--dspi-text-tertiary);">' + t('pricingUnitNote') + '</span>',
        '  </div>',
        '  <div style="font-size:11.5px;color:var(--dspi-text-secondary);line-height:1.6;margin-bottom:8px;">',
        '    <div><strong>' + t('pricingEffective') + '</strong></div>',
        '    <div>• ' + t('pricingRule1') + '</div>',
        '    <div>• ' + t('pricingRule2') + '</div>',
        '    <div>• ' + t('pricingRule3') + '</div>',
        '    <div style="font-size:10.5px;color:var(--dspi-text-tertiary);margin-top:2px;">' + t('pricingOfficialSource') + '</div>',
        '  </div>',
        '  <table class="dspi-table">',
        '    <thead>',
        '      <tr>',
        '        <th>' + t('modelCol') + '</th>',
        '        <th>' + t('inputHitCol') + '</th>',
        '        <th>' + t('inputMissCol') + '</th>',
        '        <th>' + t('outputCol') + '</th>',
        '      </tr>',
        '    </thead>',
        '    <tbody>',
        '      <tr>',
        '        <td><strong>DeepSeek-V4-Flash-0731</strong></td>',
        '        <td>' + t('flashHitPrice') + '</td>',
        '        <td>' + t('flashMissPrice') + '</td>',
        '        <td>' + t('flashOutPrice') + '</td>',
        '      </tr>',
        '      <tr>',
        '        <td><strong>DeepSeek-V4-Pro-0813</strong></td>',
        '        <td>' + t('proHitPrice') + '</td>',
        '        <td>' + t('proMissPrice') + '</td>',
        '        <td>' + t('proOutPrice') + '</td>',
        '      </tr>',
        '    </tbody>',
        '  </table>',
        '</div>',
      ].join('')

      var modalHtml = [
        '<div class="dspi-modal-card">',
        '  <div class="dspi-modal-header">',
        '    <div class="dspi-modal-title">',
        '      ' + heroDot,
        '      <span>' + t('detailsTitle') + '</span>',
        '    </div>',
        '    <button class="dspi-btn-icon dspi-modal-close-btn" style="width:32px;height:32px;">' + ICONS.close + '</button>',
        '  </div>',
        '  <div class="dspi-modal-body">',
        '    <!-- Hero Status Card -->',
        '    <div class="dspi-status-hero ' + heroClass + '">',
        '      <div>',
        '        <div class="dspi-hero-title">',
        '          ' + heroDot + ' ' + t(status.statusKey),
        '        </div>',
        '        <div class="dspi-hero-desc">' + t(status.subKey) + '</div>',
        '        <div class="dspi-hero-desc" style="margin-top:6px;color:var(--dspi-text-primary);font-weight:600;">' + nextSwitchText + '</div>',
        '      </div>',
        '      <div class="dspi-hero-countdown">',
        '        <div class="dspi-countdown-lbl">' + t(status.countdownKey) + '</div>',
        '        <div class="dspi-countdown-clock">' + status.countdownStr + '</div>',
        '      </div>',
        '    </div>',

        '    <!-- Dual Clocks -->',
        '    <div class="dspi-clocks-grid">',
        '      <div class="dspi-clock-card">',
        '        <div class="dspi-clock-label">' + ICONS.globe + ' ' + t('localTime') + ' (' + status.tzOffsetStr + ')</div>',
        '        <div class="dspi-clock-time">' + status.localTimeStr + '</div>',
        '        <div style="font-size:10.5px;color:var(--dspi-text-tertiary);margin-top:2px;">' + status.userTimezone + '</div>',
        '      </div>',
        '      <div class="dspi-clock-card">',
        '        <div class="dspi-clock-label">' + ICONS.clock + ' ' + t('beijingTime') + '</div>',
        '        <div class="dspi-clock-time">' + status.beijingTimeStr + '</div>',
        '        <div style="font-size:10.5px;color:var(--dspi-text-tertiary);margin-top:2px;">' + t('beijingTzSub') + '</div>',
        '      </div>',
        '    </div>',

        '    <!-- 24-Hour Timeline Visualizer -->',
        '    <div class="dspi-timeline-box">',
        '      <div class="dspi-section-h">' + ICONS.clock + ' ' + t('timelineTitle') + '</div>',
        '      <div class="dspi-timeline-track">',
        '        ' + timelineTrackHtml,
        '        <div class="dspi-timeline-pin" style="left:' + status.dayProgressPercent + '%;" title="' + escapeHtmlAttr(currentTooltip) + '" data-tooltip="' + escapeHtmlAttr(currentTooltip) + '" aria-label="' + escapeHtmlAttr(currentTooltip) + '" tabindex="0"></div>',
        '      </div>',
        '      <div class="dspi-timeline-labels">',
        '        ' + timelineLabelsHtml,
        '      </div>',
        '      <div class="dspi-timeline-legend">',
        '        ' + timelineLegendHtml,
        '      </div>',
        '    </div>',

        '    <!-- Official Pricing Table -->',
        '    ' + pricingTableHtml,
        '  </div>',
        '</div>',
      ].join('\n')

      modalContainer.innerHTML = modalHtml
      modalContainer.classList.add('dspi-open')

      modalContainer.onclick = function (e) {
        if (e.target === modalContainer) closeModal()
      }
      var closeBtn = modalContainer.querySelector('.dspi-modal-close-btn')
      if (closeBtn) closeBtn.onclick = closeModal
    }

    // =========================================================================
    // 7. Session Header Native Chip (Order 35: Attached right of Quota #30)
    // =========================================================================

    function HeaderChipComponent() {
      useLocaleRevision()
      var [tick, setTick] = React.useState(0)

      React.useEffect(function () {
        var timer = setInterval(function () {
          setTick(function (t) { return t + 1 })
        }, 1000)
        return function () { clearInterval(timer) }
      }, [])

      var settings = loadSettings()
      if (!settings.showInHeader) return null

      var status = calculateStatus(settings)
      var chipClass = status.isOffPeak ? 'dspi-header-chip-offpeak' : 'dspi-header-chip-peak'
      var dotHtml = status.isOffPeak ? ICONS.dotGreen : ICONS.dotOrange
      var displayStyle = settings.displayStyle || 'compact'

      if (displayStyle === 'icon_only') {
        return React.createElement(
          'div',
          {
            className: 'dspi-header-chip dspi-header-chip-icononly ' + chipClass,
            title: t(status.statusKey) + ' (' + t(status.countdownKey) + ' ' + status.countdownStr + ')',
            onClick: openDetailsModal,
          },
          React.createElement('span', {
            dangerouslySetInnerHTML: { __html: dotHtml },
            style: { display: 'inline-flex', alignItems: 'center' },
          })
        )
      }

      if (displayStyle === 'full') {
        return React.createElement(
          'div',
          {
            className: 'dspi-header-chip ' + chipClass,
            title: t('detailsTitle'),
            onClick: openDetailsModal,
          },
          React.createElement('span', {
            dangerouslySetInnerHTML: { __html: dotHtml },
            style: { display: 'inline-flex', alignItems: 'center' },
          }),
          React.createElement('span', null, t(status.shortKey)),
          React.createElement('span', { className: 'dspi-countdown-val' }, status.countdownStr)
        )
      }

      // Default 'compact': Dot + Status text
      return React.createElement(
        'div',
        {
          className: 'dspi-header-chip ' + chipClass,
          title: t(status.statusKey) + ' (' + t(status.countdownKey) + ' ' + status.countdownStr + ')',
          onClick: openDetailsModal,
        },
        React.createElement('span', {
          dangerouslySetInnerHTML: { __html: dotHtml },
          style: { display: 'inline-flex', alignItems: 'center' },
        }),
        React.createElement('span', null, t(status.shortKey))
      )
    }

    // =========================================================================
    // 8. Sidebar Footer Action Component (right-edge shortcut)
    // =========================================================================

    function SidebarFooterButtonComponent() {
      useLocaleRevision()
      var [tick, setTick] = React.useState(0)

      React.useEffect(function () {
        var timer = setInterval(function () {
          setTick(function (t) { return t + 1 })
        }, 1000)
        return function () { clearInterval(timer) }
      }, [])

      var settings = loadSettings()
      var status = calculateStatus(settings)
      var dotHtml = status.isOffPeak ? ICONS.dotGreen : ICONS.dotOrange

      return React.createElement(
        'button',
        {
          className: 'dsh-sidebar-footer-action dspi-sidebar-btn',
          title: t('pluginName') + ' · ' + t(status.statusKey),
          onClick: openDetailsModal,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            marginLeft: 'auto',
            flexShrink: 0,
          },
        },
        React.createElement('span', {
          dangerouslySetInnerHTML: { __html: dotHtml },
          style: { display: 'inline-flex', alignItems: 'center' },
        })
      )
    }

    // =========================================================================
    // 9. DSH Settings Tab Component (Order 95)
    // =========================================================================

    function SettingsSectionComponent() {
      useLocaleRevision()
      var [cfg, setCfg] = React.useState(loadSettings())

      function update(patch) {
        var next = Object.assign({}, cfg, patch)
        setCfg(next)
        saveSettings(next)
      }

      return React.createElement(
        'div',
        { className: 'dsh-settings-section dspi-settings-pane', style: { padding: '16px 0' } },
        React.createElement(
          'h3',
          { style: { fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: 'var(--dspi-text-primary)' } },
          t('pluginName')
        ),

        // Display Style
        React.createElement(
          'div',
          { style: { marginBottom: '16px' } },
          React.createElement('label', { style: { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' } }, t('displayStyleLabel')),
          React.createElement(
            'select',
            {
              className: 'dsh-select',
              value: cfg.displayStyle,
              onChange: function (e) { update({ displayStyle: e.target.value }) },
              style: { width: '100%', maxWidth: '320px', padding: '6px 10px', borderRadius: '6px' },
            },
            React.createElement('option', { value: 'compact' }, t('styleCompact')),
            React.createElement('option', { value: 'full' }, t('styleFull')),
            React.createElement('option', { value: 'icon_only' }, t('styleIconOnly'))
          )
        ),

        // Show in Header checkbox
        React.createElement(
          'div',
          { style: { marginBottom: '12px' } },
          React.createElement(
            'label',
            { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' } },
            React.createElement('input', {
              type: 'checkbox',
              checked: cfg.showInHeader,
              onChange: function (e) { update({ showInHeader: e.target.checked }) },
            }),
            React.createElement('span', null, t('optShowInHeader'))
          )
        ),

        // View details button
        React.createElement(
          'div',
          { style: { marginTop: '16px' } },
          React.createElement(
            'button',
            {
              className: 'dspi-btn',
              onClick: openDetailsModal,
            },
            t('btnOpenVisualizer')
          )
        )
      )
    }

    // =========================================================================
    // 10. Plugin Registration & Initialization
    // =========================================================================

    function apply(ctx) {
      injectStyles()

      var service = ctx.locale
      localeService = service
      localeTranslate = service.bind(LOCALE_NS)
      ctx.effect(function () {
        var dispose = service.register(LOCALE_NS, I18N)
        return function () {
          dispose()
          if (localeService === service) {
            localeService = null
            localeTranslate = null
          }
        }
      }, 'dsh-peak-indicator: dictionaries')
      ctx.on('locale/change', function () {
        if (modalContainer) renderModal()
      })

      // DSH's current slot API is declaration-aware: the target slot may be
      // declared by a later shell plugin. Register through inject(), and use
      // the object-form register(options, component) signature. The previous
      // string-form call made options.name undefined and caused the loader to
      // report `slot "undefined" is not declared`.
      if (!ctx || !ctx.slots || typeof ctx.slots.inject !== 'function' || typeof ctx.slots.register !== 'function') return

      ctx.slots.inject('conversation.session.header.actions', function () {
        return ctx.slots.register(
          {
            name: 'conversation.session.header.actions',
            id: 'dsh-peak-indicator-header',
            order: 35,
          },
          HeaderChipComponent
        )
      })

      ctx.slots.inject('sidebar.footer.action', function () {
        return ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'dsh-peak-indicator-sidebar',
            order: 1000,
          },
          SidebarFooterButtonComponent
        )
      })

      ctx.slots.inject('settings.section', function () {
        return ctx.slots.register(
          {
            name: 'settings.section',
            id: 'dsh-peak-indicator-settings',
            order: 95,
            label: function () { return t('pluginName') },
          },
          SettingsSectionComponent
        )
      })
    }

    module.exports = {
      inject: ['slots', 'locale'],
      apply: apply,
    }

    return module.exports
  },
})

window.__ModuleLoader__.load({
  id: 'dsh-peak-indicator',
  factory: function (require) {
    'use strict'
    var module = { exports: {} }
    var exports = module.exports
    var React = require('react')

    // =========================================================================
    // 1. Constants & i18n Dictionaries
    // =========================================================================

    var STORAGE_KEY = 'dsh.dsPeakIndicator.v1'

    // Entry id of this plugin in the DSH client loader (matches package name).
    // The loader tags every injected <style> with data-plugin=<entryId> so HMR
    // can clean/re-inject it on rebuild. Setting the attribute ourselves keeps
    // the stylesheet from being claimed by (and later swept by) another plugin.
    var PLUGIN_ID = 'dsh-peak-indicator'
    var STYLE_ID = 'dsh-peak-indicator-styles'
    var CHIP_STYLE_MARKER = 'dspi-header-chip'

    var DEFAULT_SETTINGS = {
      ruleType: 'v4_peak', // 'v4_peak' (工作日 09-12 / 14-18 高峰；其余时段、周末及法定节假日全天平峰半价) | 'custom'
      showInHeader: true, // Show in session header actions (right of quota)
      displayStyle: 'compact', // 'icon_only' | 'compact' | 'full'
      floatingMode: 'none', // 'none' | 'right' | 'left' | 'center'
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
        pluginName: 'DS Peak Indicator',
        ruleTypeLabel: '时段判定规则',
        ruleV4Peak: 'DeepSeek 官方时段（工作日高峰 09~12 / 14~18，周末及法定节假日全天平峰 5 折）',
        ruleCustom: '自定义高峰时段',
        customStart: '高峰开始时间 (北京时间)',
        customEnd: '高峰结束时间 (北京时间)',

        // V4 Peak Rule Strings
        offPeakStatus_v4: 'DeepSeek 官方平峰 · 5 折优惠',
        offPeakSub_v4: '当前按平峰优惠价格计费（工作日非高峰时段、周末及中国法定节假日全天），全量输入与输出均为高峰价的 50%',
        offPeakShort_v4: '平峰 5 折',
        offPeakIconOnly_v4: '平峰',
        peakStatus_v4: 'DeepSeek 官方高峰价格',
        peakSub_v4: '高峰窗口：周一至周五（法定节假日除外）09:00~12:00 与 14:00~18:00（北京时间）；周末及法定节假日全天平峰',
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
        detailsTitle: 'DeepSeek 高峰/平峰时段与定价说明',
        timelineTitle: '24 小时全景时段分布 (北京时间)',
        timelineOffPeakDesc_v4: '平峰时段（工作日 00:00~09:00, 12:00~14:00, 18:00~24:00，周末及法定节假日全天）享 5 折半价',
        timelinePeakDesc_v4: '高峰时段（仅正常工作日 09:00~12:00, 14:00~18:00）执行官方标准价',
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

        holidayTag: '法定节假日 · 全天平峰',
        adjustedWorkdayTag: '调休上班日 · 依然全天平峰',

        pricingTitle: 'DeepSeek 官方 API 定价表 (V4.1)',
        pricingOfficialSource: '官方文档：https://api-docs.deepseek.com/zh-cn/quick_start/pricing',
        pricingUnitNote: '单位：元 / 百万 tokens',
        pricingEffective: '计费规则于 2026-09-10 12:00（北京时间）起生效（2026-09-19 补充节假日与调休说明）：',
        pricingRule1: '高峰时段：工作日（周一至周五，法定节假日除外）09:00~12:00 与 14:00~18:00（北京时间）。',
        pricingRule2: '平峰时段：工作日其余时段、周末全天及中国法定节假日全天，缓存命中、未命中输入与模型输出全部 5 折。',
        pricingRule3: '适用模型：DeepSeek-V4.1-Flash（简称 V4.1 F）与 DeepSeek-V4-Pro。',
        pricingRule4: '模型计费：DeepSeek-V4-Pro 独立计费（不再自动路由至 Flash），与 V4.1 Flash 均享峰谷分时优惠。',
        pricingRule5: '节假日与调休：调休上班的周末、中国法定节假日全天均按空闲时段计费（2026-09-19 官方声明）。',
        proRoutingNotice: 'DeepSeek-V4-Pro 独立计费（不再自动路由至 Flash），与 V4.1 Flash 均享峰谷分时优惠。',
        modelCol: '模型名称',
        inputMissCol: '基础输入 / 未命中<br><span style="font-size:10.5px;font-weight:normal;opacity:0.8;">(平峰 / 高峰)</span>',
        inputHitCol: '缓存命中输入<br><span style="font-size:10.5px;font-weight:normal;opacity:0.8;">(平峰 / 高峰)</span>',
        outputCol: '模型输出<br><span style="font-size:10.5px;font-weight:normal;opacity:0.8;">(平峰 / 高峰)</span>',

        flashHitPrice: '¥0.02 / ¥0.04',
        flashMissPrice: '¥1.00 / ¥2.00',
        flashOutPrice: '¥4.00 / ¥8.00',

        proHitPrice: '¥0.15 / ¥0.30',
        proMissPrice: '¥4.50 / ¥9.00',
        proOutPrice: '¥13.50 / ¥27.00',

        quickSettingsTitle: '显示与模式快捷设置',
        displayStyleLabel: '顶栏显示样式',
        styleIconOnly: '极简圆点 (仅图标)',
        styleCompact: '紧凑模式 (图标 + 倒计时)',
        styleFull: '完整模式 (图标 + 状态 + 倒计时)',

        settingsTitle: '指示器显示与功能设置',
        optShowInHeader: '在会话顶栏集成 (吸附在周额度右侧)',
        optShowInHeaderShort: '在会话顶栏显示',
        optFloatingMode: '全局悬浮胶囊位置',
        posNone: '关闭悬浮 (仅顶栏与侧边栏显示)',
        posRight: '右上角悬浮',
        posLeft: '左上角悬浮',
        posCenter: '顶部居中悬浮',
        optCountdown: '详情卡片显示秒级倒计时',
        optCountdownShort: '显示秒级倒计时',
        optDualTime: '显示本地与北京双时区时钟',
        optDualTimeShort: '显示双时区时钟',
        optNotify: '时段切换时发送桌面通知',
        optNotifyShort: '时段切换桌面提醒',
        notifyTestBtn: '测试通知 / 申请权限',
        notifyPermGranted: '通知权限已开启',
        notifyPermDenied: '通知权限已被浏览器拒绝',
        notifyNotSupported: '当前环境不支持桌面通知',
        notifyPeakTitle: '🟠 DeepSeek 已进入高峰价格时段',
        notifyPeakBody: '当前为业务高峰时段（北京时间 周一至周五 09:00~12:00 / 14:00~18:00，法定节假日除外），按官方正常价计费。',
        notifyOffPeakTitle: '🟢 DeepSeek 已进入平峰优惠时段',
        notifyOffPeakBody: '当前为空闲平峰时段，按高峰价格的 50% (半价) 计费。',
        btnDetails: '查看详情',
        btnSettings: '设置',
        btnClose: '关闭',
        btnReset: '恢复默认设置',
        btnOpenVisualizer: '打开全景时间轴与定价说明',
      },
      en: {
        pluginName: 'DS Peak Indicator',
        ruleTypeLabel: 'Schedule Rule',
        ruleV4Peak: 'DeepSeek Official Schedule (Weekday Peak 09-12 / 14-18 UTC+8; weekends & holidays off-peak 50%)',
        ruleCustom: 'Custom Peak Schedule',
        customStart: 'Peak Start Time (Beijing Time UTC+8)',
        customEnd: 'Peak End Time (Beijing Time UTC+8)',

        // V4 Peak Rule Strings
        offPeakStatus_v4: 'DeepSeek Official Off-Peak · 50% Discount',
        offPeakSub_v4: 'Official off-peak pricing is 50% of the standard peak rate (weekdays off-peak, weekends & statutory holidays all day)',
        offPeakShort_v4: 'Off-Peak 50%',
        offPeakIconOnly_v4: 'Off-Peak',
        peakStatus_v4: 'DeepSeek Official Peak Pricing',
        peakSub_v4: 'Peak Windows: Mon–Fri (excl. holidays) 09:00~12:00 & 14:00~18:00 (UTC+8); weekends and holidays fully off-peak',
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
        detailsTitle: 'DeepSeek Peak / Off-Peak Official Pricing',
        timelineTitle: '24-Hour Timeline (Beijing Time UTC+8)',
        timelineOffPeakDesc_v4: 'Off-Peak (weekdays 00:00~09:00, 12:00~14:00, 18:00~24:00, all day Sat/Sun & statutory holidays) 50% discount',
        timelinePeakDesc_v4: 'Peak (regular weekdays Mon–Fri 09:00~12:00 & 14:00~18:00) Standard Official Rate',
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

        holidayTag: 'Statutory Holiday · All-Day Off-Peak',
        adjustedWorkdayTag: 'Make-up Workday · Still Off-Peak',

        pricingTitle: 'Official DeepSeek API Pricing (V4.1)',
        pricingOfficialSource: 'Official Source: https://api-docs.deepseek.com/quick_start/pricing',
        pricingUnitNote: 'Unit: CNY / 1M Tokens',
        pricingEffective: 'New prices take effect at 12:00 Beijing time on Sep 10, 2026 (updated Sep 19 with holiday rules):',
        pricingRule1: 'Peak windows: Mon–Fri (excluding statutory holidays) 09:00~12:00 & 14:00~18:00 Beijing time (UTC+8).',
        pricingRule2: 'Off-peak: remaining weekday hours, all day Sat/Sun, and statutory holidays (cache hit, miss & output at 50%).',
        pricingRule3: 'Applicable models: DeepSeek-V4.1-Flash (V4.1 F) and DeepSeek-V4-Pro.',
        pricingRule4: 'Model billing: DeepSeek-V4-Pro is billed independently (no longer auto-routed to Flash); both models enjoy peak/off-peak discounts.',
        pricingRule5: 'Holidays & make-up workdays: Chinese public holidays and weekend make-up workdays are billed at off-peak rates all day.',
        proRoutingNotice: 'DeepSeek-V4-Pro is billed independently (no longer auto-routed to Flash); both models enjoy peak/off-peak discounts.',
        modelCol: 'Model',
        inputMissCol: 'Base Input (Miss)<br><span style="font-size:10.5px;font-weight:normal;opacity:0.8;">(Off / Peak)</span>',
        inputHitCol: 'Cache Hit Input<br><span style="font-size:10.5px;font-weight:normal;opacity:0.8;">(Off / Peak)</span>',
        outputCol: 'Model Output<br><span style="font-size:10.5px;font-weight:normal;opacity:0.8;">(Off / Peak)</span>',

        flashHitPrice: '¥0.02 / ¥0.04',
        flashMissPrice: '¥1.00 / ¥2.00',
        flashOutPrice: '¥4.00 / ¥8.00',

        proHitPrice: '¥0.15 / ¥0.30',
        proMissPrice: '¥4.50 / ¥9.00',
        proOutPrice: '¥13.50 / ¥27.00',

        quickSettingsTitle: 'Display & Mode Quick Settings',
        displayStyleLabel: 'Header Display Style',
        styleIconOnly: 'Icon Only (Minimal Dot)',
        styleCompact: 'Compact Mode (Icon + Countdown)',
        styleFull: 'Full Mode (Icon + Status + Countdown)',

        settingsTitle: 'Indicator Display & Feature Settings',
        optShowInHeader: 'Integrate in Session Header (Beside Quota)',
        optShowInHeaderShort: 'Show in Header',
        optFloatingMode: 'Floating Pill Position',
        posNone: 'Disabled (Header & Sidebar Only)',
        posRight: 'Top Right',
        posLeft: 'Top Left',
        posCenter: 'Top Center',
        optCountdown: 'Show Live Countdown in Details Card',
        optCountdownShort: 'Show Countdown',
        optDualTime: 'Show Dual Time Clocks',
        optDualTimeShort: 'Show Dual Clocks',
        optNotify: 'Desktop Notification on Schedule Switch',
        optNotifyShort: 'Switch Notification',
        notifyTestBtn: 'Test Notification / Request Permission',
        notifyPermGranted: 'Notification permission granted',
        notifyPermDenied: 'Notification permission was denied',
        notifyNotSupported: 'Desktop notifications are not supported in this environment',
        notifyPeakTitle: '🟠 DeepSeek Switched to Peak Pricing',
        notifyPeakBody: 'Peak pricing is now active (Mon–Fri 09:00~12:00 / 14:00~18:00 UTC+8, excluding statutory holidays).',
        notifyOffPeakTitle: '🟢 DeepSeek Switched to Off-Peak',
        notifyOffPeakBody: 'Off-peak pricing is active at 50% of standard peak prices.',
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
      if (localeService && typeof localeService.getSnapshot === 'function') {
        try {
          var snap = localeService.getSnapshot()
          if (snap && snap.active && typeof snap.active === 'string') {
            return snap.active.toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en'
          }
        } catch (_) {}
      }
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
        if (l.indexOf('en') === 0) return 'en'
      }
      return 'zh'
    }

    function t(key, params) {
      if (localeTranslate) {
        var res = localeTranslate(key, params)
        if (res !== key) return res
      }
      var lang = getLocale()
      var dict = I18N[lang] || I18N.zh
      var str = dict[key] !== undefined ? dict[key] : (I18N.zh[key] !== undefined ? I18N.zh[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key))
      if (params) {
        for (var k in params) {
          str = str.split('{' + k + '}').join(String(params[k]))
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
    // 2. Clean Solid & Glowing Colored Dot SVGs
    // =========================================================================

    var ICONS = {
      dotGreen: '<svg viewBox="0 0 16 16" width="10" height="10" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="4.5" fill="#10b981"/><circle cx="8" cy="8" r="6.5" stroke="#10b981" stroke-width="1.2" stroke-opacity="0.45"/></svg>',
      dotOrange: '<svg viewBox="0 0 16 16" width="10" height="10" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="4.5" fill="#f59e0b"/><circle cx="8" cy="8" r="6.5" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.45"/></svg>',
      clock: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      globe: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      settings: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      close: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      activity: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    }

    // =========================================================================
    // 3. Settings Storage & Notifications Helper
    // =========================================================================

    // Clamp/coerce persisted settings into the shape the rest of the code
    // expects: strict booleans, allow-listed enums, finite 0-23/0-59 ints.
    // Stale or hand-edited localStorage values must not produce NaN countdowns
    // or rule a session permanently off-peak.
    function normalizeSettings(raw) {
      var out = Object.assign({}, DEFAULT_SETTINGS)
      if (!raw || typeof raw !== 'object') return out
      var boolKeys = ['showInHeader', 'showCountdown', 'showDualTime', 'notifyOnSwitch']
      for (var i = 0; i < boolKeys.length; i++) {
        var bk = boolKeys[i]
        if (typeof raw[bk] === 'boolean') out[bk] = raw[bk]
      }
      if (raw.ruleType === 'custom' || raw.ruleType === 'v4_peak') out.ruleType = raw.ruleType
      var styles = ['compact', 'full', 'icon_only']
      if (styles.indexOf(raw.displayStyle) >= 0) out.displayStyle = raw.displayStyle
      var floatModes = ['none', 'right', 'left', 'center']
      if (floatModes.indexOf(raw.floatingMode) >= 0) out.floatingMode = raw.floatingMode
      function intIn(v, min, max) {
        var n = Math.floor(Number(v))
        if (!isFinite(n) || n < min || n > max) return -1
        return n
      }
      var hs = intIn(raw.customStartHour, 0, 23)
      var ms = intIn(raw.customStartMin, 0, 59)
      var he = intIn(raw.customEndHour, 0, 23)
      var me = intIn(raw.customEndMin, 0, 59)
      if (hs >= 0 && ms >= 0) { out.customStartHour = hs; out.customStartMin = ms }
      if (he >= 0 && me >= 0) { out.customEndHour = he; out.customEndMin = me }
      return out
    }

    function loadSettings() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          var parsed = JSON.parse(raw)
          return normalizeSettings(parsed)
        }
      } catch (e) {}
      return Object.assign({}, DEFAULT_SETTINGS)
    }

    function saveSettings(cfg) {
      try {
        var normalized = normalizeSettings(cfg)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dsh:peak-settings-changed', { detail: normalized }))
        }
      } catch (e) {}
    }

    var lastNotifiedPeakState = null

    function checkAndSendNotification(status, settings) {
      if (!settings.notifyOnSwitch) return
      if (typeof window === 'undefined' || !('Notification' in window)) return
      if (Notification.permission !== 'granted') return

      if (lastNotifiedPeakState === null) {
        lastNotifiedPeakState = status.isPeak
        return
      }

      if (lastNotifiedPeakState !== status.isPeak) {
        lastNotifiedPeakState = status.isPeak
        var title = status.isPeak ? t('notifyPeakTitle') : t('notifyOffPeakTitle')
        var body = status.isPeak ? t('notifyPeakBody') : t('notifyOffPeakBody')
        try {
          new Notification(title, { body: body, icon: '/favicon.ico' })
        } catch (_) {}
      }
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

    // China Statutory Public Holidays (国务院办公厅公布法定放假公休安排)
    // DeepSeek 2026-09-19 官方峰谷说明：中国法定节假日全天按空闲时段计费。
    var CHINA_HOLIDAYS = {
      // 2025
      '2025-01-01': '元旦',
      '2025-01-28': '除夕', '2025-01-29': '春节', '2025-01-30': '春节', '2025-01-31': '春节',
      '2025-02-01': '春节', '2025-02-02': '春节', '2025-02-03': '春节', '2025-02-04': '春节',
      '2025-04-04': '清明节', '2025-04-05': '清明节', '2025-04-06': '清明节',
      '2025-05-01': '劳动节', '2025-05-02': '劳动节', '2025-05-03': '劳动节', '2025-05-04': '劳动节', '2025-05-05': '劳动节',
      '2025-05-31': '端午节', '2025-06-01': '端午节', '2025-06-02': '端午节',
      '2025-10-01': '国庆节', '2025-10-02': '国庆节', '2025-10-03': '国庆节', '2025-10-04': '中秋节',
      '2025-10-05': '国庆节', '2025-10-06': '国庆节', '2025-10-07': '国庆节', '2025-10-08': '国庆节',

      // 2026
      '2026-01-01': '元旦', '2026-01-02': '元旦', '2026-01-03': '元旦',
      '2026-02-15': '春节', '2026-02-16': '春节', '2026-02-17': '春节', '2026-02-18': '春节', '2026-02-19': '春节',
      '2026-02-20': '春节', '2026-02-21': '春节', '2026-02-22': '春节', '2026-02-23': '春节',
      '2026-04-04': '清明节', '2026-04-05': '清明节', '2026-04-06': '清明节',
      '2026-05-01': '劳动节', '2026-05-02': '劳动节', '2026-05-03': '劳动节', '2026-05-04': '劳动节', '2026-05-05': '劳动节',
      '2026-06-19': '端午节', '2026-06-20': '端午节', '2026-06-21': '端午节',
      '2026-09-25': '中秋节', '2026-09-26': '中秋节', '2026-09-27': '中秋节',
      '2026-10-01': '国庆节', '2026-10-02': '国庆节', '2026-10-03': '国庆节', '2026-10-04': '国庆节',
      '2026-10-05': '国庆节', '2026-10-06': '国庆节', '2026-10-07': '国庆节',
    }

    // 周末调休上班日（按 DeepSeek 官方 2026-09-19 说明，调休上班的周末全天仍按空闲平峰 5 折计费）
    var CHINA_WORKDAYS_WEEKEND = {
      // 2025
      '2025-01-26': true, '2025-02-08': true, '2025-04-27': true, '2025-05-10': true,
      '2025-09-28': true, '2025-10-11': true,

      // 2026
      '2026-01-04': true, '2026-02-14': true, '2026-02-28': true, '2026-05-09': true,
      '2026-09-20': true, '2026-10-10': true,
    }

    function getChinaHolidayName(year, month, day) {
      var dateKey = year + '-' + padZero(month) + '-' + padZero(day)
      return CHINA_HOLIDAYS[dateKey] || null
    }

    function isChinaHoliday(year, month, day) {
      return !!getChinaHolidayName(year, month, day)
    }

    function isChinaAdjustedWorkday(year, month, day) {
      var dateKey = year + '-' + padZero(month) + '-' + padZero(day)
      return !!CHINA_WORKDAYS_WEEKEND[dateKey]
    }

    // `now` is optional so tests can pin a deterministic instant; production
    // callers omit it and get the real clock.
    function calculateStatus(settings, now) {
      now = now || new Date()
      var bj = getBeijingTime(now)
      var bjMinutes = bj.hour * 60 + bj.minute + bj.second / 60

      var bjDateKey = bj.year + '-' + padZero(bj.month) + '-' + padZero(bj.day)
      var holidayNameToday = CHINA_HOLIDAYS[bjDateKey] || null
      var holidayToday = !!holidayNameToday
      var adjustedWorkdayToday = !!CHINA_WORKDAYS_WEEKEND[bjDateKey]

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
        // Support overnight windows (start >= end): peak until endMin next day.
        var overnight = endMin <= startMin
        if (overnight) {
          isPeak = bjMinutes >= startMin || bjMinutes < endMin
        } else {
          isPeak = bjMinutes >= startMin && bjMinutes < endMin
        }

        if (isPeak) {
          targetHour = Math.floor(endMin / 60)
          targetMin = endMin % 60
          if (overnight && bjMinutes >= startMin) {
            // Evening segment of an overnight window: it ends tomorrow.
            targetDay += 1
          }
        } else {
          // Off-peak: next transition is the next peak start, on today unless
          // today's start has already passed.
          targetHour = Math.floor(startMin / 60)
          targetMin = startMin % 60
          if (bjMinutes >= startMin) {
            targetDay += 1
          }
        }
      } else {
        // DeepSeek V4 Official Peak Windows (Beijing time), MON–FRI ONLY:
        // Window 1: 09:00 ~ 12:00 (540 ~ 720 min)
        // Window 2: 14:00 ~ 18:00 (840 ~ 1080 min)
        // Remainder: Off-Peak — including ALL DAY Saturday & Sunday, and ALL DAY
        // Chinese statutory public holidays (official policy updated Sep 19, 2026).
        var PEAK_WINDOWS = [[540, 720], [840, 1080]]
        var bjDow = new Date(Date.UTC(bj.year, bj.month - 1, bj.day)).getUTCDay() // 0=Sun..6=Sat
        var weekendToday = (bjDow === 0 || bjDow === 6)

        if (!weekendToday && !holidayToday) {
          for (var wi = 0; wi < PEAK_WINDOWS.length; wi++) {
            if (bjMinutes >= PEAK_WINDOWS[wi][0] && bjMinutes < PEAK_WINDOWS[wi][1]) {
              isPeak = true
              targetHour = Math.floor(PEAK_WINDOWS[wi][1] / 60)
              targetMin = PEAK_WINDOWS[wi][1] % 60
              break
            }
          }
        }

        if (!isPeak) {
          // Next switch = next peak-window start. Scan forward day by day
          // (today first, max 16 days to span full 7-9 day holiday periods):
          // Weekends and Chinese statutory holidays carry no peak windows,
          // landing queries on the next normal working day morning at 09:00.
          for (var dayOffset = 0; dayOffset <= 16; dayOffset++) {
            var kDate = new Date(Date.UTC(bj.year, bj.month - 1, bj.day + dayOffset))
            var dowK = kDate.getUTCDay()
            if (dowK === 0 || dowK === 6) continue
            var kYear = kDate.getUTCFullYear()
            var kMonth = kDate.getUTCMonth() + 1
            var kDay = kDate.getUTCDate()
            if (isChinaHoliday(kYear, kMonth, kDay)) continue

            var foundNext = false
            for (var wj = 0; wj < PEAK_WINDOWS.length; wj++) {
              // Beijing midnight of (kYear, kMonth, kDay) in epoch ms:
              // hour=-8 rolls midnight CST back to 16:00 UTC of the prior day.
              var startMs = Date.UTC(kYear, kMonth - 1, kDay, -8, 0, 0) + PEAK_WINDOWS[wj][0] * 60000
              if (startMs > now.getTime()) {
                targetYear = kYear
                targetMonth = kMonth
                targetDay = kDay
                targetHour = Math.floor(PEAK_WINDOWS[wj][0] / 60)
                targetMin = PEAK_WINDOWS[wj][0] % 60
                foundNext = true
                break
              }
            }
            if (foundNext) break
          }
        }
      }

      var isOffPeak = !isPeak
      var statusKey = isPeak ? 'peakStatus_v4' : 'offPeakStatus_v4'
      var subKey = isPeak ? 'peakSub_v4' : 'offPeakSub_v4'
      var shortKey = isPeak ? 'peakShort_v4' : 'offPeakShort_v4'
      var iconOnlyKey = isPeak ? 'peakIconOnly_v4' : 'offPeakIconOnly_v4'
      var countdownKey = isPeak ? 'countdownToOffPeak_v4' : 'countdownToPeak_v4'

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
        isHoliday: holidayToday,
        holidayName: holidayNameToday,
        isAdjustedWorkday: adjustedWorkdayToday,
        isWeekend: weekendToday,
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
      var existing = document.getElementById(STYLE_ID)
      // Self-heal: keep only a tag we own that actually carries this plugin's
      // CSS. A stale tag from a previous load, one claimed by another entry
      // (missing data-plugin owner), or an emptied tag must be replaced so the
      // header chip never runs without background/border/cursor styles.
      if (existing) {
        var owned = existing.getAttribute('data-plugin') === PLUGIN_ID
        var hasCss = (existing.textContent || '').indexOf(CHIP_STYLE_MARKER) >= 0
        if (owned && hasCss) return
        existing.parentNode.removeChild(existing)
      }

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
        /* Themed skins style header descendants with high-specificity rules
           (e.g. `header :is(div,span,button){color:inherit}`) that outrank the
           single-class rules above. Repeat the state colors under the slot
           anchor so bg/border/text/cursor survive a skin. */
        '[data-slot="conversation.session.header.actions"] .dspi-header-chip {',
        '  cursor: pointer;',
        '}',
        '[data-slot="conversation.session.header.actions"] .dspi-header-chip-offpeak {',
        '  background: var(--dspi-bg-offpeak);',
        '  border-color: var(--dspi-border-offpeak);',
        '  color: var(--dspi-text-offpeak);',
        '}',
        '[data-slot="conversation.session.header.actions"] .dspi-header-chip-peak {',
        '  background: var(--dspi-bg-peak);',
        '  border-color: var(--dspi-border-peak);',
        '  color: var(--dspi-text-peak);',
        '}',
        '.dspi-header-chip-icononly {',
        '  padding: 0 6px;',
        '  height: 26px;',
        '}',
        '.dspi-countdown-val {',
        '  font-family: var(--font-mono, ui-monospace, SFMono-Regular, monospace);',
        '  font-variant-numeric: tabular-nums;',
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
        '.dspi-floating-pill.dspi-floating-center:hover {',
        '  transform: translateX(-50%) translateY(-1px);',
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
        '  transition: left 0.5s linear;',
        '}',
        '.dspi-timeline-pin::after {',
        '  content: "";',
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
        '  padding: 8px 10px;',
        '  text-align: left;',
        '  border-bottom: 1px solid var(--dspi-border);',
        '}',
        '.dspi-table th {',
        '  color: var(--dspi-text-secondary);',
        '  font-weight: 600;',
        '  line-height: 1.35;',
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
      styleEl.id = STYLE_ID
      // Own the tag explicitly: the loader's claimStyles() only tags
      // `style:not([data-plugin])`, and HMR's removeOwnedStyles() sweeps by
      // data-plugin. Without these attributes the sheet can be claimed by (and
      // later deleted with) an unrelated plugin's rebuild — which is what
      // intermittently stripped the header chip of background/border/cursor.
      styleEl.setAttribute('data-plugin', PLUGIN_ID)
      styleEl.setAttribute('data-plugin-css', STYLE_ID)
      styleEl.textContent = css
      document.head.appendChild(styleEl)
    }

    // =========================================================================
    // 6. Modal Overlay Component & Live Timer Manager
    // =========================================================================

    var modalContainer = null
    var modalTimer = null
    var modalRemovalTimer = null

    function closeModal() {
      if (modalTimer) {
        clearInterval(modalTimer)
        modalTimer = null
      }
      if (modalContainer) {
        // Capture the specific node and generation: if the modal is reopened
        // before the fade-out timer fires, the timer must not detach the
        // freshly-reopened overlay.
        var el = modalContainer
        var closedGeneration = (el.__dspiOpenGeneration || 0) + 1
        el.__dspiOpenGeneration = closedGeneration
        el.classList.remove('dspi-open')
        if (modalRemovalTimer) clearTimeout(modalRemovalTimer)
        modalRemovalTimer = setTimeout(function () {
          modalRemovalTimer = null
          if (el.parentNode && el.__dspiOpenGeneration === closedGeneration) {
            el.parentNode.removeChild(el)
            if (modalContainer === el) modalContainer = null
          }
        }, 220)
      }
    }

    function disposeModal() {
      if (modalTimer) { clearInterval(modalTimer); modalTimer = null }
      if (modalRemovalTimer) { clearTimeout(modalRemovalTimer); modalRemovalTimer = null }
      if (modalContainer && modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer)
      }
      modalContainer = null
    }

    function openDetailsModal() {
      renderModal()
    }

    function updateModalTick() {
      if (!modalContainer) return
      var settings = loadSettings()
      var status = calculateStatus(settings)

      // 1. Live Countdown
      var cdClock = modalContainer.querySelector('.dspi-countdown-clock')
      if (cdClock) cdClock.textContent = status.countdownStr
      var cdLbl = modalContainer.querySelector('.dspi-countdown-lbl')
      if (cdLbl) cdLbl.textContent = t(status.countdownKey)

      // 2. Dual Clocks
      var clockTimes = modalContainer.querySelectorAll('.dspi-clock-time')
      if (clockTimes && clockTimes.length >= 2) {
        clockTimes[0].textContent = status.localTimeStr
        clockTimes[1].textContent = status.beijingTimeStr
      }

      // 3. Switch Details
      var nextTargetText = status.isOffPeak ? t('peakShort_v4') : t('offPeakShort_v4')
      var nextSwitchText = t('nextSwitchDetail', {
        time: status.targetLocalStr,
        target: nextTargetText,
      })
      var switchEl = modalContainer.querySelector('.dspi-next-switch-txt')
      if (switchEl) switchEl.textContent = nextSwitchText

      // 4. Timeline Cursor Pin
      var pin = modalContainer.querySelector('.dspi-timeline-pin')
      if (pin) {
        pin.style.left = status.dayProgressPercent + '%'
        var currentTooltip = t('timelineCurrentHover', {
          time: status.beijingTimeStr,
          status: t(status.shortKey),
        })
        pin.title = currentTooltip
        pin.setAttribute('data-tooltip', currentTooltip)
        pin.setAttribute('aria-label', currentTooltip)
      }
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
        '    <div>• ' + t('pricingRule4') + '</div>',
        '    <div>• ' + t('pricingRule5') + '</div>',
        '    <div style="font-size:10.5px;color:var(--dspi-text-tertiary);margin-top:4px;">' + t('pricingOfficialSource') + '</div>',
        '  </div>',
        '  <table class="dspi-table">',
        '    <thead>',
        '      <tr>',
        '        <th>' + t('modelCol') + '</th>',
        '        <th>' + t('inputMissCol') + '</th>',
        '        <th>' + t('inputHitCol') + '</th>',
        '        <th>' + t('outputCol') + '</th>',
        '      </tr>',
        '    </thead>',
        '    <tbody>',
        '      <tr>',
        '        <td><strong>DeepSeek-V4.1-Flash (V4.1 F)</strong></td>',
        '        <td>' + t('flashMissPrice') + '</td>',
        '        <td>' + t('flashHitPrice') + '</td>',
        '        <td>' + t('flashOutPrice') + '</td>',
        '      </tr>',
        '      <tr>',
        '        <td><strong>DeepSeek-V4-Pro</strong></td>',
        '        <td>' + t('proMissPrice') + '</td>',
        '        <td>' + t('proHitPrice') + '</td>',
        '        <td>' + t('proOutPrice') + '</td>',
        '      </tr>',
        '    </tbody>',
        '  </table>',
        '  <div style="margin-top:8px;padding:7px 10px;border-radius:6px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.22);font-size:11.5px;line-height:1.5;color:var(--dspi-text-secondary);display:flex;align-items:center;gap:6px;">',
        '    <span style="font-weight:600;color:var(--dsw-alias-brand-primary, #2563eb);">ℹ️</span>',
        '    <span>' + t('proRoutingNotice') + '</span>',
        '  </div>',
        '</div>',
      ].join('')

      var quickSettingsHtml = [
        '<div class="dspi-timeline-box" style="margin-top:2px;">',
        '  <div class="dspi-section-h" style="justify-content:space-between;margin-bottom:12px;">',
        '    <span style="display:flex;align-items:center;gap:6px;">' + ICONS.settings + ' ' + t('quickSettingsTitle') + '</span>',
        '    <button class="dspi-btn dspi-modal-reset-btn" style="padding:2px 8px;font-size:11px;height:24px;">' + t('btnReset') + '</button>',
        '  </div>',
        '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">',
        '    <div>',
        '      <label style="display:block;font-size:11.5px;font-weight:600;margin-bottom:4px;color:var(--dspi-text-secondary);">' + t('displayStyleLabel') + '</label>',
        '      <select class="dspi-modal-select-display" style="width:100%;font-size:12px;padding:4px 8px;border-radius:6px;border:1px solid var(--dspi-border);background:var(--dspi-card-bg);color:var(--dspi-text-primary);">',
        '        <option value="compact"' + (settings.displayStyle === 'compact' ? ' selected' : '') + '>' + t('styleCompact') + '</option>',
        '        <option value="full"' + (settings.displayStyle === 'full' ? ' selected' : '') + '>' + t('styleFull') + '</option>',
        '        <option value="icon_only"' + (settings.displayStyle === 'icon_only' ? ' selected' : '') + '>' + t('styleIconOnly') + '</option>',
        '      </select>',
        '    </div>',
        '    <div>',
        '      <label style="display:block;font-size:11.5px;font-weight:600;margin-bottom:4px;color:var(--dspi-text-secondary);">' + t('optFloatingMode') + '</label>',
        '      <select class="dspi-modal-select-floating" style="width:100%;font-size:12px;padding:4px 8px;border-radius:6px;border:1px solid var(--dspi-border);background:var(--dspi-card-bg);color:var(--dspi-text-primary);">',
        '        <option value="none"' + (settings.floatingMode === 'none' ? ' selected' : '') + '>' + t('posNone') + '</option>',
        '        <option value="right"' + (settings.floatingMode === 'right' ? ' selected' : '') + '>' + t('posRight') + '</option>',
        '        <option value="left"' + (settings.floatingMode === 'left' ? ' selected' : '') + '>' + t('posLeft') + '</option>',
        '        <option value="center"' + (settings.floatingMode === 'center' ? ' selected' : '') + '>' + t('posCenter') + '</option>',
        '      </select>',
        '    </div>',
        '  </div>',
        '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">',
        '    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">',
        '      <input type="checkbox" class="dspi-modal-chk-header"' + (settings.showInHeader ? ' checked' : '') + '/>',
        '      <span>' + t('optShowInHeaderShort') + '</span>',
        '    </label>',
        '    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">',
        '      <input type="checkbox" class="dspi-modal-chk-countdown"' + (settings.showCountdown ? ' checked' : '') + '/>',
        '      <span>' + t('optCountdownShort') + '</span>',
        '    </label>',
        '    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">',
        '      <input type="checkbox" class="dspi-modal-chk-dualtime"' + (settings.showDualTime ? ' checked' : '') + '/>',
        '      <span>' + t('optDualTimeShort') + '</span>',
        '    </label>',
        '    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">',
        '      <input type="checkbox" class="dspi-modal-chk-notify"' + (settings.notifyOnSwitch ? ' checked' : '') + '/>',
        '      <span>' + t('optNotifyShort') + '</span>',
        '    </label>',
        '  </div>',
        '</div>',
      ].join('')

      var heroBadgeHtml = ''
      if (status.isHoliday && status.holidayName) {
        heroBadgeHtml = '<div style="display:inline-flex;align-items:center;gap:5px;margin-bottom:6px;padding:2px 8px;border-radius:12px;background:rgba(16,185,129,0.12);color:var(--dspi-timeline-offpeak, #10b981);font-size:11px;font-weight:600;">🇨🇳 ' + escapeHtmlAttr(status.holidayName) + ' · ' + t('holidayTag') + '</div>'
      } else if (status.isAdjustedWorkday) {
        heroBadgeHtml = '<div style="display:inline-flex;align-items:center;gap:5px;margin-bottom:6px;padding:2px 8px;border-radius:12px;background:rgba(16,185,129,0.12);color:var(--dspi-timeline-offpeak, #10b981);font-size:11px;font-weight:600;">💼 ' + t('adjustedWorkdayTag') + '</div>'
      }

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
        (heroBadgeHtml ? '        ' + heroBadgeHtml : ''),
        '        <div class="dspi-hero-title">',
        '          ' + heroDot + ' ' + t(status.statusKey),
        '        </div>',
        '        <div class="dspi-hero-desc">' + t(status.subKey) + '</div>',
        '        <div class="dspi-hero-desc dspi-next-switch-txt" style="margin-top:6px;color:var(--dspi-text-primary);font-weight:600;">' + nextSwitchText + '</div>',
        '      </div>',
        (settings.showCountdown ? [
        '      <div class="dspi-hero-countdown">',
        '        <div class="dspi-countdown-lbl">' + t(status.countdownKey) + '</div>',
        '        <div class="dspi-countdown-clock">' + status.countdownStr + '</div>',
        '      </div>',
        ].join('') : ''),
        '    </div>',

        (settings.showDualTime ? [
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
        ].join('') : ''),

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

        '    <!-- Quick Settings Section in Modal -->',
        '    ' + quickSettingsHtml,
        '  </div>',
        '</div>',
      ].join('\n')

      modalContainer.innerHTML = modalHtml
      // Reopen generation: closeModal()'s pending removal timer captures the
      // generation at close time and only detaches a node that is still that
      // generation AND still closed, so a fast reopen is never yanked.
      modalContainer.__dspiOpenGeneration = (modalContainer.__dspiOpenGeneration || 0) + 1
      modalContainer.classList.add('dspi-open')

      modalContainer.onclick = function (e) {
        if (e.target === modalContainer) closeModal()
      }
      var closeBtn = modalContainer.querySelector('.dspi-modal-close-btn')
      if (closeBtn) closeBtn.onclick = closeModal

      // Bind quick settings controls in modal
      var selDisplay = modalContainer.querySelector('.dspi-modal-select-display')
      if (selDisplay) {
        selDisplay.onchange = function (e) {
          settings.displayStyle = e.target.value
          saveSettings(settings)
        }
      }
      var selFloating = modalContainer.querySelector('.dspi-modal-select-floating')
      if (selFloating) {
        selFloating.onchange = function (e) {
          settings.floatingMode = e.target.value
          saveSettings(settings)
        }
      }
      var chkHeader = modalContainer.querySelector('.dspi-modal-chk-header')
      if (chkHeader) {
        chkHeader.onchange = function (e) {
          settings.showInHeader = e.target.checked
          saveSettings(settings)
        }
      }
      var chkCountdown = modalContainer.querySelector('.dspi-modal-chk-countdown')
      if (chkCountdown) {
        chkCountdown.onchange = function (e) {
          settings.showCountdown = e.target.checked
          saveSettings(settings)
          renderModal()
        }
      }
      var chkDualTime = modalContainer.querySelector('.dspi-modal-chk-dualtime')
      if (chkDualTime) {
        chkDualTime.onchange = function (e) {
          settings.showDualTime = e.target.checked
          saveSettings(settings)
          renderModal()
        }
      }
      var chkNotify = modalContainer.querySelector('.dspi-modal-chk-notify')
      if (chkNotify) {
        chkNotify.onchange = function (e) {
          var checked = e.target.checked
          if (checked && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission().then(function (p) {
              settings.notifyOnSwitch = (p === 'granted')
              saveSettings(settings)
            })
          } else {
            settings.notifyOnSwitch = checked
            saveSettings(settings)
          }
        }
      }
      var resetBtn = modalContainer.querySelector('.dspi-modal-reset-btn')
      if (resetBtn) {
        resetBtn.onclick = function () {
          saveSettings(DEFAULT_SETTINGS)
          renderModal()
        }
      }

      // Start live ticking timer while modal is active
      if (modalTimer) clearInterval(modalTimer)
      modalTimer = setInterval(updateModalTick, 1000)
    }

    // =========================================================================
    // 7. Session Header Native Chip (Order 35: Attached right of Quota #30)
    // =========================================================================

    // Inline palette + hover handlers for the header chip: the chip must keep
    // its translucent box and pointer cursor even in the brief window while the
    // injected stylesheet is absent (foreign-plugin HMR sweep, stale tag etc).
    // Inline styles also win over themed-skin `header :is(div,...){}` rules.
    function chipBasePalette(isOffPeak) {
      return {
        bg: isOffPeak ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
        bgHover: isOffPeak ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
        border: isOffPeak ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)',
        borderHover: isOffPeak ? 'rgba(16, 185, 129, 0.55)' : 'rgba(245, 158, 11, 0.55)',
        text: isOffPeak ? '#10b981' : '#f59e0b',
      }
    }

    function chipStyle(isOffPeak, padding) {
      var p = chipBasePalette(isOffPeak)
      var style = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '26px',
        padding: padding || '0 9px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        flexShrink: '0',
        background: p.bg,
        border: '1px solid ' + p.border,
        color: p.text,
        transition: 'background 0.18s ease, border-color 0.18s ease',
      }
      return style
    }

    function chipHoverHandlers(isOffPeak) {
      var p = chipBasePalette(isOffPeak)
      return {
        onMouseEnter: function (e) {
          var el = e.currentTarget
          el.style.background = p.bgHover
          el.style.borderColor = p.borderHover
        },
        onMouseLeave: function (e) {
          var el = e.currentTarget
          el.style.background = p.bg
          el.style.borderColor = p.border
        },
      }
    }

    function chipKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openDetailsModal()
      }
    }

    function HeaderChipComponent() {
      useLocaleRevision()
      var [tick, setTick] = React.useState(0)
      var [cfg, setCfg] = React.useState(loadSettings())

      React.useEffect(function () {
        var timer = setInterval(function () {
          // Self-heal: if any reload/HMR removed (or mis-owned) the injected
          // stylesheet, restore it. injectStyles() early-returns when the tag
          // exists and is correctly owned.
          injectStyles()
          setTick(function (t) { return t + 1 })
        }, 1000)
        function onSettingsChange(e) {
          if (e && e.detail) setCfg(e.detail)
          else setCfg(loadSettings())
        }
        window.addEventListener('dsh:peak-settings-changed', onSettingsChange)
        return function () {
          clearInterval(timer)
          window.removeEventListener('dsh:peak-settings-changed', onSettingsChange)
        }
      }, [])

      if (!cfg.showInHeader) return null

      var status = calculateStatus(cfg)
      var chipClass = status.isOffPeak ? 'dspi-header-chip-offpeak' : 'dspi-header-chip-peak'
      var dotHtml = status.isOffPeak ? ICONS.dotGreen : ICONS.dotOrange
      var displayStyle = cfg.displayStyle || 'compact'
      // Header chips keep the discount amount out of the visible label.
      var headerLabelKey = status.isOffPeak ? status.iconOnlyKey : status.shortKey
      var chipInline = chipStyle(status.isOffPeak)
      var chipHover = chipHoverHandlers(status.isOffPeak)
      var chipA11y = { role: 'button', tabIndex: 0, 'aria-haspopup': 'dialog', onKeyDown: chipKeyDown }
      var chipTitle = t(status.statusKey) + (status.holidayName ? ' · ' + status.holidayName : (status.isAdjustedWorkday ? ' · ' + t('adjustedWorkdayTag') : '')) + ' (' + t(status.countdownKey) + ' ' + status.countdownStr + ')'

      if (displayStyle === 'icon_only') {
        chipInline.padding = '0 6px'
        return React.createElement(
          'div',
          Object.assign({}, chipA11y, chipHover, {
            className: 'dspi-header-chip dspi-header-chip-icononly ' + chipClass,
            title: chipTitle,
            style: chipInline,
            onClick: openDetailsModal,
          }),
          React.createElement('span', {
            dangerouslySetInnerHTML: { __html: dotHtml },
            style: { display: 'inline-flex', alignItems: 'center' },
          })
        )
      }

      if (displayStyle === 'full') {
        return React.createElement(
          'div',
          Object.assign({}, chipA11y, chipHover, {
            className: 'dspi-header-chip ' + chipClass,
            title: t('detailsTitle'),
            style: chipInline,
            onClick: openDetailsModal,
          }),
          React.createElement('span', {
            dangerouslySetInnerHTML: { __html: dotHtml },
            style: { display: 'inline-flex', alignItems: 'center' },
          }),
          React.createElement('span', null, t(headerLabelKey)),
          React.createElement('span', { className: 'dspi-countdown-val' }, status.countdownStr)
        )
      }

      // Default 'compact': Icon + Countdown (顶部显示图标和倒计时)
      return React.createElement(
        'div',
        Object.assign({}, chipA11y, chipHover, {
          className: 'dspi-header-chip ' + chipClass,
          title: chipTitle,
          style: chipInline,
          onClick: openDetailsModal,
        }),
        React.createElement('span', {
          dangerouslySetInnerHTML: { __html: dotHtml },
          style: { display: 'inline-flex', alignItems: 'center' },
        }),
        React.createElement('span', { className: 'dspi-countdown-val' }, status.countdownStr)
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
    // 9. Global Floating Pill Component (Optional Floating Mode)
    // =========================================================================

    function FloatingPillComponent() {
      useLocaleRevision()
      var [tick, setTick] = React.useState(0)
      var [cfg, setCfg] = React.useState(loadSettings())
      var cfgRef = React.useRef(cfg)
      cfgRef.current = cfg

      React.useEffect(function () {
        var timer = setInterval(function () {
          injectStyles()
          if (cfgRef.current && cfgRef.current.floatingMode && cfgRef.current.floatingMode !== 'none') {
            setTick(function (t) { return t + 1 })
          }
        }, 1000)
        function onSettingsChange(e) {
          if (e && e.detail) setCfg(e.detail)
          else setCfg(loadSettings())
        }
        window.addEventListener('dsh:peak-settings-changed', onSettingsChange)
        return function () {
          clearInterval(timer)
          window.removeEventListener('dsh:peak-settings-changed', onSettingsChange)
        }
      }, [])

      if (!cfg.floatingMode || cfg.floatingMode === 'none') return null

      var status = calculateStatus(cfg)
      var chipClass = status.isOffPeak ? 'dspi-header-chip-offpeak' : 'dspi-header-chip-peak'
      var dotHtml = status.isOffPeak ? ICONS.dotGreen : ICONS.dotOrange
      var posClass = 'dspi-floating-' + cfg.floatingMode
      var headerLabelKey = status.isOffPeak ? status.iconOnlyKey : status.shortKey
      var pillTitle = t(status.statusKey) + (status.holidayName ? ' · ' + status.holidayName : (status.isAdjustedWorkday ? ' · ' + t('adjustedWorkdayTag') : '')) + ' (' + t(status.countdownKey) + ' ' + status.countdownStr + ')'

      return React.createElement(
        'div',
        Object.assign({}, chipHoverHandlers(status.isOffPeak), {
          className: 'dspi-floating-pill ' + posClass + ' ' + chipClass,
          title: pillTitle,
          style: { cursor: 'pointer' },
          role: 'button',
          tabIndex: 0,
          'aria-haspopup': 'dialog',
          onKeyDown: chipKeyDown,
          onClick: openDetailsModal,
        }),
        React.createElement('span', {
          dangerouslySetInnerHTML: { __html: dotHtml },
          style: { display: 'inline-flex', alignItems: 'center' },
        }),
        React.createElement('span', null, t(headerLabelKey)),
        cfg.showCountdown ? React.createElement('span', { className: 'dspi-countdown-val' }, status.countdownStr) : null
      )
    }

    // =========================================================================
    // 10. Comprehensive DSH Settings Tab Component
    // =========================================================================

    function SettingsSectionComponent() {
      useLocaleRevision()
      var [cfg, setCfg] = React.useState(loadSettings())
      var [notifStatus, setNotifStatus] = React.useState('')

      function update(patch) {
        var next = Object.assign({}, cfg, patch)
        setCfg(next)
        saveSettings(next)
      }

      function handleTestNotification() {
        if (typeof window === 'undefined' || !('Notification' in window)) {
          setNotifStatus(t('notifyNotSupported'))
          return
        }
        if (Notification.permission === 'granted') {
          setNotifStatus(t('notifyPermGranted'))
          var status = calculateStatus(cfg)
          var title = status.isPeak ? t('notifyPeakTitle') : t('notifyOffPeakTitle')
          var body = status.isPeak ? t('notifyPeakBody') : t('notifyOffPeakBody')
          new Notification(title, { body: body })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
              setNotifStatus(t('notifyPermGranted'))
              var status = calculateStatus(cfg)
              var title = status.isPeak ? t('notifyPeakTitle') : t('notifyOffPeakTitle')
              var body = status.isPeak ? t('notifyPeakBody') : t('notifyOffPeakBody')
              new Notification(title, { body: body })
            } else {
              setNotifStatus(t('notifyPermDenied'))
            }
          })
        } else {
          setNotifStatus(t('notifyPermDenied'))
        }
      }

      // Live peak/off-peak status dot in the settings card header — the same
      // green/orange indicator the header chip shows, so the card is
      // recognizable and reflects the current schedule state.
      var settingsStatusDot = calculateStatus(cfg).isOffPeak ? ICONS.dotGreen : ICONS.dotOrange

      return React.createElement(
        'div',
        { className: 'dsh-settings-section dspi-settings-pane', style: { padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '18px' } },
        React.createElement(
          'h3',
          { style: { fontSize: '15px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--dspi-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement('span', {
            dangerouslySetInnerHTML: { __html: settingsStatusDot },
            style: { display: 'inline-flex', alignItems: 'center', transform: 'scale(1.2)' },
          }),
          t('pluginName')
        ),

        // Display Style
        React.createElement(
          'div',
          null,
          React.createElement('label', { style: { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' } }, t('displayStyleLabel')),
          React.createElement(
            'select',
            {
              className: 'dsh-select',
              value: cfg.displayStyle,
              onChange: function (e) { update({ displayStyle: e.target.value }) },
              style: { width: '100%', maxWidth: '340px', padding: '6px 10px', borderRadius: '6px' },
            },
            React.createElement('option', { value: 'compact' }, t('styleCompact')),
            React.createElement('option', { value: 'full' }, t('styleFull')),
            React.createElement('option', { value: 'icon_only' }, t('styleIconOnly'))
          )
        ),

        // Floating Mode
        React.createElement(
          'div',
          null,
          React.createElement('label', { style: { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' } }, t('optFloatingMode')),
          React.createElement(
            'select',
            {
              className: 'dsh-select',
              value: cfg.floatingMode || 'none',
              onChange: function (e) { update({ floatingMode: e.target.value }) },
              style: { width: '100%', maxWidth: '340px', padding: '6px 10px', borderRadius: '6px' },
            },
            React.createElement('option', { value: 'none' }, t('posNone')),
            React.createElement('option', { value: 'right' }, t('posRight')),
            React.createElement('option', { value: 'left' }, t('posLeft')),
            React.createElement('option', { value: 'center' }, t('posCenter'))
          )
        ),

        // Schedule Rule Mode
        React.createElement(
          'div',
          null,
          React.createElement('label', { style: { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' } }, t('ruleTypeLabel')),
          React.createElement(
            'select',
            {
              className: 'dsh-select',
              value: cfg.ruleType || 'v4_peak',
              onChange: function (e) { update({ ruleType: e.target.value }) },
              style: { width: '100%', maxWidth: '340px', padding: '6px 10px', borderRadius: '6px' },
            },
            React.createElement('option', { value: 'v4_peak' }, t('ruleV4Peak')),
            React.createElement('option', { value: 'custom' }, t('ruleCustom'))
          ),
          cfg.ruleType === 'custom' ? React.createElement(
            'div',
            { style: { marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '340px' } },
            React.createElement(
              'div',
              { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' } },
              React.createElement('span', null, t('customStart') + ':'),
              React.createElement('input', {
                type: 'time',
                value: padZero(cfg.customStartHour) + ':' + padZero(cfg.customStartMin),
                onChange: function (e) {
                  var parts = e.target.value.split(':')
                  if (parts.length === 2) update({ customStartHour: parseInt(parts[0], 10), customStartMin: parseInt(parts[1], 10) })
                },
                style: { padding: '3px 6px', borderRadius: '4px', border: '1px solid var(--dspi-border)' }
              })
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' } },
              React.createElement('span', null, t('customEnd') + ':'),
              React.createElement('input', {
                type: 'time',
                value: padZero(cfg.customEndHour) + ':' + padZero(cfg.customEndMin),
                onChange: function (e) {
                  var parts = e.target.value.split(':')
                  if (parts.length === 2) update({ customEndHour: parseInt(parts[0], 10), customEndMin: parseInt(parts[1], 10) })
                },
                style: { padding: '3px 6px', borderRadius: '4px', border: '1px solid var(--dspi-border)' }
              })
            )
          ) : null
        ),

        // Toggles list
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          React.createElement(
            'label',
            { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' } },
            React.createElement('input', {
              type: 'checkbox',
              checked: cfg.showInHeader,
              onChange: function (e) { update({ showInHeader: e.target.checked }) },
            }),
            React.createElement('span', null, t('optShowInHeader'))
          ),
          React.createElement(
            'label',
            { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' } },
            React.createElement('input', {
              type: 'checkbox',
              checked: cfg.showCountdown,
              onChange: function (e) { update({ showCountdown: e.target.checked }) },
            }),
            React.createElement('span', null, t('optCountdown'))
          ),
          React.createElement(
            'label',
            { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' } },
            React.createElement('input', {
              type: 'checkbox',
              checked: cfg.showDualTime,
              onChange: function (e) { update({ showDualTime: e.target.checked }) },
            }),
            React.createElement('span', null, t('optDualTime'))
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
            React.createElement(
              'label',
              { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' } },
              React.createElement('input', {
                type: 'checkbox',
                checked: cfg.notifyOnSwitch,
                onChange: function (e) { update({ notifyOnSwitch: e.target.checked }) },
              }),
              React.createElement('span', null, t('optNotify'))
            ),
            React.createElement(
              'button',
              {
                className: 'dspi-btn',
                style: { padding: '3px 8px', fontSize: '11px' },
                onClick: handleTestNotification
              },
              t('notifyTestBtn')
            ),
            notifStatus ? React.createElement('span', { style: { fontSize: '11.5px', color: 'var(--dspi-text-secondary)' } }, notifStatus) : null
          )
        ),

        // Action buttons
        React.createElement(
          'div',
          { style: { display: 'flex', gap: '10px', marginTop: '6px' } },
          React.createElement(
            'button',
            {
              className: 'dspi-btn',
              onClick: openDetailsModal,
            },
            t('btnOpenVisualizer')
          ),
          React.createElement(
            'button',
            {
              className: 'dspi-btn',
              onClick: function () {
                setCfg(DEFAULT_SETTINGS)
                saveSettings(DEFAULT_SETTINGS)
              },
            },
            t('btnReset')
          )
        )
      )
    }

    // =========================================================================
    // 11. Plugin Registration & Initialization
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

      // Schedule-switch monitoring lives at plugin scope, not in the modal
      // ticker: otherwise the "desktop notification on switch" feature would
      // silently never fire for a switch that happens while the details modal
      // is closed. Runs once per second, only checks while any consumer has
      // notifyOnSwitch enabled.
      var notifyMonitorTimer = setInterval(function () {
        try {
          var s = loadSettings()
          checkAndSendNotification(calculateStatus(s), s)
        } catch (_) {}
      }, 1000)
      ctx.effect(function () {
        return function () {
          clearInterval(notifyMonitorTimer)
          // Drop the fade/removal timers and overlay on plugin unload (HMR), so
          // a reload never leaves a stale overlay or a runaway timer.
          disposeModal()
        }
      }, 'dsh-peak-indicator: monitor + modal lifecycle')

      ctx.on('locale/change', function () {
        if (modalContainer) renderModal()
      })

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

      ctx.slots.inject('conversation.session.header.actions', function () {
        return ctx.slots.register(
          {
            name: 'conversation.session.header.actions',
            id: 'dsh-peak-indicator-floating',
            order: 36,
          },
          FloatingPillComponent
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
      // Test-only surface: pure helpers + the time engine, mirroring the
      // `__test` convention used by dsh-prompt-suggest's host module.
      __test: {
        DEFAULT_SETTINGS: DEFAULT_SETTINGS,
        I18N: I18N,
        normalizeSettings: normalizeSettings,
        calculateStatus: calculateStatus,
        getBeijingTime: getBeijingTime,
        getTzOffsetString: getTzOffsetString,
        isChinaHoliday: isChinaHoliday,
        isChinaAdjustedWorkday: isChinaAdjustedWorkday,
        getChinaHolidayName: getChinaHolidayName,
        padZero: padZero,
        escapeHtmlAttr: escapeHtmlAttr,
        t: t,
        getLocale: getLocale,
      },
    }

    return module.exports
  },
})

import test from 'node:test'
import assert from 'node:assert/strict'

// The plugin is a browser bundle: everything interesting lives inside the
// client factory closure. Load it the same way the DSH client loader does —
// with a fake window.__ModuleLoader__ that captures the entry — and pull the
// pure helpers out of the factory's returned module.exports.
let entry = null
globalThis.window = { __ModuleLoader__: { load(value) { entry = value } } }
await import('../lib/client.js?test=1')
delete globalThis.window

const fakeReact = { useSyncExternalStore() {} }
const plugin = entry.factory(() => fakeReact)
const { inject, apply, __test } = plugin

const {
  DEFAULT_SETTINGS,
  normalizeSettings,
  calculateStatus,
  getBeijingTime,
  padZero,
  escapeHtmlAttr,
  getTzOffsetString,
  t,
} = __test

/** Beijing wall-clock (UTC+8) -> epoch ms. */
function bjMs(year, month, day, hour, minute = 0, second = 0) {
  return Date.UTC(year, month - 1, day, hour - 8, minute, second)
}

test('client bundle registers a loadable DSH client module', () => {
  assert.equal(entry.id, 'dsh-peak-indicator')
  assert.deepEqual(plugin.inject, ['slots', 'locale'])
  assert.equal(typeof plugin.apply, 'function')
})

test('fixed fixtures fall on the intended weekdays (2026-08)', () => {
  // Pure UTC calendar dates — bjMs() rolls Beijing midnight back to the prior
  // UTC day, which would shift the weekday by one.
  assert.equal(new Date(Date.UTC(2026, 7, 19)).getUTCDay(), 3, '2026-08-19 should be a Wednesday')
  assert.equal(new Date(Date.UTC(2026, 7, 21)).getUTCDay(), 5, '2026-08-21 should be a Friday')
  assert.equal(new Date(Date.UTC(2026, 7, 22)).getUTCDay(), 6, '2026-08-22 should be a Saturday')
  assert.equal(new Date(Date.UTC(2026, 7, 23)).getUTCDay(), 0, '2026-08-23 should be a Sunday')
})

test('getBeijingTime converts UTC+8 wall clock components via Intl', () => {
  const parts = getBeijingTime(new Date(bjMs(2026, 8, 19, 10, 30, 5)))
  assert.match(JSON.stringify([parts.year, parts.month, parts.day]), /2026/)
  assert.equal(parts.hour, 10)
  assert.equal(parts.minute, 30)
  assert.equal(parts.second, 5)
})

test('v4_peak weekday morning window is peak with countdown to noon', () => {
  const status = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 19, 10, 30, 0)))
  assert.equal(status.isPeak, true)
  assert.equal(status.isOffPeak, false)
  assert.equal(status.remainingSec, 5400) // 10:30 -> 12:00 CST
  assert.equal(status.countdownStr, '01:30:00')
})

test('v4_peak afternoon window is peak with countdown to 18:00', () => {
  const status = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 19, 15, 0, 0)))
  assert.equal(status.isPeak, true)
  assert.equal(status.remainingSec, 3 * 3600)
  assert.equal(status.countdownStr, '03:00:00')
})

test('weekday midday gap and early morning count down to the next peak start', () => {
  const midday = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 19, 12, 30, 0)))
  assert.equal(midday.isPeak, false)
  assert.equal(midday.remainingSec, 90 * 60) // next window starts at 14:00

  const early = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 19, 8, 0, 0)))
  assert.equal(early.isPeak, false)
  assert.equal(early.remainingSec, 3600) // 09:00 same day
})

test('Friday evening lands on Monday 09:00 across the weekend', () => {
  const status = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 21, 18, 30, 0)))
  assert.equal(status.isPeak, false)
  // Fri 18:30 -> Mon 09:00 = 24h + 24h + 14.5h = 62.5 hours.
  assert.equal(status.remainingSec, 62.5 * 3600)
})

test('weekends are fully off-peak with the switch on Monday 09:00', () => {
  const sat = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 22, 15, 0, 0)))
  assert.equal(sat.isPeak, false)
  assert.equal(sat.remainingSec, 42 * 3600) // Sat 15:00 -> Mon 09:00

  const sun = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 23, 23, 0, 0)))
  assert.equal(sun.isPeak, false)
  assert.equal(sun.remainingSec, 10 * 3600)
})

test('window boundaries are start-inclusive and end-exclusive', () => {
  const cases = [
    [9, 0, 0, true],
    [11, 59, 59, true],
    [12, 0, 0, false],
    [13, 59, 59, false],
    [14, 0, 0, true],
    [17, 59, 59, true],
    [18, 0, 0, false],
  ]
  for (const [h, m, s, expected] of cases) {
    const status = calculateStatus(DEFAULT_SETTINGS, new Date(bjMs(2026, 8, 19, h, m, s)))
    assert.equal(status.isPeak, expected, `${padZero(h)}:${padZero(m)}:${padZero(s)} should be ${expected ? 'peak' : 'off-peak'}`)
  }
})

test('custom rule supports a normal daytime window in both directions', () => {
  const settings = { ...DEFAULT_SETTINGS, ruleType: 'custom', customStartHour: 9, customStartMin: 0, customEndHour: 18, customEndMin: 0 }
  const inside = calculateStatus(settings, new Date(bjMs(2026, 8, 19, 10, 0, 0)))
  assert.equal(inside.isPeak, true)
  assert.equal(inside.ruleType, 'custom')
  assert.equal(inside.remainingSec, 8 * 3600) // ends 18:00

  const evening = calculateStatus(settings, new Date(bjMs(2026, 8, 19, 20, 0, 0)))
  assert.equal(evening.isPeak, false)
  assert.equal(evening.remainingSec, 13 * 3600) // next peak tomorrow 09:00
})

test('custom rule handles overnight windows across midnight', () => {
  const settings = { ...DEFAULT_SETTINGS, ruleType: 'custom', customStartHour: 22, customStartMin: 0, customEndHour: 6, customEndMin: 0 }
  const lateNight = calculateStatus(settings, new Date(bjMs(2026, 8, 19, 23, 0, 0)))
  assert.equal(lateNight.isPeak, true)
  assert.equal(lateNight.remainingSec, 7 * 3600) // evening segment ends tomorrow 06:00

  const smallHours = calculateStatus(settings, new Date(bjMs(2026, 8, 19, 2, 0, 0)))
  assert.equal(smallHours.isPeak, true)
  assert.equal(smallHours.remainingSec, 4 * 3600) // morning segment ends today 06:00

  const midday = calculateStatus(settings, new Date(bjMs(2026, 8, 19, 12, 0, 0)))
  assert.equal(midday.isPeak, false)
  assert.equal(midday.remainingSec, 10 * 3600) // tonight 22:00
})

test('normalizeSettings clamps stale or hand-edited persisted values', () => {
  // Defaults survive garbage input shapes.
  assert.deepEqual(normalizeSettings(null), DEFAULT_SETTINGS)
  assert.deepEqual(normalizeSettings('nonsense'), DEFAULT_SETTINGS)

  // Only strict booleans are honored.
  const bools = normalizeSettings({ showInHeader: false, showCountdown: 'yes', showDualTime: 0, notifyOnSwitch: true })
  assert.equal(bools.showInHeader, false)
  assert.equal(bools.notifyOnSwitch, true)
  assert.equal(bools.showCountdown, DEFAULT_SETTINGS.showCountdown)
  assert.equal(bools.showDualTime, DEFAULT_SETTINGS.showDualTime)

  // Enums are allow-listed.
  assert.equal(normalizeSettings({ displayStyle: 'full' }).displayStyle, 'full')
  assert.equal(normalizeSettings({ displayStyle: 'giant' }).displayStyle, 'compact')
  assert.equal(normalizeSettings({ floatingMode: 'center' }).floatingMode, 'center')
  assert.equal(normalizeSettings({ floatingMode: 'bottom' }).floatingMode, 'none')
  assert.equal(normalizeSettings({ ruleType: 'custom' }).ruleType, 'custom')
  assert.equal(normalizeSettings({ ruleType: 'lunar' }).ruleType, 'v4_peak')

  // Hours/minutes must be finite ints in range; numeric strings coerce.
  const times = normalizeSettings({
    customStartHour: 7.9, customStartMin: '30',
    customEndHour: 24, customEndMin: -1,
  })
  assert.deepEqual(
    [times.customStartHour, times.customStartMin, times.customEndHour, times.customEndMin],
    [7, 30, DEFAULT_SETTINGS.customEndHour, DEFAULT_SETTINGS.customEndMin],
  )
  assert.equal(normalizeSettings({ customStartHour: Number.NaN }).customStartHour, DEFAULT_SETTINGS.customStartHour)
})

test('i18n defaults to Chinese and interpolates params without leaking braces', () => {
  assert.equal(t('pluginName'), 'DS Peak Indicator') // zh value happens to match
  assert.equal(t('peakIconOnly_v4'), '高峰')

  const detail = t('nextSwitchDetail', { time: '09:00', target: '高峰价' })
  assert.match(detail, /09:00/)
  assert.match(detail, /高峰价/)
  assert.doesNotMatch(detail, /\{time\}|\{target\}/)

  // Unknown key falls through zh dict then to the raw key.
  assert.equal(t('definitely_not_a_key'), 'definitely_not_a_key')
})

test('small helpers behave: padZero, escapeHtmlAttr, timezone offset format', () => {
  assert.equal(padZero(0), '00')
  assert.equal(padZero(9), '09')
  assert.equal(padZero(23), '23')
  assert.equal(padZero(24), '24')

  assert.equal(escapeHtmlAttr('<b class="x">&'), '&lt;b class=&quot;x&quot;&gt;&amp;')

  // Format is UTC±H or UTC±H:MM and matches this machine's real offset.
  const expected = (() => {
    const offsetMin = -new Date().getTimezoneOffset()
    const sign = offsetMin >= 0 ? '+' : '-'
    const absMin = Math.abs(offsetMin)
    const h = Math.floor(absMin / 60)
    const m = absMin % 60
    return 'UTC' + sign + h + (m > 0 ? ':' + (m < 10 ? '0' + m : m) : '')
  })()
  assert.equal(getTzOffsetString(), expected)
})

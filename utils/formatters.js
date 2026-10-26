/**
 * Localized formatting utilities for numbers, times, and countdowns.
 */

export function toPersianDigits(value) {
  if (value == null) return "";
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

export function formatNumber(value, isRTL = false) {
  if (value == null) return "";
  return isRTL ? toPersianDigits(value) : String(value);
}

export function formatTime(totalSeconds, isRTL = false) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  const str = `${m}:${s}`;
  return isRTL ? toPersianDigits(str) : str;
}

export function formatCountdown(totalSeconds, isRTL = false) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  let res;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    res = `${h}:${mm.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
  } else {
    res = `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
  }
  return isRTL ? toPersianDigits(res) : res;
}

export function formatClockTime(date, isRTL = false, t = null) {
  if (!date) return "";
  const d = new Date(date);
  const h = d.getHours();
  const m = d.getMinutes();
  const hr12 = h % 12 || 12;
  const minStr = String(m).padStart(2, "0");
  const period =
    h >= 12
      ? (t ? t("dinnerMenuDetail.pm", { defaultValue: "PM" }) : (isRTL ? "ب.ظ" : "PM"))
      : (t ? t("dinnerMenuDetail.am", { defaultValue: "AM" }) : (isRTL ? "ق.ظ" : "AM"));

  if (isRTL) {
    const hrFa = toPersianDigits(hr12);
    const minFa = toPersianDigits(minStr);
    return `${hrFa}:${minFa} ${period}`;
  }
  return `${hr12}:${minStr} ${period}`;
}

export function formatHour(hour, isRTL = false, t = null) {
  const hr12 = hour > 12 ? hour - 12 : hour;
  const period =
    hour >= 12
      ? (t ? t("dinnerMenuDetail.pm", { defaultValue: "PM" }) : (isRTL ? "ب.ظ" : "PM"))
      : (t ? t("dinnerMenuDetail.am", { defaultValue: "AM" }) : (isRTL ? "ق.ظ" : "AM"));

  if (isRTL) {
    const hrFa = toPersianDigits(hr12);
    return `${hrFa}:۰۰ ${period}`;
  }
  return `${hr12}:00 ${period}`;
}

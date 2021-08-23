const Aequirys = window.require('aequirys');

// Memoization caches
const cDisplay = {};
const cStamp = {};

/**
 * Add days to date
 * @param {Date} date
 * @param {number=} increment
 * @return {Date}
 */
function addDays (date, increment = 1) {
  const d = new Date(date);
  d.setDate(d.getDate() + increment);
  return d;
}

/**
 * Calculate time ago
 * @return {string} Time ago
 */
function ago (d) {
  const m = ~~((new Date() - +d) / 6E4);
  if (m === 0) return 'less than a minute ago';
  if (m === 1) return 'a minute ago';
  if (m < 59) return `${m} minutes ago`;
  if (m < 120) return 'an hour ago';
  if (m < 1440) return `${~~(m / 60)} hours ago`;
  if (m < 2880) return 'yesterday';
  if (m < 86400) return `${~~(m / 1440)} days ago`;
  if (m < 1051199) return `${~~(m / 43200)} months ago`;
  return `over ${~~(m / 525960)} years ago`;
}

/**
 * Format date
 * @param {number=} format - Calendar format
 * @return {string} Formatted date
 */
function formatDate (date, format = LOG.config.ca) {
  switch (format) {
    case 1: return Aequirys.display(Aequirys.convert(date));
    default: {
      const y = pad(date.getFullYear());
      const d = pad(date.getDate());
      const m = Glossary.months[date.getMonth()][0].toUpperCase();
      return `${d}${m}${y}`;
    }
  }
}

/**
 * Display date
 * @param {Date} date
 * @return {string} Formatted date
 */
function display (date) {
  const x = new Date(date).setHours(0, 0, 0, 0);
  return x in cDisplay ? cDisplay[x] : (cDisplay[x] = formatDate(date));
}

/**
 * Display 12h time
 * @param {Date} date
 * @return {string} 12h time
 */
function to12H (date) {
  let h = date.getHours();
  const X = h >= 12 ? 'PM' : 'AM';
  const H = pad((h %= 12 ? h : 12));
  const M = pad(date.getMinutes());
  return `${H}:${M} ${X}`;
}

/**
 * Display 24h time
 * @param {Date} date
 * @return {string} 24h time
 */
function to24H (date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Convert to decimal time
 * @param {Date} d
 * @return {string} Decimal beat
 */
function toDec (date) {
  const d = new Date(date);
  const b = new Date(d).setHours(0, 0, 0);
  const v = (d - b) / 864E5;
  const t = v.toFixed(6).substr(2, 6);
  return t.substr(0, 3);
}

/**
 * Format time
 * @param {number=} tm - Time format
 * @return {string} Formatted time
 */
function formatTime (d, tm = LOG.config.tm) {
  switch (tm) {
    case 0: return to12H(d);
    case 1: return to24H(d);
    default: return toDec(d);
  }
}

/**
 * Display timestamp
 * @return {string} Timestamp
 */
function stamp (d) {
  const x = `${d.getHours()}${d.getMinutes()}`;
  return x in cStamp ? cStamp[x] : (cStamp[x] = formatTime(d));
}

/**
 * Convert to date ID
 * @return {string} YYYYMMDD
 */
function toDate (date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth());
  const d = pad(date.getDate());
  return `${y}${m}${d}`;
}

/**
 * Calculate duration
 * @param {Date} s - Start
 * @param {Date} e - End
 * @return {number} Duration (1 = 1h)
 */
function duration (s, e) {
  return e === undefined ? 0 : (+e - +s) / 36E5;
}

/**
 * List dates
 * @param {Date} start
 * @param {Date=} end
 * @return {Array} List
 */
function listDates (start, end = new Date()) {
  const dates = [];
  let now = new Date(start);
  now.setHours(0, 0, 0, 0);

  for (; now <= end;) {
    dates[dates.length] = now;
    now = addDays(now, 1);
  }

  return dates;
}

/**
 * Calculate offset
 * @param {string} h
 * @param {number=} d - Duration in seconds
 * @return {string} Offset in hexadecimal
 */
function offset (h, d = 0) {
  return (convertBase36(h) + d).toString(36);
}

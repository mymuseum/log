/**
 * Calculate sum
 * @param {Array=} values
 * @return {number}
 */
function sum (values = []) {
  const l = values.length;
  if (l === 0) return 0;
  let x = 0;
  for (let i = 0; i < l; i += 1) {
    x += values[i];
  }
  return x;
}

/**
 * Calculate average
 * @param {Array=} values
 * @return {number}
 */
function avg (values = []) {
  const l = values.length;
  return l === 0 ? 0 : sum(values) / l;
}

/**
 * Calculate max
 * @param {Array=} values
 * @return {number}
 */
function max (values = []) {
  let l = values.length;
  if (l === 0) return 0;
  let m = 0;
  while (l--) {
    if (values[l] > m) m = values[l];
  }
  return m;
}

/**
 * Calculate min
 * @param {Array=} values
 * @return {number}
 */
function min (values = []) {
  let l = values.length;
  if (l === 0) return 0;
  let m = Number.MAX_VALUE;
  while (l--) {
    if (values[l] < m) m = values[l];
  }
  return m;
}

/**
 * Calculate ceiling
 * @param {number=} n
 * @return {number} Ceiling
 */
function ceil (n) {
  return n % 1 === 0 ? n : ~~n + 1;
}

/**
 * Check if value is a number
 * @param n - number?
 * @return {boolean} Is Number?
 */
function isNumber (n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

/**
 * Add leading zeroes
 * @param {number} n
 * @return {string}
 */
function pad (n) {
  return `0${n}`.substr(-2);
}

/**
 * Parse logs
 * @param {Array=} logs
 * @return {LogSet}
 */
function parse (logs = LOG.entries) {
  const l = logs.length;
  if (l === 0) return new LogSet(logs);
  const diffDay = (s, e) => toDate(s) !== toDate(e);
  const parsed = [];

  function split (a, b, {id, x, c, t, d}) {
    const dx = new Date(a);
    const dy = new Date(b);

    dx.setHours(23, 59, 59);
    dy.setHours(0, 0, 0);

    parsed[parsed.length] = new Entry({
      id, s: a, e: dx, ci: x, c, t, d
    });

    parsed[parsed.length] = new Entry({
      id, s: dy, e: b, ci: x, c, t, d
    });
  }

  for (let id = 0; id < l; id += 1) {
    const {s, e, x, c, t} = logs[id];
    const d = logs[id].d || '';
    const a = new Date(s);
    const b = e === undefined ? undefined : new Date(e);

    if (e !== undefined && diffDay(a, b)) {
      split(a, b, {id, x, c, t, d});
    } else {
      parsed[parsed.length] = new Entry({id, s: a, e: b, ci: x, c, t, d});
    }
  }

  return new LogSet(parsed);
}

/**
 * Calculate range
 * @param {Array=} values
 * @return {number} Range
 */
function range (values = []) {
  if (values.length === 0) return 0;
  const sort = values.sort();
  return sort[sort.length - 1] - sort[0];
}

/**
 * Calculate standard deviation
 * @param {Array=} values
 * @return {number}
 */
function sd (values = []) {
  const l = values.length;
  if (l === 0) return 0;
  const x = avg(values);
  let y = 0;
  for (let i = 0; i < l; i += 1) {
    y += (values[i] - x) ** 2;
  }
  return (y / (l - 1)) ** 0.5;
}

/**
 * Display as stat
 * @param {number=} format - Stat format
 * @return {string} Stat
 */
function toStat (n, format = LOG.config.st) {
  switch (format) {
    case 0: return n.toFixed(2);
    case 1: {
      const m = n % 1;
      const tail = +(m * 60).toFixed(0);
      return `${n - m}:${pad(tail)}`;
    }
    default: return n;
  }
}

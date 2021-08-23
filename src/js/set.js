/**
 * Generate array
 * Replaces `new Array(size).fill(content)`
 * @param {number} size
 * @param {*} content
 * @return {array}
 */
function genArray(size, content) {
  const arr = [];
  for (let i = 0; i < size; i += 1) {
    arr[i] = content;
  }
  return arr;
}

module.exports = class LogSet {
  /**
   * Construct set
   * @param {Array=} ent
   */
  constructor (ent = []) { this.logs = ent; }

  get count () { return this.logs.length; }

  get last () { return this.logs.slice(-1)[0]; }

  get lh () { return this.logHours(); }

  /**
   * Generate bar chart data
   * @param {Object=} config
   * @param {string=} config.cm - Colour mode
   * @param {string=} config.fg - Foreground colour
   * @return {Array} Data
   */
  bar ({cm, fg} = LOG.config) {
    if (this.count === 0) return [];
    const sort = this.sortEntries();
    let i = sort.length - 1;
    const data = [];

    if (cm === 'none') {
      for (; i >= 0; i--) {
        data[i] = [{
          height: `${new LogSet(sort[i]).coverage()}%`,
          backgroundColor: fg
        }];
      }
      return data;
    }

    for (; i >= 0; i--) {
      data[i] = [];
      const day = sort[i];
      const ol = day.length;
      for (let o = 0, lh = 0; o < ol; o += 1) {
        const {wh} = day[o];
        data[i][o] = {
          backgroundColor: day[o][cm] || fg,
          bottom: `${lh}%`,
          height: `${wh}%`
        };
        lh += wh;
      }
    }

    return data;
  }

  /**
   * Get logs by date
   * @param {Date=} date
   * @return {Array} Entries
   */
  byDate (date = new Date()) {
    const l = this.count;
    if (
      l === 0
      || typeof date !== 'object'
      || +date > +new Date()
    ) return [];

    const logs = [];

    function match (a, d = date) {
      return a.getFullYear() === d.getFullYear()
        && a.getMonth() === d.getMonth()
        && a.getDate() === d.getDate();
    }

    for (let i = 0; i < l; i += 1) {
      const {start, end} = this.logs[i];
      if (end !== undefined && match(start)) {
        logs[logs.length] = this.logs[i];
      }
    }

    return logs;
  }

  /**
   * Get logs by day
   * @param {number} d - Day of the week
   * @return {Array} Entries
   */
  byDay (d) {
    if (
      this.count === 0
      || typeof d !== 'number'
      || d < 0 || d > 6
    ) return [];
    function isValid ({start, end}) {
      return end !== undefined && start.getDay() === d;
    }
    return this.logs.filter(isValid);
  }

  /**
   * Get logs by month
   * @param {number} m - Month
   * @return {Array} Entries
   */
  byMonth (m) {
    if (
      this.count === 0
      || typeof m !== 'number'
      || m < 0 || m > 11
    ) return [];
    function isValid ({start, end}) {
      return end !== undefined && start.getMonth() === m;
    }
    return this.logs.filter(isValid);
  }

  /**
   * Get logs by period
   * @param {Date}  start
   * @param {Date=} end
   * @return {Array} Entries
   */
  byPeriod (start, end = new Date()) {
    if (
      this.count === 0
      || typeof start !== 'object'
      || typeof end !== 'object'
      || start > end
    ) return [];

    let logs = [];
    for (let now = start; now <= end;) {
      logs = logs.concat(this.byDate(now));
      now = addDays(now, 1);
    }

    return logs;
  }

  /**
   * Get logs by project
   * @param {string} term - Project
   * @param {Array=} list - Projects
   * @return {Array} Entries
   */
  byProject (term, list = LOG.cache.pro) {
    if (
      this.count === 0
      || typeof term !== 'string'
      || !Array.isArray(list)
      || list.indexOf(term) < 0
    ) return [];
    function isValid ({end, project}) {
      return end !== undefined && project === term;
    }
    return this.logs.filter(isValid);
  }

  /**
   * Get logs by sector
   * @param {string} term - Sector
   * @param {Array=} list - Sectors
   * @return {Array} Entries
   */
  bySector (term, list = LOG.cache.sec) {
    if (
      this.count === 0
      || typeof term !== 'string'
      || !Array.isArray(list)
      || list.indexOf(term) < 0
    ) return [];
    function isValid ({end, sector}) {
      return end !== undefined && sector === term;
    }
    return this.logs.filter(isValid);
  }

  /**
   * Calculate coverage
   * @return {number} Coverage
   */
  coverage () {
    const l = this.count;
    if (l === 0) return 0;

    const {end, start} = this.logs[0];
    const endd = l === 1 ? end : this.last.start;
    const dif = (endd - start) / 864E5;
    const n = (dif << 0) + 1;

    return (25 * this.lh) / (6 * n);
  }

  /**
   * Calculate average log hours per day
   * @return {number} Average log hours
   */
  dailyAvg () {
    const sort = this.sortEntries();
    const l = sort.length;
    return l === 0 ? 0
      : sort.reduce((s, c) => s + new LogSet(c).lh, 0) / l;
  }

  /**
   * Calculate efficiency (WIP)
   * @return {number} Efficiency
   */
  efficiency () {
    const l = this.count;
    if (l === 0) return 0;
    let score = 0;
    let count = 0;
    for (let i = 0; i < l; i += 1) {
      const x = this.logs[i].completionIndex;
      score += x || 0;
      count += 1;
    }

    return score / this.count * 100;
  }

  /**
   * Count entries per day
   * @return {Array} Entries per day
   */
  entryCounts () {
    if (this.count === 0) return [];
    const sort = this.sortEntries();
    const l = sort.length;
    const counts = [];
    for (let i = 0; i < l; i += 1) {
      counts[counts.length] = sort[i].length;
    }
    return counts;
  }

  /**
   * List durations
   * @return {Array} List
   */
  listDurations () {
    const list = [];
    const l = this.count;
    if (l === 0) return list;
    const n = +(this.last.end === undefined) + 1;
    for (let i = l - n; i >= 0; i--) {
      list[list.length] = this.logs[i].dur;
    }
    return list;
  }

  /**
   * List projects
   * @return {Array} List
   */
  listProjects () {
    const l = this.count;
    if (l === 0) return [];
    const list = new Set();
    const n = +(this.last.end === undefined) + 1;
    for (let i = l - n; i >= 0; i--) {
      list.add(this.logs[i].project);
    }
    return [...list];
  }

  /**
   * List sectors
   * @return {Array} List
   */
  listSectors () {
    const l = this.count;
    if (l === 0) return [];
    const list = new Set();
    const n = +(this.last.end === undefined) + 1;
    for (let i = l - n; i >= 0; i--) {
      list.add(this.logs[i].sector);
    }
    return [...list];
  }

  /**
   * Calculate logged hours
   * @return {number} Logged hours
   */
  logHours () {
    return this.count === 0 ? 0 : sum(this.listDurations());
  }

  /**
   * Calculate peak beats
   * @return {Array} Peaks
   */
  peakBeats () {
    const l = this.count;
    if (l === 0) return [];

    const n = +(this.last.end === undefined) + 1;
    const beats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = l - n; i >= 0; i--) {
      const {start, dur} = this.logs[i];
      beats[~~(start.toDec() / 100)] += dur;
    }

    return beats;
  }

  /**
   * Get peak beat
   * @return {string} Peak beat
   */
  peakBeat () {
    const peak = this.peakBeats();
    return peak.length === 0
      ? '-' : peak.indexOf(max(peak));
  }


  /**
   * Get peak day
   * @return {string} Peak day
   */
  peakDay () {
    const peak = this.peakDays();
    return peak.length === 0
      ? '-' : Glossary.days[peak.indexOf(max(peak))];
  }

  /**
   * Calculate peak days
   * @return {Array} Peaks
   */
  peakDays () {
    const l = this.count;
    if (l === 0) return [];

    const n = +(this.last.end === undefined) + 1;
    const days = [0, 0, 0, 0, 0, 0, 0];

    for (let i = l - n; i >= 0; i--) {
      const {start, dur} = this.logs[i];
      days[start.getDay()] += dur;
    }

    return days;
  }

  /**
   * Get peak hour
   * @return {string} Peak hour
   */
  peakHour () {
    const peak = this.peakHours();
    return peak.length === 0
      ? '-' : `${peak.indexOf(max(peak))}:00`;
  }

  /**
   * Calculate peak hours
   * @return {Array} Peaks
   */
  peakHours () {
    const l = this.count;
    if (l === 0) return [];
    const hours = genArray(24, 0);

    for (let i = l - 1; i >= 0; i--) {
      const {start, end, dur} = this.logs[i];
      if (end === undefined) continue;
      let index = start.getHours();

      if (dur < 1) {
        hours[index] += dur;
        continue;
      }

      const rem = dur % 1;
      let block = dur - rem;
      hours[index] += 1;
      index += 1;
      block--;

      while (block > 1) {
        hours[index] += 1;
        index += 1;
        block--;
      }

      hours[index] += rem;
    }

    return hours;
  }

  /**
   * Get peak month
   * @return {string} Peak month
   */
  peakMonth () {
    const p = this.peakMonths();
    return p.length === 0 ? '-' : Glossary.months[p.indexOf(max(p))];
  }

  /**
   * Calculate peak months
   * @return {Array} Peaks
   */
  peakMonths () {
    const l = this.count;
    if (l === 0) return [];

    const n = +(this.last.end === undefined) + 1;
    const months = genArray(12, 0);

    for (let i = l - n; i >= 0; i--) {
      const {start, dur} = this.logs[i];
      months[start.getMonth()] += dur;
    }

    return months;
  }

  /**
   * Calculate project counts
   * @return {Array} Counts
   */
  projectCounts () {
    if (this.count === 0) return [];
    const sort = this.sortEntries();
    const counts = [];

    for (let i = 0, l = sort.length; i < l; i += 1) {
      const set = new Set();
      for (let o = 0, ol = sort[i].length; o < ol; o += 1) {
        set.add(sort[i][o].project);
      }
      counts[counts.length] = [...set].length;
    }

    return counts;
  }

  /**
   * Get recent entries
   * @param {number} [n] - Number of days
   * @return {Array} Entries
   */
  recent (n = 1) {
    return n < 1 ? [] : this.byPeriod(addDays(new Date(), -n));
  }

  /**
   * Calculate sector counts
   * @return {Array} Counts
   */
  sectorCounts () {
    if (this.count === 0) return [];
    const sort = this.sortEntries();
    const counts = [];
    for (let i = 0, l = sort.length; i < l; i += 1) {
      const set = new Set();
      for (let o = 0; o < sort[i].length; o += 1) {
        set.add(sort[i][o].sector);
      }
      counts[counts.length] = [...set].length;
    }
    return counts;
  }

  /**
   * Sort entries by day
   * @return {Array} Sorted entries
   */
  sortByDay () {
    const l = this.count;
    if (l === 0) return [];
    const s = genArray(7, []);
    for (let i = l - 1; i >= 0; i--) {
      const d = this.logs[i].start.getDay();
      s[d][s[d].length] = this.logs[i];
    }
    return s;
  }

  /**
   * Sort entries
   * @param {Date=} end
   * @return {Array} Sorted entries
   */
  sortEntries (end = new Date()) {
    const el = this.count;
    if (el === 0) return [];

    const list = listDates(this.logs[0].start, end);
    const dates = {};

    for (let i = 0, l = list.length; i < l; i += 1) {
      dates[toDate(list[i])] = [];
    }

    for (let i = 0; i < el; i += 1) {
      const x = toDate(this.logs[i].start);
      if (x in dates) dates[x][dates[x].length] = this.logs[i];
    }

    return Object.keys(dates).map(i => dates[i]);
  }

  /**
   * TODO
   * Sort values
   * @param {number=} mode - Sector (0) | project (1)
   * @return {Array} Sorted values
   */
  sortValues (mode = 0) {
    if (
      this.count === 0
      || typeof mode !== 'number'
      || mode < 0 || mode > 1
    ) return [];

    const lhe = this.lh;
    const sort = [];
    const tmp = {};
    let list = [];
    let func = '';

    if (mode === 0) {
      list = this.listSectors();
      func = 'bySector';
    } else {
      list = this.listProjects();
      func = 'byProject';
    }

    for (let i = list.length - 1; i >= 0; i--) {
      const {lh} = new LogSet(this[func](list[i]));
      tmp[list[i]] = {p: lh / lhe * 100, h: lh};
    }

    const keys = Object.keys(tmp).sort((a, b) => tmp[a].h - tmp[b].h);
    for (let i = keys.length - 1; i >= 0; i--) {
      const {h, p} = tmp[keys[i]];
      sort[sort.length] = {h, p, n: keys[i]};
    }

    return sort;
  }

  /**
   * Calc streak
   * @return {number} Streak
   */
  streak () {
    if (this.count === 0) return 0;
    const sort = this.sortEntries();
    let streak = 0;
    for (let i = 0, l = sort.length; i < l; i += 1) {
      streak = sort[i].length === 0 ? 0 : streak + 1;
    }
    return streak;
  }
};

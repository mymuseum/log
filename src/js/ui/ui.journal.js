module.exports = {

  /**
   * Build Journal
   * @return {Object}
   */
  build () {
    const f = document.createDocumentFragment();
    // const a = build('div', {className: 'h1 mb3 f6 lhc', innerHTML: '<- 2019 ->'});
    // f.append(a);
    f.append(this.cal());
    f.append(this.modal());
    return f;
  },

  /**
   * Build Journal Calendar
   * @param {number} yy
   * @return {Object}
   */
  cal (yy = new Date().getFullYear()) {
    const c = build('table', {className: 'cal nodrag h9 wf f6 lhc c-pt bn'});
    const sy = new Date(yy, 0, 1);
    const ey = new Date(yy, 11, 31);
    const year = new LogSet(Session.byPeriod(sy, ey));
    const sort = year.sortEntries();

    function cellAttr (date) {
      return {
        title: date.toString(),
        onclick: () => UI.journal.displayEntry(date),
        innerHTML: display(date)
      };
    }

    for (let i = 0; i < 26; i += 1) {
      const row = document.createElement('tr');
      c.append(row);

      for (let o = 0; o < 14; o += 1) {
        const cell = document.createElement('td');
        const id = (14 * i) + o;
        const pos = sort[id];

        if (pos === undefined || pos.length < 1) {
          cell.innerHTML = '-----';
        } else {
          Object.assign(cell, cellAttr(pos[0].start));
        }

        row.append(cell);
      }
    }

    return c;
  },

  /**
   * Build Journal Modal
   * @param {string=} config.bg - Background colour
   * @param {string=} config.colour - Foreground colour
   * @return {Object}
   */
  modal ({bg, fg} = LOG.config) {
    const ä = (el, className) => build(el, {className});
    const m = build('dialog', {id: 'entryModal', className: 'p4 cn bn h6'});
    const h2 = build('h2', {id: 'journalDate', className: 'mb4 f6 lhc'});
    const t = ä('div', 'h2');
    const mt = ä('div', 'mb3 psr wf sh2 bl br');
    const sb = ä('div', 'r h6');
    const st = ä('ul', 'c3 hf oys pr4 lsn f6 lhc hvs');

    const {stats} = Glossary;
    const s = [
      {id: 'jSUM', n: stats.abbr.sum},
      {id: 'jMIN', n: stats.abbr.minDur},
      {id: 'jMAX', n: stats.abbr.maxDur},
      {id: 'jAVG', n: stats.abbr.avgDur},
      {id: 'jCOV', n: stats.cov},
    ];

    Object.assign(m.style, {backgroundColor: bg, color: fg});

    for (let i = 0, l = s.length; i < l; i += 1) {
      const stat = build('li', {className: 'mb3'});
      const {id, n} = s[i];

      stat.append(build('p', {id, innerHTML: '&ndash;', className: 'f4 fwb'}));
      stat.append(build('p', {innerHTML: n, className: 'o7'}));

      st.append(stat);
    }

    m.append(h2);
    m.append(t);
    t.append(mt);
    mt.append(UI.vis.meterLines());
    t.append(build('div', {id: 'jDyc', className: 'mb3 psr wf sh2'}));
    m.append(sb);
    sb.append(st);
    sb.append(build('ul', {id: 'jEnt', className: 'c9 pl4 hf oys lsn hvs'}));

    return m;
  },

  /**
   * Display journal entry
   * @param {Date=} d
   */
  displayEntry (d = new Date()) {
    const thisDay = new LogSet(Session.byDate(d));
    const l = thisDay.count;
    if (l === 0) return;

    const fr = document.createDocumentFragment();
    const tdur = thisDay.listDurations();

    jDyc.innerHTML = '';
    jEnt.innerHTML = '';

    journalDate.innerHTML = `${display(d)} (${Glossary.days[d.getDay()]})`;

    jDyc.append(UI.vis.dayChart(thisDay.logs));

    jSUM.innerHTML = toStat(sum(tdur));
    jMIN.innerHTML = toStat(min(tdur));
    jMAX.innerHTML = toStat(max(tdur));
    jAVG.innerHTML = toStat(avg(tdur));
    jCOV.innerHTML = `${thisDay.coverage().toFixed(2)}%`;

    function ä (e, className, innerHTML) {
      return build(e, {className, innerHTML});
    }

    for (let i = 0; i < l; i += 1) {
      const {
        id, start, end, sector, project, desc, dur
      } = thisDay.logs[i];
      const st = stamp(start);
      const et = stamp(end);

      const item = build('li', {className: 'f6 lhc pb3 mb3'});
      const eid = ä('span', 'mr3 o7', id + 1);
      const time = ä('span', 'mr3 o7', `${st} &ndash; ${et}`);
      const sec = ä('span', 'mr3 o7', sector);
      const pro = ä('span', 'o7', project);
      const span = ä('span', 'rf o7', toStat(dur));
      const dsc = ä('p', 'f4 lhc', desc);

      item.append(eid);
      item.append(time);
      item.append(sec);
      item.append(pro);
      item.append(span);
      item.append(dsc);
      fr.append(item);
    }

    jEnt.append(fr);
    document.getElementById('entryModal').showModal();
  },
};

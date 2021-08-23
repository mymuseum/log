module.exports = {

  /**
   * Build Details
   * @param {LogSet} overview
   * @return {Object}
   */
  build (overview) {
    const ä = (id, className) => build('div', {id, className});

    const fr = document.createDocumentFragment();
    const main = build('div', {className: 'oya'});
    const summary = ä('SUM', 'nodrag subsect oya hvs');
    const sectors = ä('SSC', 'dn subsect');
    const projects = ä('PSC', 'dn subsect');

    fr.append(this.menu());
    fr.append(main);
    main.append(summary);
    summary.append(this.summary.build(overview));
    main.append(sectors);
    main.append(projects);

    if (Session.count > 0) {
      const sv = Session.sortValues(0);
      const pv = Session.sortValues(1);

      if (sv.length > 0 && pv.length > 0) {
        sectors.append(this.detail.build(0, sv[0].n));
        projects.append(this.detail.build(1, pv[0].n));
      }
    }

    return fr;
  },

  /**
   * Build Details menu
   * @return {Object}
   */
  menu () {
    const m = document.createElement('div');

    function ä (i, h, c = 'db mb3 subtab on bg-cl o5 mr3') {
      m.append(build('button', {
        className: c,
        id: `b-${i}`,
        innerHTML: h,
        onclick: () => Nav.tab(i, 'subsect', 'subtab', true),
      }));
    }

    ä('SUM', Glossary.summary, 'db mb3 subtab on bg-cl of mr3');
    ä('SSC', Glossary.sec.plural);
    ä('PSC', Glossary.pro.plural);

    return m;
  },

  summary: {

    /**
     * Build Summary
     * @return {Object}
     */
    build () {
      const fragment = document.createDocumentFragment();
      fragment.append(this.stats());
      fragment.append(this.peaks());
      fragment.append(this.distri());
      return fragment;
    },

    /**
     * Build Summary stats
     * @return {Object}
     */
    stats () {
      const ä = (e, c, i = '') => build(e, {className: c, innerHTML: i});

      const durations = Session.listDurations();
      const secc = Session.sectorCounts();
      const proc = Session.projectCounts();
      const entc = Session.entryCounts();

      const container = document.createElement('div');
      const list = ä('ul', 'mb5 lsn f6 lhc r');
      const s = [
        {
          n: Glossary.stats.sum,
          v: toStat(sum(durations))
        }, {
          n: Glossary.stats.durs,
          v: `${toStat(min(durations))}&ndash;${toStat(max(durations))}`
        }, {
          n: Glossary.stats.avgDur,
          v: toStat(avg(durations))
        }, {
          n: Glossary.stats.sd,
          v: toStat(sd(durations))
        }, {
          n: Glossary.stats.daily,
          v: toStat(Session.dailyAvg())
        }, {
          n: Glossary.stats.cov,
          v: Session.coverage().toFixed(2)
        }, {
          n: 'Efficiency',
          v: Session.efficiency().toFixed(2)
        }, {
          n: Glossary.entries,
          v: LOG.entries.length
        }, {
          n: 'Daily Entry Range',
          v: `${min(entc)}&ndash;${max(entc)}`
        }, {
          n: 'Entry Average',
          v: ceil(avg(entc))
        }, {
          n: 'Total Sectors',
          v: LOG.cache.sec.length
        }, {
          n: 'Daily Sector Range',
          v: `${ceil(min(secc))}&ndash;${ceil(max(secc))}`
        }, {
          n: 'Daily Sector Average',
          v: ceil(avg(secc))
        }, {
          n: 'Total Projects',
          v: LOG.cache.pro.length
        }, {
          n: 'Daily Project Range',
          v: `${ceil(min(proc))}&ndash;${ceil(max(proc))}`
        }, {
          n: 'Daily Project Average',
          v: ceil(avg(proc))
        }
      ];

      for (let i = 0, l = s.length; i < l; i += 1) {
        const {n, v} = s[i];
        const item = ä('li', 'mb4 c3');
        item.append(ä('p', 'f4 fwb', v));
        item.append(ä('p', 'o7', n));
        list.append(item);
      }

      container.append(list);
      return container;
    },

    /**
     * Build Summary peaks
     * @return {Object}
     */
    peaks () {
      const ä = (e, c, i = '') => build(e, {className: c, innerHTML: i});

      const container = document.createElement('div');
      const title = ä('h3', 'mb3 f6 lhc fwn', Glossary.peaks);
      const a = ä('div', 'dib mb4 pr4 lf sh6 w5');
      const b = ä('div', 'dib mb4 pl4 lf sh6 w5');
      const h = ä('div', 'psr hf wf');
      const d = h.cloneNode();
      const stats = ä('ul', 'mb5 lsn f6 lhc r');
      const dayChart = UI.vis.peakChart(0, LOG.cache.pkh);
      const weekChart = UI.vis.peakChart(1, LOG.cache.pkd);
      const s = [
        {n: Glossary.ph, v: Session.peakHour()},
        {n: Glossary.pd, v: Session.peakDay()},
        {n: Glossary.pm, v: Session.peakMonth()}
      ];

      for (let i = 0; i < 3; i += 1) {
        const {v, n} = s[i];
        const item = ä('li', 'mb0 c3');
        item.append(ä('p', 'f4 fwb', v));
        item.append(ä('p', 'o7', n));
        stats.append(item);
      }

      container.append(title);
      container.append(a);
      a.append(h);
      h.append(dayChart);
      container.append(b);
      b.append(d);
      d.append(weekChart);
      container.append(stats);

      return container;
    },

    /**
     * Build Summary distribution
     * @return {Object}
     */
    distri () {
      const values = Session.sortValues(0, 1);
      const container = document.createElement('div');
      const bar = build('div', {className: 'mb3 wf sh2'});
      const legend = build('ul', {className: 'lsn r'});

      container.append(build('h3', {
        className: 'mb3 f6 lhc fwn',
        innerHTML: Glossary.sec.plural
      }));

      container.append(bar);
      bar.append(UI.vis.focusBar(0, values));
      container.append(legend);
      legend.append(UI.vis.legend(0, values));

      return container;
    }
  },

  detail: {

    /**
     * Build Detail page
     * @param {number}  mode - Sector (0) or project (1)
     * @param {string}  key - Sector or project name
     * @param {number=} view
     * @return {Object}
     */
    build (mode, key, view = LOG.config.vw) {
      const rec = new LogSet(Session.recent(view - 1));
      let sec = 'secsect';
      let ss = 'SST';
      let es = 'SEN';
      let ent = {};
      let his = {};

      if (mode === 0) {
        ent = new LogSet(rec.bySector(key));
        his = new LogSet(Session.bySector(key));
      } else {
        ent = new LogSet(rec.byProject(key));
        his = new LogSet(Session.byProject(key));
        sec = 'prosect';
        ss = 'PST';
        es = 'PEN';
      }

      const pd = his.peakDays();
      const ph = his.peakHours();
      const fr = document.createDocumentFragment();
      const cn = build('div', {className: 'nodrag oys hvs'});
      const s1 = build('div', {id: ss, className: sec});
      const s2 = build('div', {id: es, className: `dn ${sec}`});

      fr.append(cn);
      cn.append(this.head(key, ent));
      cn.append(this.tabs(mode));
      cn.append(s1);
      s1.append(this.ovw(ent));
      s1.append(this.stats(his));
      s1.append(this.peaks(ph, pd));
      s1.append(this.distri(mode, ent, his));
      cn.append(s2);
      s2.append(this.entries(mode, his));
      fr.append(this.list(mode));

      return fr;
    },

    /**
     * Build Detail head
     * @param {string}  key - Sector/project
     * @param {Object}  set
     * @param {number}  set.count
     * @param {Object}  set.last
     * @param {number=} view
     * @return {Object}
     */
    head (key, {count, last}, view = LOG.config.vw) {
      const F = document.createDocumentFragment();

      F.append(build('h2', {
        className: 'mb0 f4 lht',
        innerHTML: key
      }));

      F.append(build('p', {
        className: 'mb2 f6 o7',
        innerHTML: count === 0
          ? `No activity in the past ${view} days`
          : `Updated ${ago(last.end)}`
      }));

      return F;
    },

    /**
     * Build Detail overview
     * @param {LogSet} set
     * @return {Object}
     */
    ovw (set) {
      const o = build('div', {className: 'psr'});
      if (set.count > 0) o.append(UI.vis.barChart(set.bar()));
      return o;
    },

    /**
     * Build Detail tabs
     * @param {number=} mode - Sector (0) or project (1)
     * @return {Object}
     */
    tabs (mode = 0) {
      const t = build('div', {className: 'mb3 lhc'});
      let sec = 'secsect';
      let tab = 'sectab';
      let sta = 'SST';
      let ent = 'SEN';

      if (mode === 1) {
        sec = 'prosect';
        tab = 'protab';
        sta = 'PST';
        ent = 'PEN';
      }

      function ä (i, innerHTML, c) {
        t.append(Object.assign(document.createElement('button'), {
          className: `pv1 sectab on bg-cl ${c}`,
          onclick: () => Nav.tab(i, sec, tab),
          id: `b-${i}`,
          innerHTML
        }));
      }

      ä(sta, Glossary.stat, 'of mr3');
      ä(ent, Glossary.entries, 'o5');

      return t;
    },

    /**
     * Build Detail stats
     * @param {LogSet} histoire
     * @return {Object}
     */
    stats (histoire) {
      function ä (e, c, i = '') {
        return build(e, {className: c, innerHTML: i});
      }

      const div = document.createElement('div');
      const list = ä('ul', 'lsn f6 lhc r');
      const dur = histoire.listDurations();
      const s = [
        {
          n: Glossary.stats.sum,
          v: toStat(sum(dur))
        }, {
          n: 'Durations',
          v: `${toStat(min(dur))}&ndash;${toStat(max(dur))}`
        }, {
          n: Glossary.stats.avgDur,
          v: toStat(avg(dur))
        }, {
          n: Glossary.stats.sd,
          v: toStat(sd(dur))
        }, {
          n: 'Daily Average',
          v: toStat(histoire.dailyAvg())
        }, {
          n: 'Efficiency',
          v: `${histoire.efficiency().toFixed(2)}%`
        }, {
          n: Glossary.entries,
          v: histoire.count
        }, {
          n: Glossary.stats.streak,
          v: histoire.streak()
        }, {
          n: Glossary.ph,
          v: histoire.peakHour()
        }, {
          n: Glossary.pd,
          v: histoire.peakDay()
        }
      ];

      for (let i = 0, sl = s.length; i < sl; i += 1) {
        const {n, v} = s[i];
        const item = ä('li', 'mb4 c3');
        item.append(ä('p', 'f4 fwb', v));
        item.append(ä('p', 'o7', n));
        list.append(item);
      }

      div.append(list);
      return div;
    },

    /**
     * Build Detail peaks
     * @param {Array} pkh
     * @param {Array} pkd
     * @return {Object}
     */
    peaks (pkh, pkd) {
      function ä (className) {
        return build('div', {className});
      }

      const w = document.createElement('div');
      const a = ä('dib mb4 pr4 lf sh6 w5');
      const b = ä('dib mb4 pl4 lf sh6 w5');
      const h = ä('psr hf wf');
      const d = h.cloneNode();
      const t = build('h3', {
        innerHTML: Glossary.peaks,
        className: 'mb3 f6 fwn'
      });

      w.append(t);
      w.append(a);
      a.append(h);
      h.append(UI.vis.peakChart(0, pkh));
      w.append(b);
      b.append(d);
      d.append(UI.vis.peakChart(1, pkd));

      return w;
    },

    /**
     * @param {number} mode - Sector (0) or project (1)
     * @param {Array}  ent  - Entries
     * @param {Array}  his  - Entries
     */
    distri (mode, ent, his) {
      const container = document.createElement('div');
      const bar = build('div', {className: 'mb3 wf sh2'});
      const legend = build('ul', {className: 'lsn r'});

      if (ent.count > 0) {
        const m = 1 >> mode;
        const v = his.sortValues(m, 1);
        bar.append(UI.vis.focusBar(m, v));
        legend.append(UI.vis.legend(m, v));
      }

      container.append(build('h3', {
        className: 'mb3 f6 lhc fwn',
        innerHTML: mode === 0
          ? Glossary.pro.plural
          : Glossary.sec.plural
      }));

      container.append(bar);
      container.append(legend);

      return container;
    },

    /**
     * Build Detail entries
     * @param {number} mode - Sector (0) or project (1)
     * @param {Array} his
     * @return {Object}
     */
    entries (mode, his) {
      const table = build('table', {className: 'wf bn f6'});
      const tbody = build('tbody', {className: 'nodrag'});
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');

      const n = [
        Glossary.date,
        Glossary.time,
        mode === 0
          ? Glossary.pro.singular
          : Glossary.sec.singular
      ];

      const rev = his.logs.slice(his.count - 100).reverse();

      function td (innerHTML, className = '') {
        return build('td', {innerHTML, className});
      }

      function keyAttr (key) {
        return {
          innerHTML: key,
          className: 'c-pt',
          onclick: () => Nav.toDetail(1 >> mode, key)
        };
      }

      for (let i = 0, l = rev.length; i < l; i += 1) {
        const {s, e, c, t, d, id} = rev[i];
        const key = mode === 0 ? t : c;
        const row = document.createElement('tr');

        row.append(td(id + 1, 'pl0'));
        row.append(td(display(s)));
        row.append(td(`${stamp(s)}–${stamp(e)} (${duration(s, e).toFixed(2)})`));
        row.append(build('td', keyAttr(key)));
        row.append(td(d, 'pr0'));
        tbody.append(row);
      }

      table.append(thead);
      thead.append(tr);

      tr.append(build('th', {className: 'pl0', innerHTML: Glossary.id}));
      for (let i = 0, l = n.length; i < l; i += 1) {
        tr.append(build('th', {innerHTML: n[i]}));
      }
      tr.append(build('th', {className: 'pr0', innerHTML: Glossary.desc}));

      table.append(tbody);

      return table;
    },

    /**
     * Build Detail list
     * @param {number} mode - Sector (0) or project (1)
     * @return {Object}
     */
    list (mode) {
      if (Session.count < 1) return;
      const l = build('ul', {className: 'nodrag oys lsn f6 lhc hvs'});
      l.append(UI.vis.list(mode, Session.sortValues(mode, 0)));
      return l;
    }
  }
};

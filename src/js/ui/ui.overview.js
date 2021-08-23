module.exports = {

  /**
   * Build Overview
   * @param {LogSet} today
   * @param {LogSet} overview
   * @return {Object}
   */
  build (today, overview) {
    const f = document.createDocumentFragment();

    f.append(this.top(today));
    f.append(this.peaks());
    f.append(this.centre(today, overview));
    f.append(this.right(today));

    return f;
  },

  slot (title) {
    const f = document.createElement('div')
    const h1 = build('h3', {innerHTML: title, className: 'mb2 f6 lhc fwn tnum'})
    const div = build('div', {className: 'p4 bg-red'})
    f.append(h1)
    f.append(div)
    return f
  },

  /**
   * Build Overview Top
   * @param {LogSet} today
   * @param {Array} today.logs
   * @return {Object}
   */
  top ({logs}) {
    const top = build('div', {id: 'ovwT'});
    const meter = build('div', {className: 'mb3 psr wf sh2 bl br'});
    const chart = build('div', {className: 'psr wf sh2 nodrag'});

    top.append(meter);
    meter.append(UI.vis.meterLines());
    top.append(chart);
    chart.append(UI.vis.dayChart(logs) || '');

    return top;
  },

  /**
   * Build Overview Centre
   * @param {LogSet} today
   * @param {LogSet} overview
   * @return {Object}
   */
  centre (today, overview) {
    const c = build('div', {id: 'ovwC', className: 'oya ns'});
    c.append(this.chart(overview));
    c.append(this.stats(today));
    // const c = document.createDocumentFragment()
    // c.append(this.slot('Weekly'))
    // c.append(this.slot('Weekly'))
    // c.append(this.slot('Weekly'))
    // c.append(this.slot('Weekly'))
    // c.append(this.slot('Weekly'))
    // c.append(this.slot('Weekly'))
    return c;
  },

  /**
   * Build Overview Right
   * @param {LogSet} today
   * @return {Object}
   */
  right (today) {
    const r = build('div', {id: 'ovwR', className: 'f6 lhc'});
    r.append(this.lists(today));
    return r;
  },

  /**
   * Build Overview Left
   * @return {Object}
   */
  peaks () {
    const ä = (e, c, i = '') => build(e, {className: c, innerHTML: i});
    const ol = build('div', {id: 'ovwL'});
    const ph = document.createElement('div');
    const pd = document.createElement('div');
    const hc = ä('div', 'psr h8 wf nodrag');
    const dc = hc.cloneNode();
    const st = new LogSet(Session.sortByDay()[new Date().getDay()]);
    const pt = st.peakHours();

    ol.append(ä('h3', 'mb3 f6 lhc fwn', Glossary.peaks));
    ol.append(ph);
    ph.append(build('h3', {id: 'ch', className: 'mb2 f6 lhc fwn tnum'}));
    ph.append(hc);
    hc.append(UI.vis.peakChart(0, pt));
    ol.append(pd);
    pd.append(build('h3', {id: 'cd', className: 'mb2 f6 lhc fwn'}));
    pd.append(dc);
    dc.append(UI.vis.peakChart(1, LOG.cache.pkd));

    return ol;
  },

  /**
   * Build Overview Chart
   * @param {LogSet} o
   * @return {Object}
   */
  chart (o) {
    const container = build('div', {className: 'psr'});
    const chart = UI.vis.barChart(o.bar());
    container.append(chart);
    return container;
  },

  /**
   * Build Overview stats
   * @param {LogSet} today
   * @return {Object}
   */
  stats (today) {
    const ä = (e, c, i = '') => build(e, {className: c, innerHTML: i});
    const container = ä('ul', 'lsn f6 lhc');
    const durations = today.listDurations();
    const {count} = today;
    const s = [
      {
        n: Glossary.stats.sum,
        v: toStat(sum(durations))
      }, {
        n: 'Durations',
        v: `${toStat(min(durations))}&ndash;${toStat(max(durations))}`
      }, {
        n: Glossary.stats.avgDur,
        v: toStat(avg(durations))
      }, {
        n: Glossary.stats.cov,
        v: today.coverage().toFixed(2)
      }, {
        n: 'Efficiency',
        v: today.efficiency().toFixed(2)
      }, {
        n: count === 1 ? 'Entry' : Glossary.entries,
        v: count
      }, {
        n: Glossary.stats.streak,
        v: Session.streak()
      },
    ];

    for (let i = 0, l = s.length; i < l; i += 1) {
      const {n, v} = s[i];
      const item = ä('li', 'mb3 c3');
      item.append(ä('p', 'f4 fwb', v));
      item.append(ä('p', 'o7', n));
      container.append(item);
    }

    return container;
  },

  /**
   * Build Overview lists
   * @param {LogSet} today
   * @return {Object}
   */
  lists (today) {
    const ä = i => build('h3', {className: 'mb3 f5 lhc fwn', innerHTML: i});
    const le = build('ul', {className: 'nodrag lsn h8 oya hvs'});
    const sd = UI.vis.list(0, today.sortValues(0));
    const pd = UI.vis.list(1, today.sortValues(1));
    const fr = document.createDocumentFragment();
    const ds = document.createElement('div');
    const dp = document.createElement('div');
    const st = ä(Glossary.sec.plural);
    const pt = ä(Glossary.pro.plural);
    const sl = le.cloneNode();
    const pl = le.cloneNode();

    fr.append(ds);
    ds.append(st);
    ds.append(sl);
    sl.append(sd);
    fr.append(dp);
    dp.append(pt);
    dp.append(pl);
    pl.append(pd);

    return fr;
  }
};

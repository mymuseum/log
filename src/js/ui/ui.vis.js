module.exports = {

  /**
   * Generate chart axis lines
   * @return {Object} Lines
   */
  axisLines () {
    const fr = document.createDocumentFragment();
    const cl = 'psa wf bt o1';
    const dv = build('div', {className: cl});
    const l2 = dv.cloneNode();
    const l3 = dv.cloneNode();
    const l4 = dv.cloneNode();
    const l5 = dv.cloneNode();

    l5.className = `${cl} b0`;
    l4.style.top = '75%';
    l3.style.top = '50%';
    l2.style.top = '25%';

    fr.append(dv.cloneNode());
    fr.append(l2);
    fr.append(l3);
    fr.append(l4);
    fr.append(l5);

    return fr;
  },

  /**
   * Generate bar chart
   * @param {Array=} data
   * @return {Object} Chart
   */
  barChart (data = []) {
    const fr = document.createDocumentFragment();
    if (!Array.isArray(data)) return fr;
    const l = data.length;
    if (l === 0) return fr;

    fr.append(UI.vis.axisLines());

    const barEl = build('div', {className: 'dib psr hf'});
    const sliceEl = build('div', {className: 'psa w9 b0'});

    barEl.style.width = `${100 / l}%`;

    for (let i = 0; i < l; i += 1) {
      const bar = barEl.cloneNode();
      const day = data[i];
      fr.append(bar);
      for (let o = 0, dl = day.length; o < dl; o += 1) {
        const slice = sliceEl.cloneNode();
        Object.assign(slice.style, day[o]);
        bar.append(slice);
      }
    }

    return fr;
  },

  /**
   * Generate day chart
   * @param {Array}   logs
   * @param {string=} cm - Colour mode
   * @param {string=} fg - Foreground colour
   * @return {Object} Chart
   */
  dayChart (logs = [], cm = LOG.config.cm, fg = LOG.config.fg) {
    const fr = document.createDocumentFragment();
    if (
      !Array.isArray(logs)
      || typeof cm !== 'string'
      || cm.length === 0
      || typeof fg !== 'string'
      || fg.length === 0
    ) return fr;
    const l = logs.length;
    if (l === 0) return fr;

    const enEl = build('span', {className: 'hf lf'});

    for (let i = 0, pos = 0; i < l; i += 1) {
      const en = enEl.cloneNode();
      const {wh, mg} = logs[i];

      Object.assign(en.style, {
        backgroundColor: logs[i][cm] || fg,
        marginLeft: `${mg - pos}%`,
        width: `${wh}%`,
      });

      pos = wh + mg;
      fr.append(en);
    }

    return fr;
  },

  /**
   * Generate focus bar
   * @param {number}  mod - Sector (0) or project (1)
   * @param {Array=}  val  - Values
   * @param {string=} fg   - Foreground colour
   * @return {Object} Focus bar
   */
  focusBar (mod, val = [], fg = LOG.config.fg) {
    const fragment = document.createDocumentFragment();
    if (
      typeof mod !== 'number'
      || mod < 0 || mod > 1
      || !Array.isArray(val)
      || typeof fg !== 'string'
      || fg.length === 0
    ) return fr;
    const l = val.length;
    if (l === 0) return fragment;

    const pal = Palette[mod === 0 ? 'sp' : 'pp'];
    const segEl = build('div', {className: 'hf lf'});

    for (let i = 0; i < l; i += 1) {
      const segment = segEl.cloneNode();
      const {n, p} = val[i];
      Object.assign(segment.style, {
        backgroundColor: pal[n] || fg,
        width: `${p}%`
      });
      fragment.append(segment);
    }

    return fragment;
  },

  /**
   * Generate legend
   * @param {number}  mod - Sector (0) or project (1)
   * @param {Array=}  val
   * @param {string=} fg
   * @return {Object} Legend
   */
  legend (mod, val = [], fg = LOG.config.fg) {
    const fr = document.createDocumentFragment();
    if (
      typeof mod !== 'number'
      || mod < 0 || mod > 1
      || !Array.isArray(val)
      || typeof fg !== 'string'
      || fg.length === 0
    ) return fr;
    const l = val.length;
    if (l === 0) return fr;

    const pal = Palette[mod === 0 ? 'sp' : 'pp'];
    const iconEl = build('div', {className: 'dib sh3 sw3 mr2 brf vm'});
    const infoEl = build('div', {className: 'dib vm sw6 elip tnum'});
    const itemEl = build('li', {className: 'c4 mb3 f6 lhc'});

    for (let i = 0; i < l; i += 1) {
      const {n, p} = val[i];
      const item = itemEl.cloneNode();
      const icon = iconEl.cloneNode();
      const info = infoEl.cloneNode();

      icon.style.backgroundColor = pal[n] || fg;
      // FIXME: Don't make functions within a loop
      // icon.onclick = () => Nav.toDetail(mod, n);
      info.innerHTML = `${p.toFixed(2)}% ${n}`;

      item.append(icon);
      item.append(info);
      fr.append(item);
    }

    return fr;
  },

  /**
   * Generate list
   * @param {number}  mod  - Sector (0) or project (1)
   * @param {Array}   sort - Sorted values
   * @param {string=} cm   - Colour mode
   * @param {string=} fg   - Foreground colour
   * @return {Object} List
   */
  list (mod, sort = [], cm = LOG.config.cm, fg = LOG.config.fg) {
    const fr = document.createDocumentFragment();
    if (
      typeof mod !== 'number'
      || mod < 0 || mod > 1
      || !Array.isArray(sort)
      || typeof cm !== 'string'
      || cm.length === 0
      || typeof fg !== 'string'
      || fg.length === 0
    ) return fr;
    const l = sort.length;
    if (l === 0) return fr;

    const pal = Palette[mod === 0 ? 'sp' : 'pp'];

    function ä (e, className, innerHTML = '') {
      return build(e, {className, innerHTML});
    }

    function itemAttr (i, n) {
      return {
        className: `${i === l - 1 ? 'mb0' : 'mb3'} c-pt`,
        onclick: () => Nav.toDetail(mod, n),
      };
    }

    for (let i = 0; i < l; i += 1) {
      const {n, h, p} = sort[i];
      const item = build('li', itemAttr(i, n));
      const name = ä('span', 'dib xw6 elip', n);
      const span = ä('span', 'rf tnum', toStat(h));
      const bar = build('meter', {
        className: 'sh1',
        min: 0,
        max: 100,
        value: p
      });

      item.append(name);
      item.append(span);
      item.append(bar);
      fr.append(item);
    }

    return fr;
  },

  /**
   * Generate meter lines
   * @param {number=} n - Divisions
   * @return {Object} Lines
   */
  meterLines (n = 10) {
    const fr = document.createDocumentFragment();
    const ln = build('div', {className: 'psa br o7'});
    const y = 100 / n;
    for (let i = 0, x = 0; i < n; i += 1) {
      const l = ln.cloneNode();
      Object.assign(l.style, {
        height: i % 2 ? '100%' : '50%',
        left: `${x += y}%`,
      });
      fr.append(l);
    }
    return fr;
  },

  /**
   * Generate peak chart
   * @param {number} mod - Hour (0) or day (1)
   * @param {Array=} peaks
   * @param {string=} ac - Accent colour
   * @param {string=} fg - Foreground colour
   * @return {Object} Chart
   */
  peakChart (mod, peaks = [], ac = LOG.config.ac, fg = LOG.config.fg) {
    const fr = document.createDocumentFragment();
    if (
      typeof mod !== 'number'
      || mod < 0 || mod > 2
      || !Array.isArray(peaks)
      || typeof ac !== 'string'
      || ac.length === 0
      || typeof fg !== 'string'
      || fg.length === 0
    ) return fr;
    const l = peaks.length;
    if (l === 0) return fr;

    const colEl = build('div', {className: 'dib hf psr'});
    const manEl = build('div', {className: 'sw1 hf cn'});
    const peak = max(peaks);
    const d = new Date();
    let label = {};
    let now = 0;

    colEl.style.width = `${100 / l}%`;

    if (mod === 0) {
      label = UI.util.setTimeLabel;
      now = d.getHours();
    } else if (mod === 1) {
      label = UI.util.setDayLabel;
      now = d.getDay();
    }

    const perc = v => `${v / peak * 100}%`;

    function genCore (i, val) {
      const core = build('div', {
        className: 'psa b0 sw1 c-pt hoverCol',
        onmouseout: () => label(),
        onmouseover: () => label(i),
      });

      Object.assign(core.style, {
        backgroundColor: i === now ? ac : fg,
        height: perc(val)
      });

      return core;
    }

    for (let i = 0; i < l; i += 1) {
      const column = colEl.cloneNode();
      const mantle = manEl.cloneNode();
      const core = genCore(i, peaks[i]);
      mantle.append(core);
      column.append(mantle);
      fr.append(column);
    }

    return fr;
  }
};

/**
 * Create Object
 * @param {string} tagName
 * @param {Object} params
 * @return {Object}
 */
function build (tagName, params) {
  return Object.assign(document.createElement(tagName), params);
}

const CLI = window.require('./js/cli');
let Glossary = {};
const Palette = {};
let Session = {};

const LOG = {
  CLOCK: {},
  config: {},
  entries: [],
  cache: {
    sor: [],
    dur: [],
    pkh: [],
    pkd: [],
    pro: [],
    sec: [],
  },

  /**
   * Get log status
   * @return {boolean} Status
   */
  status (s = Session) {
    return s.count === 0 ? false : !s.last.end;
  },

  /**
   * Display session time
   */
  timer () {
    if (!LOG.status()) return;
    const l = +Session.last.start;
    let d = +new Date();
    let h = 0;
    let m = 0;
    let s = 0;

    LOG.CLOCK = setInterval(() => {
      d += 1E3;

      s = ~~((d - l) / 1E3);
      m = ~~(s / 60);
      h = ~~(m / 60);

      h = pad(h %= 24);
      m = pad(m %= 60);
      s = pad(s %= 60);

      UI.timerEl.innerHTML = `${h}:${m}:${s}`;
    }, 1E3);
  },

  setEditFormValues (id) {
    const {s, e, x, c, t, d} = LOG.entries[id];

    function getValue (v) {
      const xy = v.getFullYear();
      const xm = pad((v.getMonth() + 1));
      const xd = pad(v.getDate());
      const xh = pad(v.getHours());
      const xn = pad(v.getMinutes());
      const xs = pad(v.getSeconds());
      return `${xy}-${xm}-${xd}T${xh}:${xn}:${xs}`;
    }

    editID.innerHTML = id + 1;
    editEntryID.value = id;
    editSector.value = c;
    editProject.value = t;
    editDesc.value = d;
    editStart.value = getValue(new Date(s));
    editCI.value = x

    if (e !== undefined && typeof e === 'number') {
      editEnd.value = getValue(new Date(e));
    }
  },

  /**
   * Summon Edit modal
   * @param {number} id - Entry ID
   */
  edit (id) {
    editEnd.value = '';
    LOG.setEditFormValues(id);
    UI.modalMode = true;
    document.getElementById('editModal').showModal();
  },

  /**
   * Summon Delete modal
   * @param {string} i - Command input
   */
  confirmDelete (input) {
    delList.innerHTML = '';

    const words = input.split(' ').slice(1);
    const mode = words[0];
    const key = words[1];
    let confirmation = '';

    function count (prop) {
      const {entries} = LOG;
      const l = entries.length;
      let c = 0;
      for (let i = 0; i < l; i += 1) {
        if (entries[i][prop] === key) c += 1;
      }
      return c;
    }

    if (mode === 'project') {
      confirmation = `Are you sure you want to delete the ${key} project? ${count('t')} entries will be deleted. This can't be undone.`;
    } else if (mode === 'sector') {
      confirmation = `Are you sure you want to delete the ${key} sector? ${count('c')} entries will be deleted. This can't be undone.`;
    } else {
      const aui = words.filter((v, i, self) => self.indexOf(v) === i).sort();
      const span = build('span', {className: 'mr3 o7'});

      confirmation = `Are you sure you want to delete the following ${aui.length > 1 ? `${aui.length} entries` : 'entry'}? This can't be undone.`;

      aui.forEach((i) => {
        const {s, e, c, t, d} = LOG.entries[+i - 1];
        const ss = stamp(new Date(s));
        const se = stamp(new Date(e));
        const li = build('li', {className: 'f6 lhc pb3 mb3'});
        const id = Object.assign(span.cloneNode(), {innerHTML: i});
        const tm = Object.assign(span.cloneNode(), {
          innerHTML: `${ss} &ndash; ${se}`
        });
        const sc = Object.assign(span.cloneNode(), {innerHTML: c});
        const pr = build('span', {className: 'o7', innerHTML: t});
        const dc = build('p', {className: 'f4 lhc', innerHTML: d});

        li.append(id);
        li.append(tm);
        li.append(sc);
        li.append(pr);
        li.append(dc);
        delList.append(li);
      });
    }

    delConfirm.setAttribute('onclick', `LOG.deleteIt('${input}')`);
    delMessage.innerHTML = confirmation;
    delModal.showModal();
  },

  /**
   * Hacky solution
   */
  deleteIt (i) {
    Command.deleteEntry(i);
  },

  /**
   * Update entry
   * @param {number} id - Entry ID
   */
  update (id, attr) {
    Object.assign(LOG.entries[id], attr);
    data.set('log', LOG.entries);
    editModal.close();
    UI.modalMode = false;
    LOG.refresh();
  },

  /**
   * View Details
   * @param {number} mode - Sector (0) or project (1)
   * @param {string} key
   */
  viewDetails (mode, key) {
    if (mode < 0 || mode > 1) return;
    const d = document.getElementById(!mode ? 'SSC' : 'PSC');
    d.innerHTML = '';
    d.append(UI.details.detail.build(mode, key));
  },

  reset () {
    clearInterval(LOG.CLOCK);
    document.getElementById('ui').innerHTML = '';
    console.log('Reset');
  },

  generateSessionCache () {
    if (LOG.entries.length === 0) return;
    Object.assign(LOG.cache, {
      pro: Session.listProjects(),
      sec: Session.listSectors(),
      pkh: Session.peakHours(),
      pkd: Session.peakDays()
    });
  },

  load () {
    LOG.generateSessionCache();

    const css = document.styleSheets[1];
    css.deleteRule(0);
    css.insertRule(`:root{--fg:${LOG.config.fg};--bg:${LOG.config.bg}}`, 0)

    UI.build();
    // UI.util.setTimeLabel();
    // UI.util.setDayLabel();

    if (LOG.entries.length === 0) Nav.index = Nav.menu.length - 1;
    Nav.tab(Nav.menu[Nav.index]);
  },

  refresh () {
    LOG.reset();
    LOG.load();
  },

  init (data) {
    if (data === undefined) {
      console.error('Missing data store');
      return;
    }

    try {
      const ent = data.get('log');
      Session = parse(ent);
      Object.assign(LOG, {
        config: new Config(data.get('config')),
        entries: ent
      });
      Object.assign(Palette, {
        pp: data.get('pp'),
        sp: data.get('sp')
      });
    } catch (e) {
      console.error(e);
      notify('Something went wrong.');
      return;
    }

    Glossary = new Lexicon({
      path: `${__dirname}/lexicon/en.json`
    }).data;

    CLI.installHistory();
    LOG.load();

    document.onkeydown = (e) => {
      if (UI.modalMode) return;
      const {which, ctrlKey, metaKey} = e;

      function focus () {
        UI.commanderEl.style.display = 'block';
        UI.commanderInput.focus();
      }

      if (which >= 65 && which <= 90) {
        focus();
        return;
      }

      if (which >= 48 && which <= 54 && (ctrlKey || metaKey)) {
        Nav.index = which - 49;
        Nav.tab(Nav.menu[Nav.index]);
        return;
      }

      const l = CLI.history.length;

      switch (which) {
        case 9: // Tab
          e.preventDefault();
          Nav.next();
          break;
        case 27: // Escape
          UI.commanderEl.style.display = 'none';
          UI.commanderInput.value = '';
          UI.comIndex = 0;
          break;
        case 38: // Up
          focus();
          UI.comIndex += 1;
          if (UI.comIndex > l) UI.comIndex = 1;
          UI.commanderInput.value = CLI.history[l - UI.comIndex];
          break;
        case 40: // Down
          focus();
          UI.comIndex--;
          if (UI.comIndex < 1) UI.comIndex = 1;
          UI.commanderInput.value = CLI.history[l - UI.comIndex];
          break;
        default:
          break;
      }
    };

    document.addEventListener('click', ({target}) => {
      if (target === entryModal) entryModal.close();
    });
  }
};

const header = window.require('./js/ui/ui.header');
const overview = window.require('./js/ui/ui.overview');
const commander = window.require('./js/ui/ui.commander');
const details = window.require('./js/ui/ui.details');
const entries = window.require('./js/ui/ui.entries');
const journal = window.require('./js/ui/ui.journal');
const guide = window.require('./js/ui/ui.guide');
const vis = window.require('./js/ui/ui.vis');

module.exports = {

  header,
  overview,
  commander,
  details,
  entries,
  journal,
  guide,
  vis,

  modalMode: false,
  timerEl: {},
  commanderEl: {},
  commanderInput: {},
  comIndex: 0,
  days: [],
  months: [],

  /**
   * Build UI
   * @param {Object=} config
   * @param {number=} config.vw - View
   */
  build ({vw} = LOG.config) {
    function ä (id, className) {
      Nav.menu[Nav.menu.length] = id;
      return build('div', {id, className});
    }

    const ovw = new LogSet(Session.recent(vw - 1));
    const sor = Session.sortEntries().slice(-1)[0];
    const tdy = new LogSet(
      Session.last === undefined ? []
        : Session.last.end === undefined ? sor.slice(0, -1) : sor
    );

    const F = document.createDocumentFragment();
    const M = document.createElement('main');
    const c = build('div', {id: 'container', className: 'hf'});
    const o = ä('OVW', 'sect');
    const d = ä('DTL', 'dn sect');
    const e = ä('ENT', 'dn sect oya hvs');
    const j = ä('JOU', 'dn sect oya hvs');
    const g = ä('GUI', 'dn sect hf wf oys oxh');

    F.append(c);
    c.append(this.header.build());
    c.append(M);
    M.append(o);
    o.append(this.overview.build(tdy, ovw));
    M.append(d);
    d.append(this.details.build(ovw));
    M.append(e);
    e.append(this.entries.build());
    M.append(j);
    j.append(this.journal.build());
    M.append(g);
    // g.append(UI.guide.build());
    c.append(this.delModal());
    F.append(this.commander());

    ui.append(F);
  },

  /**
   * Build entry deletion modal
   * @param {Object=} config
   * @param {string=} config.bg - Background colour
   * @param {string=} config.fg - Foreground colour
   * @return {Object}
   */
  delModal ({bg, fg} = LOG.config) {
    const modal = build('dialog', {
      className: 'p4 cn bn nodrag',
      id: 'delModal'
    });

    function ä (e, id, className, innerHTML = '') {
      modal.append(build(e, {id, className, innerHTML}));
    }

    Object.assign(modal.style, {backgroundColor: bg, color: fg});

    ä('p', 'delMessage', 'mb4 f6 lhc');
    ä('ul', 'delList', 'mb3 lsn');
    ä('button', 'delConfirm', 'p2 br1 bn f6', 'Delete');

    modal.append(build('button', {
      className: 'p2 br1 bn f6 lhc',
      innerHTML: 'Cancel',
      onclick: () => {
        UI.modalMode = false;
        modal.close();
      }
    }));

    return modal;
  },

  util: {
    setDayLabel (day = new Date().getDay()) {
      cd.innerHTML = Glossary.days[day];
    },

    setTimeLabel (hour = new Date().getHours()) {
      ch.innerHTML = `${pad(hour)}:00`;
    }
  }
};

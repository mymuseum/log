module.exports = {

  /**
   * Build Entries section
   * @return {Object}
   */
  build () {
    const fragment = document.createDocumentFragment();
    fragment.append(this.table());
    fragment.append(this.modal());
    return fragment;
  },

  /**
   * Build Entries table
   * @return {Object}
   */
  table (glossary = Glossary) {
    const ä = (e, className, innerHTML = '') => build(e, {className, innerHTML});

    const f = document.createDocumentFragment();
    const T = ä('table', 'wf bn f6');
    const h = ä('thead', 'al');
    const b = ä('tbody', 'nodrag');

    const columnName = [
      glossary.date,
      glossary.time,
      glossary.ci,
      glossary.sec.singular,
      glossary.pro.singular
    ];

    const el = LOG.entries.length;
    const arr = LOG.entries.slice(el - 100).reverse();

    function idAttr (id, i) {
      return {
        onclick: () => LOG.edit(id),
        className: 'pl0 c-pt hover',
        innerHTML: el - i,
      };
    }

    function dateAttr (s, sd) {
      return {
        onclick: () => Nav.toJournal(s),
        className: 'c-pt hover',
        innerHTML: display(sd)
      };
    }

    function ctAttr (m, t) {
      return {
        onclick: () => Nav.toDetail(m, t),
        className: 'c-pt hover',
        innerHTML: t
      };
    }

    for (let i = 0, l = arr.length; i < l; i += 1) {
      const {s, e, x, c, t, d} = arr[i];
      const sd = new Date(s);
      const ed = new Date(e);
      const st = stamp(sd);
      const id = el - i - 1;
      const r = build('tr', {id: `r${id}`});
      const xi = x === 1 ? '●' : x === 0 ? '○' : '';

      r.append(build('td', idAttr(id, i)));
      r.append(build('td', dateAttr(s, sd)));
      r.append(build('td', {
        innerHTML: e === undefined
          ? `${st}–`
          : `${st}–${stamp(new Date(e))} (${toStat(duration(sd, ed))})`
      }));
      r.append(build('td', {innerHTML: xi}));
      r.append(build('td', ctAttr(0, c)));
      r.append(build('td', ctAttr(1, t)));
      r.append(ä('td', 'pr0', d));
      b.append(r);
    }

    T.append(h);
    h.append(ä('th', 'pl0 fwn', glossary.id));
    for (let i = 0, l = columnName.length; i < l; i += 1) {
      h.append(ä('th', 'fwn', columnName[i]));
    }
    h.append(ä('th', 'pr0 fwn', glossary.desc));
    T.append(b);
    f.append(T);

    return f;
  },

  /**
   * Build Entries modal
   * @param {Object} config
   * @param {string} config.bg - Background
   * @param {string} config.fg - Foreground
   * @return {Object}
   */
  modal ({bg, fg} = LOG.config) {
    const m = Object.assign(
      document.createElement('dialog'), {
        id: 'editModal',
        className: 'p4 cn bn h6',
        onkeydown: (e) => {
          if (e.key === 'Escape') UI.modalMode = false;
        }
      }
    );

    const f = Object.assign(
      document.createElement('form'), {
        onsubmit: () => false,
        className: 'nodrag',
        id: 'editForm'
      }
    );

    const i = Object.assign(
      document.createElement('input'), {
        className: 'db wf p2 mb3 bn'
      }
    );

    Object.assign(m.style, {backgroundColor: bg, color: fg});

    document.addEventListener('click', ({target}) => {
      if (target === m) {
        UI.modalMode = false;
        m.close();
      }
    });

    f.addEventListener('submit', () => {
      const e = editEnd.value === '' ? '' : new Date(editEnd.value);

      LOG.update(editEntryID.value, {
        s: +(new Date(editStart.value)),
        e: e === '' ? undefined : +e,
        x: +editCI.value,
        c: editSector.value,
        t: editProject.value,
        d: editDesc.value
      });

      UI.modalMode = false;
    });

    m.append(build('p', {
      id: 'editID',
      className: 'mb4 f6 lhc'
    }));

    m.append(f);

    f.append(build('input', {
      id: 'editEntryID',
      type: 'hidden'
    }));

    f.append(Object.assign(i.cloneNode(), {
      id: 'editSector',
      type: 'text',
      placeholder: 'Sector'
    }));

    f.append(Object.assign(i.cloneNode(), {
      id: 'editProject',
      type: 'text',
      placeholder: 'Project'
    }));

    f.append(build('textarea', {
      id: 'editDesc',
      className: 'db wf p2 mb3 bn',
      rows: '3',
      placeholder: 'Description (optional)'
    }));

    f.append(Object.assign(i.cloneNode(), {
      id: 'editStart',
      type: 'datetime-local',
      step: '1'
    }));

    f.append(Object.assign(i.cloneNode(), {
      id: 'editEnd',
      type: 'datetime-local',
      step: '1'
    }));

    f.append(Object.assign(i.cloneNode(), {
      id: 'editCI',
      type: 'number',
      min: -1,
      max: 1
    }));

    f.append(build('input', {
      id: 'editUpdate',
      className: 'dib p2 mr2 br1 bn',
      type: 'submit',
      value: 'Update'
    }));

    f.append(build('input', {
      id: 'editCancel',
      className: 'dib p2 br1 bn',
      type: 'button',
      value: 'Cancel',
      onclick: () => {
        UI.modalMode = false;
        m.close();
      }
    }));

    return m;
  }
};

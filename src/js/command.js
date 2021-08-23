const {dialog} = require('electron').remote;

module.exports = {

  /**
   * Import a file
   */
  importData () {
    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Custom File Type', extensions: ['json']}
      ]
    }).then(({filePaths}) => {
      const file = filePaths[0];
      let contents = '';
      let data = {};

      try {
        contents = fs.readFileSync(file, 'utf-8');
      } catch (err) {
        console.log(err);
        notify('ERROR: Unable to load file.');
        return;
      }

      try {
        data = JSON.parse(contents);
      } catch (err) {
        console.error(err);
        notify('ERROR: Invalid JSON.');
        return;
      }

      this.installData(file, data);
    });
  },

  /**
   * Install data from imported file
   * @param {string} path - Path to file
   * @param {Object} data
   */
  installData (path, data) {
    try {
      LOG.config = data.config;
      LOG.entries = data.log;
      Palette.sp = data.sp;
      Palette.pp = data.pp;
      Session = parse(LOG.entries);
    } catch (err) {
      console.error(err);
      notify('ERROR: Log data is invalid or contains errors.');
      return;
    }

    localStorage.setItem('logDataPath', path);

    Update.all();
    LOG.refresh();
    notify('Log data successfully imported');
  },

  exportData () {
    const data = JSON.stringify(
      JSON.parse(localStorage.getItem('user'))
    );

    dialog.showSaveDialog((file) => {
      if (file === undefined) return;
      fs.writeFile(file, data, (err) => {
        const msg = err
          ? `An error occured creating the file ${err.message}`
          : 'Log data exported';
        notify(msg);
      });
    });
  },

  // TODO: Rewrite
  startEntry (input) {
    const s = Math.trunc(+(new Date()) / 1E3) * 1E3;

    // End ongoing log, if any
    if (
      LOG.entries.length > 0
      && LOG.entries.slice(-1)[0].e === undefined
    ) {
      this.endEntry();
    }

    const indices = [];
    let p = [];
    let c = '';
    let t = '';
    let d = '';

    if (input.indexOf('"') > -1) {
      p = input.split('');
      for (let i = 0, l = p.length; i < l; i += 1) {
        if (p[i] === '"') indices[indices.length] = i;
      }
      for (let i = indices[0] + 1; i < indices[1]; i += 1) c += p[i];
      for (let i = indices[2] + 1; i < indices[3]; i += 1) t += p[i];
      for (let i = indices[4] + 1; i < indices[5]; i += 1) d += p[i];
    } else {
      if (input.indexOf(';') > -1) p = input.split(';');
      else if (input.indexOf('|') > -1) p = input.split('|');
      else if (input.indexOf(',') > -1) p = input.split(',');
      else return;

      c = p[0].substring(6, p[0].length).trim();
      t = p[1].trim();
      d = p[2].trim();
    }

    LOG.entries[LOG.entries.length] = {s, e: undefined, x: 0, c, t, d};
    notify(`Started: ${c} - ${t} - ${d}`);
    Update.log();
  },

  /**
   * End entry
   * @param {number} ci - Completion index
   */
  endEntry (ci) {
    const end = Math.trunc(+(new Date()) / 1E3) * 1E3;
    if (Session.logs === undefined || Session.count === 0) return;

    const last = LOG.entries.slice(-1)[0];
    if (last.e !== undefined) return;

    last.x = ci;
    last.e = end;

    const {c, t, d} = last;
    notify(`Ended: ${c} - ${t} - ${d}`);
    Update.log();
  },

  resumeEntry () {
    const s = +(new Date());
    if (Session.count === 0) return;

    const {e, c, t, d} = LOG.entries.slice(-1)[0];
    if (e === undefined) return;

    LOG.entries[LOG.entries.length] = {s, c, t, d};
    notify(`Resumed: ${c} - ${t} - ${d}`);
    Update.log();
  },

  /**
   * TODO: Rewrite
   * Delete entry
   * @param {string} input
   */
  deleteEntry (input) {
    if (Session.count === 0) return;

    // all except first word are entry indices
    const words = input.split(' ').slice(1);

    switch (words[0]) {
      case 'project': {
        LOG.entries.forEach(({t}, id) => {
          if (t === words[1]) LOG.entries.splice(id, 1);
        });
        break;
      }
      case 'sector': {
        LOG.entries.forEach(({c}, id) => {
          if (c === words[1]) LOG.entries.splice(id, 1);
        });
        break;
      }
      default: {
        // aui = ascending unique indices
        const aui = words.filter((v, i, self) => self.indexOf(v) === i).sort();
        // remove all indices. We start from the highest to avoid
        // the shifting of indices after removal.
        aui.reverse().forEach(i => LOG.entries.splice(+i - 1, 1));
        break;
      }
    }

    Update.all();
  },

  /**
   * TODO: Re-implement timestamp editing
   * Edit an entry
   * @param {number} id
   * @param {string} attr
   * @param {string|number} val
   */
  editEntry (i, attr, val) {
    if (LOG.entries.length === 0) return;
    const id = +i - 1;

    switch (attr) {
      case 'duration': case 'dur': {
        const dur = parseInt(val, 10) * 60 || 0;
        LOG.entries[id].e = offset(LOG.entries[id].s, dur);
        break;
      }
      case 'description': case 'desc': case 'dsc':
        LOG.entries[id].d = val;
        break;
      case 'sector': case 'sec':
        LOG.entries[id].c = val;
        break;
      case 'project': case 'pro':
        LOG.entries[id].t = val;
        break;
      default: break;
    }

    Update.all();
  },

  /**
   * Rename sector/project
   * @param {string} key - Sector or project
   * @param {string} oldName - Original name
   * @param {string} newName - New name
   */
  rename (key, oldName, newName) {
    if (secpro.indexOf(key) < 0) return;

    const typ = (key === 'sector' || key === 'sec') ? 'sector' : 'project';
    const notFound = `The ${typ} "${oldName}" does not exist`;
    const l = LOG.entries.length;
    let prop = '';
    let by = [];

    if (typ === 'sector') {
      by = Session.bySector(oldName);
      prop = 'c';
    } else {
      by = Session.byProject(oldName);
      prop = 't';
    }

    if (by.length > 0) {
      for (let i = 0; i < l; i += 1) {
        if (LOG.entries[i][prop] === oldName) LOG.entries[i][prop] = newName;
      }
    } else {
      notify(notFound);
      return;
    }

    notify(`${oldName} has been renamed to ${newName}`);
    Update.all();
  },

  /**
   * Invert UI colours
   */
  invert () {
    const {bg, fg} = LOG.config;
    Object.assign(LOG.config, {fg: bg, bg: fg});
    Update.config();
  },

  /**
   * TODO: Implement
   * Undo last action
   */
  undo () {
    const i = CLI.history.slice(-2)[0];
    const k = i.split(' ')[0].toLowerCase();
    switch (k) {
      case 'rename': case 'rn': {
        const p = CLI.parameterise(i);
        this.rename(p[1], p[3], p[2]);
        break;
      }
      case 'invert': case 'iv':
        this.invert();
        break;
      default: break;
    }
  }
};

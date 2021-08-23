module.exports = {

  paraCom: [
    'edit', 'colourcode', 'colorcode', 'cc', 'rename', 'rn'
  ],

  history: [],

  installHistory () {
    if (Object.prototype.hasOwnProperty.call(localStorage, 'histoire')) {
      this.history = JSON.parse(localStorage.getItem('histoire'));
    } else {
      this.history = [];
      localStorage.setItem('histoire', '[]');
    }
  },

  /**
   * TODO: Rewrite
   * Extract parameters
   * @param {string} input
   * @return {Array} Parameters
   */
  parameterise (input) {
    if (
      typeof input !== 'string'
      || input.indexOf('"') < 0
    ) return;
    const part = input.slice(0, input.indexOf('"') - 1).split(' ');
    const p = input.split('');
    const params = [];
    const indices = [];
    let param = '';

    for (let i = 0, l = part.length; i < l; i += 1) {
      const e = part[i];
      if (e.indexOf('"') < 0) params[params.length] = e;
    }

    for (let i = 0, l = p.length; i < l; i += 1) {
      if (p[i] === '"') indices[indices.length] = i;
    }

    for (let i = 0, l = indices.length; i < l; i += 2) {
      for (let o = indices[i] + 1; o < indices[i + 1]; o += 1) {
        param += p[o];
      }
      params[params.length] = param;
      param = '';
    }

    return params;
  },

  /**
   * TODO: Rewrite
   * Parse input
   * @param {string} input
   */
  parse (input) {
    const s = input.split(' ');
    const key = s[0].toLowerCase();

    if (this.paraCom.indexOf(input) < 0) {
      switch (key) {
        case 'begin':
        case 'start':
          Command.startEntry(input);
          break;
        case 'end':
        case 'stop':
        case 'pause': {
          let ci = s[1] || 0;
          ci = isNumber(ci) ? +ci : 0;
          Command.endEntry(ci);
          if (LOG.stopTimer) LOG.stopTimer();
          break;
        }
        case 'resume':
        case 'continue':
          Command.resumeEntry();
          break;
        case 'del':
        case 'delete':
          LOG.confirmDelete(input);
          break;
        case 'undo':
          Command.undo();
          break;
        case 'bg':
        case 'background':
          LOG.config.setBackgroundColour(s[1]);
          break;
        case 'fg':
        case 'color':
        case 'colour':
        case 'foreground':
          LOG.config.setForegroundColour(s[1]);
          break;
        case 'ac':
        case 'hl':
        case 'accent':
        case 'highlight':
          LOG.config.setAccent(s[1]);
          break;
        case 'cm':
        case 'colormode':
        case 'colourmode':
          LOG.config.setColourMode(s[1]);
          break;
        case 'view':
          LOG.config.setView(+s[1]);
          break;
        case 'cal':
        case 'calendar':
          LOG.config.setCalendar(s[1]);
          break;
        case 'time':
        case 'clock':
          LOG.config.setTimeFormat(s[1]);
          break;
        case 'stat':
          LOG.config.setStatFormat(s[1]);
          break;
        case 'import':
          Command.importData();
          break;
        case 'export':
          Command.exportData();
          break;
        case 'iv':
        case 'invert':
          Command.invert();
          break;
        case 'q':
        case 'quit':
        case 'exit':
          app.quit();
          break;
        default:
          break;
      }
    } else {
      const p = this.parameterise(input);
      switch (key) {
        case 'edit':
          Command.editEntry(p[1], p[2], p[3]);
          break;
        case 'cc':
        case 'colorcode':
        case 'colourcode':
          LOG.options.set.colourCode(p[1], p[2], p[3]);
          break;
        case 'rn':
        case 'rename':
          Command.rename(p[1], p[2], p[3]);
          break;
        default:
          break;
      }
    }
  }
};

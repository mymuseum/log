module.exports = {
  menu: [],
  index: 0,

  // Move to the next tab
  next () {
    this.index = this.index === this.menu.length - 1 ? 0 : this.index + 1;
    this.tab(this.menu[this.index]);
  },

  /**
   * Open tab
   * @param {string} id
   * @param {string=} g - Group
   * @param {string=} t - Tab group
   * @param {boolean=} vertical - Orientation: vertical?
   */
  tab (id, g = 'sect', t = 'tab', vertical = false) {
    const o = vertical ? 'db mb3' : 'pv1';
    const n = `${o} ${t} on bg-cl o5 mr3`;
    const x = document.getElementsByClassName(g);
    const b = document.getElementsByClassName(t);
    const cb = document.getElementById(`b-${id}`);
    const ct = document.getElementById(id);

    this.index = this.menu.indexOf(id);

    for (let i = 0, l = x.length; i < l; i += 1) {
      x[i].style.display = 'none';
    }

    for (let i = 0, l = b.length; i < l; i += 1) {
      b[i].className = n;
    }

    ct.style.display = 'grid';
    cb.className = `${o} ${t} on bg-cl of mr3`;
  },

  /**
   * Navigate to Journal entry
   * @param {string} hex
   */
  toJournal (hex) {
    this.tab('JOU');
    LOG.journal.translate(hex);
  },

  /**
   * Navigate to sector or project detail
   * @param {number} mode - Sector (0) or project (1)
   * @param {string} key
   */
  toDetail (mode, key) {
    if (
      typeof mode !== 'number'
      || typeof key !== 'string'
      || mode < 0 || mode > 1
    ) return;

    LOG.viewDetails(mode, key);
    this.tab(!mode ? 'SSC' : 'PSC', 'subsect', 'subtab', true);
    this.tab('DTL');
  }
};

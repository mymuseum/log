module.exports = {

  all () {
    this.config(false);
    this.secPalette(false);
    this.proPalette(false);
    this.log(false);
    LOG.refresh();
  },

  /**
   * Update config
   * @param {boolean=} r - Refresh?
   */
  config (r = true) {
    data.set('config', LOG.config);
    if (r) LOG.refresh();
  },

  /**
   * Update log
   * @param {boolean=} r - Refresh?
   */
  log (r = true) {
    if (LOG.entries.length === 0) {
      console.error('Empty log');
      return;
    }

    data.set('log', LOG.entries);
    Session = parse(LOG.entries);
    if (r) LOG.refresh();
  },

  /**
   * Update sector palette
   * @param {boolean=} r - Refresh?
   */
  secPalette (r = true) {
    if (Palette.sp === {}) {
      console.error('Empty sector palette');
      return;
    }

    data.set('sp', Palette.sp);
    if (r) LOG.refresh();
  },

  /**
   * Update project palette
   * @param {boolean=} r - Refresh?
   */
  proPalette (r = true) {
    if (Palette.pp === {}) {
      console.error('Empty project palette');
      return;
    }

    data.set('pp', Palette.pp);
    if (r) LOG.refresh();
  }
};

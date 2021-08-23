module.exports = {

  /**
   * Build Header
   * @return {Object}
   */
  build () {
    const header = build('header', {className: 'mb2 f6 lhc'});
    header.append(this.nav());
    header.append(this.clock());
    return header;
  },

  /**
   * Build Navigation
   * @return {Object} Navi
   */
  nav ({menu} = Nav, {tabs} = Glossary) {
    const fragment = document.createDocumentFragment();

    function addTab (id, innerHTML, opacity = 'o5') {
      fragment.append(build('button', {
        className: `pv1 tab on bg-cl ${opacity} mr3`,
        onclick: () => Nav.tab(id),
        id: `b-${id}`,
        innerHTML
      }));
    }

    addTab(menu[0], tabs.overview, 'of');
    addTab(menu[1], tabs.details);
    addTab(menu[2], tabs.entries);
    addTab(menu[3], tabs.journal);
    addTab(menu[4], tabs.guide);

    return fragment;
  },

  /**
   * Build Clock
   * @return {Object} Clock
   */
  clock () {
    UI.timerEl = build('span', {
      className: 'rf f5 di tnum',
      innerHTML: '00:00:00'
    });

    LOG.timer();
    return UI.timerEl;
  }
};

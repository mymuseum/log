const calendars = ['aequirys', 'desamber', 'gregorian'];
const secpro = ['sector', 'sec', 'project', 'pro'];
const timeformats = ['24', '12', 'decimal'];
const statformats = ['decimal', 'human'];
module.exports = class Config {
  /**
   * Construct config
   * @param {Object} attr
   * @param {string} attr.ac - Accent colour
   * @param {string} attr.bg - Background colour
   * @param {number} attr.ca - Calendar
   * @param {string} attr.cm - Colour mode
   * @param {string} attr.fg - Foreground colour
   * @param {number} attr.st - Stat format
   * @param {number} attr.tm - Time format
   * @param {number} attr.vw - View
   */
  constructor (attr) {
    Object.assign(this, attr);
  }

  /**
   * Set accent
   * @param {string} accent
   */
  setAccent (accent) {
    this.ac = accent;
    Update.config();
  }

  /**
   * Set background colour
   * @param {string} colour
   */
  setBackgroundColour (colour) {
    this.bg = colour;
    Update.config();
  }

  /**
   * Set calendar system
   * @param {string} calendar
   */
  setCalendar (calendar) {
    if (calendars.indexOf(calendar) < 0) return;
    cDisplay = {};

    let n = 0;
    switch (calendar) {
      case 'aequirys':
      case 'desamber':
        n = 1;
        break;
      default:
        break;
    }

    this.ca = n;
    Update.config();
  }

  /**
   * Set colour mode
   * @param {string} mode - Sector, project, or none
   */
  setColourMode (mode) {
    if (secpro.indexOf(mode) < 0 && mode !== 'none') return;
    let n;
    switch (mode) {
      case 'sector': case 'sec': n = 'sc'; break;
      case 'project': case 'pro': n = 'pc'; break;
      case 'none': n = 'none'; break;
      default: break;
    }

    this.cm = n;
    Update.config();
  }

  /**
   * Set foreground colour (text colour)
   * @param {string} colour
   */
  setForegroundColour (colour) {
    this.fg = colour;
    Update.config();
  }

  /**
   * Set stat display format
   * @param {string} format - Decimal or human
   */
  setStatFormat (format) {
    if (statformats.indexOf(format) < 0) return;
    this.st = +!(format === 'decimal');
    Update.config();
  }

  /**
   * Set time system
   * @param {string} format - 24, 12, or decimal
   */
  setTimeFormat (format) {
    if (timeformats.indexOf(format) < 0) return;

    let n = 0;
    switch (format) {
      case '24': n = 1; break;
      case 'decimal': n = 2; break;
      default: break;
    }

    this.tm = n;
    Update.config();
  }

  /**
   * Set view to n days
   * @param {number} n
   */
  setView (n) {
    if (n < 0) return;
    this.vw = n;
    Update.config();
  }
};

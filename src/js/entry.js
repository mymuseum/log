module.exports = class Entry {
  /**
   * Construct an entry
   * @param {Object} attr
   * @param {number} attr.id - Entry ID
   * @param {Date} attr.s - Start time
   * @param {Date} attr.e - End time
   * @param {number} attr.ci - Completion index
   * @param {string} attr.c - Sector
   * @param {string} attr.t - Project
   * @param {string} attr.d - Description
   */
  constructor (attr) {
    Object.assign(this, attr);
    this.dur = duration(this.s, this.e);
  }

  get start () { return this.s; }

  get end () { return this.e; }

  get completionIndex () { return this.ci; }

  get sector () { return this.c; }

  get project () { return this.t; }

  get desc () { return this.d; }

  set setStart (s) { this.s = s; }

  set setEnd (e) { this.e = e; }

  set setCompletionIndex (x) { this.ci = x; }

  set setSector (c) { this.c = c; }

  set setProject (t) { this.t = t; }

  set setDesc (d) { this.d = d; }

  get sc () { return Palette.sp[this.sector]; }

  get pc () { return Palette.pp[this.project]; }

  get wh () { return this.calcWidth(); }

  get mg () { return this.calcMargin(); }

  /**
   * Calc distance from 00:00:00
   * @return {number}
   */
  calcMargin () {
    const d = this.start;
    const m = new Date(d).setHours(0, 0, 0, 0);
    return (+d - +m) / 864E3;
  }

  /**
   * Calc duration width relative to 24h
   * @return {number}
   */
  calcWidth () {
    return this.dur * 25 / 6;
  }
};

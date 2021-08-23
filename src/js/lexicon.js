function parseDataFile (filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.log(error);
    // return defaults;
  }
}

module.exports = class Lexicon {
  constructor (opts) {
    this.path = opts.path;
    this.data = parseDataFile(this.path);
  }

  get (key) {
    return this.data[key];
  }

  set (key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
};

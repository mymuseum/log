/**
 * Build Commander
 * @return {Object} Commander
 */
module.exports = function () {
  const commander = build('form', {
    className: 'dn psf b0 l0 wf f6 z9',
    onsubmit: () => false,
  });

  const input = build('input', {
    autofocus: 'autofocus',
    className: 'wf bg-0 blanc on bn p3',
    placeholder: Glossary.console,
    type: 'text',
  });

  commander.addEventListener('submit', () => {
    const {history} = CLI;
    const {value} = this.commanderInput;

    if (value !== '') {
      const l = history.length;
      if (value !== history[l - 1]) history[l] = value;
      if (l >= 100) history.shift();
      localStorage.setItem('histoire', JSON.stringify(history));
      CLI.parse(value);
    }

    this.commanderEl.style.display = 'none';
    this.commanderInput.value = '';
    LOG.comIndex = 0;
  });

  commander.append(input);
  UI.commanderEl = commander;
  UI.commanderInput = input;
  return commander;
};

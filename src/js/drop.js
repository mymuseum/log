window.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
});

window.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const {files} = e.dataTransfer;

  for (const id in files) {
    const file = files[id];

    if (!~file.name.indexOf('.json')) {
      console.log('skipped', file);
      continue;
    }

    const {path} = file;
    const reader = new FileReader();

    reader.onload = (f) => {
      const o = JSON.parse(f.target.result);

      ø(user.config.ui, {
        bg: o.config.ui.bg || '#f8f8f8',
        colour: o.config.ui.colour || '#202020',
        accent: o.config.ui.accent || '#eb4e32',
        cm: o.config.ui.cm || 'sector',
        view: o.config.ui.view || 28,
        stat: o.config.ui.stat || 0
      });

      ø(user.config.system, {
        calendar: o.config.system.calendar || 'gregorian',
        timeFormat: o.config.system.timeFormat || '24'
      });

      user.sp = o.sp || {};
      user.pp = o.pp || {};
      user.log = o.log || [];

      localStorage.setItem('logDataPath', path);
      dataStore.path = path;

      localStorage.setItem('user', o);
      user = JSON.parse(localStorage.getItem('user'));

      notify('Your log data was successfully imported.');
      LOG.options.update.all();
    };

    reader.readAsText(file);
    return;
  }
});

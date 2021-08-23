const {app, BrowserWindow, Menu} = require('electron');
const {argv, platform} = process;
let win;

if (argv[2] && argv[2] === 'dev') {
  require('electron-reload')(__dirname);
}

app.on('ready', () => {
  if (platform === 'win32') app.quit();

  win = new BrowserWindow({
    autoHideMenuBar: true,
    devTools: true,
    minimumFontSize: 16,
    defaultEncoding: "utf-8",
    frame: false,
    fullscreenable: false,
    height: 500,
    icon: `${__dirname}/icon.icns`,
    resizable: false,
    show: false,
    webPreferences: {
      images: false,
      nodeIntegration: true,
      webaudio: false,
      webgl: false,
      plugins: false,
      disableBlinkFeatures: "PrintBrowser,Sensor,TranslateService,UseWindowsSystemColors,WebUSB"
    },
    width: 800,
  });

  win.loadURL(`file://${__dirname}/src/index.html`);

  win.webContents.on('did-finish-load', () => {
    win.show();
    win.focus();
  });

  win.on('closed', () => (win = null));

  if (platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
      label: app.getName(),
      submenu: [
        {role: 'minimize'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    }]));
  }
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});

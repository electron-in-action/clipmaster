const path = require('path');
const {
  app,
  BrowserWindow,
  clipboard,
  globalShortcut,
  Menu,
  Tray,
  systemPreferences
} = require('electron');

const clippings = [];
let tray = null;
let browserWindow = null;

const getIcon = () => {
  if (process.platform === 'win32') return 'icon-light.ico';
  if (systemPreferences.isDarkMode()) return 'icon-light.png';
  return 'icon-dark.png';
};

app.on('ready', () => {
  if (app.dock) app.dock.hide();

  tray = new Tray(path.join(__dirname, getIcon()));
  tray.setPressedImage(path.join(__dirname, 'icon-light.png'));

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  browserWindow = new BrowserWindow({
    show: false
  });

  browserWindow.loadURL(`file://${__dirname}/index.html`);

  const activationShortcut = globalShortcut.register('CommandOrControl+Option+C', () => {
    tray.popUpContextMenu();
  });

  if (!activationShortcut) console.error('Global activation shortcut failed to regiester');

  const newClippingShortcut = globalShortcut.register('CommandOrControl+Shift+Option+C', () => {
    const clipping = addClipping();
    if (clipping) {
      browserWindow.webContents.send('show-notification', 'Clipping Added', clipping);
    }
  });

  if (!newClippingShortcut) console.error('Global new clipping shortcut failed to regiester');

  updateMenu();

  tray.setToolTip('Clipmaster');
});

const updateMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Create New Clipping',
      click() { addClipping(); },
      accelerator: 'CommandOrControl+Shift+C'
    },
    { type: 'separator' },
    ...clippings.slice(0, 10).map(createClippingMenuItem),
    { type: 'separator' },
    {
      label: 'Quit',
      click() { app.quit(); },
      accelerator: 'CommandOrControl+Q'
    }
  ]);

  tray.setContextMenu(menu);
};

const addClipping = () => {
  const clipping = clipboard.readText();
  if (clippings.includes(clipping)) return;
  clippings.unshift(clipping);
  updateMenu();
  return clipping;
};

const createClippingMenuItem = (clipping, index) => {
  return {
    label: clipping.length > 20 ? clipping.slice(0, 20) + '…' : clipping,
    click() { clipboard.writeText(clipping); },
    accelerator: `CommandOrControl+${index}`
  };
};

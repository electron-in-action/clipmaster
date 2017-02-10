const path = require('path');
const { app, clipboard, globalShortcut, Menu, Tray } = require('electron');

const clippings = [];
let tray = null;

app.on('ready', () => {
  if (app.dock) app.dock.hide();

  tray = new Tray(path.join(__dirname, '/Icon.png'));

  const activationShortcut = globalShortcut.register('CommandOrControl+Option+C', () => {
    tray.popUpContextMenu();
  });

  if (!activationShortcut) console.error('Global activation shortcut failed to regiester');

  const newClippingShortcut = globalShortcut.register('CommandOrControl+Shift+C', () => {
    addClipping();
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
};

const createClippingMenuItem = (clipping, index) => {
  return {
    label: clipping.length > 20 ? clipping.slice(0, 20) + '…' : clipping,
    click() { clipboard.writeText(clipping); },
    accelerator: `CommandOrControl+${index}`
  };
};

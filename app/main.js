const path = require('path');
const { app, clipboard, Menu, Tray } = require('electron');

const clippings = [];
let tray = null;

app.on('ready', () => {
  if (app.dock) app.dock.hide();

  tray = new Tray(path.join(__dirname, '/Icon.png'));

  updateMenu();

  tray.setToolTip('Clipmaster');
});

const updateMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Create New Clipping',
      click() { addClipping(); }
    },
    { type: 'separator' },
    ...clippings.map(createClippingMenuItem),
    { type: 'separator' },
    {
      label: 'Quit',
      click() { app.quit(); }
    }
  ]);

  tray.setContextMenu(menu);
};

const addClipping = () => {
  if (clippings.includes(clipping)) return;
  const clipping = clipboard.readText();
  clippings.push(clipping);
  updateMenu();
};

const createClippingMenuItem = (clipping, index) => {
  return {
    label: clipping.length > 20 ? clipping.slice(0, 20) + '…' : clipping,
    click() { clipboard.writeText(clipping); },
    accelerator: `CommandOrControl+${index}`
  };
};

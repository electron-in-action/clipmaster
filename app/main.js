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
    ...clippings.map((clipping, index) => ({ label: clipping })),
    { type: 'separator' },
    {
      label: 'Quit',
      click() { app.quit(); }
    }
  ]);

  tray.setContextMenu(menu);
};

const addClipping = () => {
  const clipping = clipboard.readText();
  clippings.push(clipping);
  updateMenu();
};

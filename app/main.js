const { app, Menu, Tray } = require('electron');

let tray = null;

app.on('ready', () => {
  if (app.dock) app.dock.hide();

  tray = new Tray(__dirname + '/Icon.png');

  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() { app.quit(); }
    }
  ]);

  tray.setToolTip('Clipmaster');
  tray.setContextMenu(menu);
});

const { ipcRenderer } = require('electron');

ipcRenderer.on('show-notification', (event, title, body, onClick = () => { }) => {
  const myNotification = new Notification(title, { body });

  myNotification.onclick = onClick;
});

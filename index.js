const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;
let backgroundWin;
app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    backgroundColor: '#e0e0e0',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  backgroundWin = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile(path.join(__dirname, 'app/index.html'));

  backgroundWin.loadFile(path.join(__dirname, 'app/process.html'));

  win.webContents.openDevTools({ mode: 'detach' });
  backgroundWin.webContents.openDevTools({ mode: 'detach' });

  win.on('closed', () => {
    win = null;
    backgroundWin.destroy();
  });

  backgroundWin.on('closed', () => {
    backgroundWin = null;
  });

  ipcMain.on('start', () => {
    backgroundWin.webContents.send('start');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

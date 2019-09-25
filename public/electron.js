const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

require('electron-reload')(__dirname);

let mainWindow;
let backgroundWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    backgroundColor: '#e0e0e0',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  backgroundWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  backgroundWindow.loadFile(path.join(__dirname, '../src/background/process.html'));

  if (isDev) {
    // Open the DevTools.
    // BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    backgroundWindow.webContents.openDevTools({ mode: 'detach' });
  }
  mainWindow.on('closed', () => {
    mainWindow = null;
    backgroundWindow.destroy();
  });

  backgroundWindow.on('closed', () => {
    backgroundWindow = null;
  });

  ipcMain.on('start', () => {
    backgroundWindow.webContents.send('start');
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

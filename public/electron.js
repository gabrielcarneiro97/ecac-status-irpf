const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

require('electron-reload')(path.join(__dirname));

let mainWindow;
let backgroundWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 650,
    resizable: false,
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
  backgroundWindow.loadFile(path.join(__dirname, '/backend/process.html'));

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

  // reiniciar o processo!
  ipcMain.on('readData', () => backgroundWindow.webContents.send('readData'));
  ipcMain.on('dbData', (e, data) => mainWindow.webContents.send('dbData', data));

  ipcMain.on('saveData', (e, data) => backgroundWindow.webContents.send('saveData', data));
  ipcMain.on('saveEnd', () => mainWindow.webContents.send('saveEnd'));

  ipcMain.on('startCheck', (e, data) => backgroundWindow.webContents.send('startCheck', data));
  ipcMain.on('checkEnd', () => mainWindow.webContents.send('checkEnd'));

  ipcMain.on('pessoaEnd', (e, data) => mainWindow.webContents.send('pessoaEnd', data));

  ipcMain.on('accessTime', () => backgroundWindow.webContents.send('accessTime'));
  ipcMain.on('timeReturn', (e, data) => mainWindow.webContents.send('timeReturn', data));

  ipcMain.on('getConfig', () => backgroundWindow.webContents.send('getConfig'));
  ipcMain.on('configReturn', (e, data) => mainWindow.webContents.send('configReturn', data));
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

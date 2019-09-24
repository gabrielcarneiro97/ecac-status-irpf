const { ipcRenderer } = require('electron');

const btn = document.getElementById('start');

btn.onclick = () => {
  ipcRenderer.send('start');
};

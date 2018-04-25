const electron = require('electron')
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const fs = require('fs');
const path = require('path');
const isDev = require('electron-is-dev');
let config = require('./config');


let defaultURL = 'https://www.youtube.com/signin';

// TODO: Implement a full cli arg / deep link / protocol system
//       Might have to use browser extensions...
if (process.argv[2]) {
  console.log(process.argv[2]);
  defaultURL = process.argv[2];
}

let mainWindow;
let loadingWindow;
let settingsWindow;

function createLoadingWindow() {
  const lastWindowState = config.get('lastWindowState');
  let screenSize = electron.screen.getPrimaryDisplay().workAreaSize;

  loadingWindow = new BrowserWindow({
    x: lastWindowState.x + 300,
    y: lastWindowState.y + 100,
    width: 400,
    height: 400,
    show: true,
    frame: false,
    resizable: false,

  });

  loadingWindow.loadURL(path.join(__dirname, 'loading.html'));
  loadingWindow.show();

}

function createMainWindow() {
  const lastWindowState = config.get('lastWindowState');

  if (lastWindowState.x === 0) {
    let screenSize = electron.screen.getPrimaryDisplay().workAreaSize;
    lastWindowState.x = screenSize.width / 3;
    lastWindowState.y = screenSize.height / 3;
    lastWindowState.width = 750;
    lastWindowState.height = 650;
  }

  mainWindow = new BrowserWindow({
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    fullscreen: config.get('fullscreen'),
    show: false,
    frame: false,
    minWidth: 750,
    minHeight: 300,
    icon: process.platform === 'linux' && path.join(__dirname, 'static/Icon.png'),
    webPreferences: {preload: path.join(__dirname, 'renderer.js'), nodeIntegration: false, plugins: true},
    devTools: false,
  });


  mainWindow.loadURL(defaultURL);
  mainWindow.on('closed', function () {

    mainWindow = null
  });
  return mainWindow;
}


app.on('ready', () => {
  createLoadingWindow();
  const win = createMainWindow();
  const webContents = win.webContents;

  webContents.on('dom-ready', () => {
    webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));
    //setTimeout(() => win.show(), 1000)
    loadingWindow.hide();
    win.show();

    loadingWindow.close();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {

  if (mainWindow === null) {
    createWindow()
  }
});


ipcMain.on('toggle-settings-window', () => {
  if (settingsWindow && settingsWindow.isVisible()) {
    settingsWindow.hide();
    return;
  } else if (settingsWindow && !settingsWindow.isVisible()) {
    settingsWindow.setBounds(mainWindow.getBounds());
    settingsWindow.show();
    return;
  }

  let bounds = mainWindow.getBounds();

  settingsWindow = new BrowserWindow({
    parent: mainWindow,
    modal: false,
    show: false,
    frame: false,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  });


  settingsWindow.loadURL(path.join(__dirname, 'settings.html'));
  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show()
  })
});


ipcMain.on('close-window', () => {
  handleExit();
});

ipcMain.on('toggle-fullscreen', () => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

ipcMain.on('signout', () => {
  setTimeout(app.relaunch(), 1000);
});


function handleExit() {
  config.set('fullscreen', mainWindow.isFullScreen());

  if (!mainWindow.isFullScreen())
    config.set('lastWindowState', mainWindow.getBounds());

  mainWindow.close();
  app.quit();
}

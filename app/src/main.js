const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const path = require('path');

process.noDeprecation = false;
process.throwDeprecation = false;
process.traceDeprecation = true;
process.traceProcessWarnings = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const remote = require('@electron/remote/main');
remote.initialize();

// Resolve app icons.
// .icns   — used by BrowserWindow on macOS.
// .png    — required by app.dock.setIcon() and Linux BrowserWindow.
// .ico    — used by BrowserWindow on Windows.
const iconIcns = path.join(__dirname, '..', 'logo', 'logo.icns');
const iconPng  = path.join(__dirname, '..', 'logo', 'logo.png');
const iconIco  = path.join(__dirname, '..', 'logo', 'logo.ico');

// Enable @electron/remote for every WebContents that is created — including
// child BrowserWindows opened from the renderer via remote.BrowserWindow.
// This must be registered before any window is created so the event fires
// for the very first window too.
app.on('web-contents-created', (_event, webContents) => {
  remote.enable(webContents);
});

function createWindow () {
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    width: width,
    height: height,
    icon: process.platform === 'darwin' ? iconIcns : process.platform === 'win32' ? iconIco : iconPng,
    webPreferences: {
			//sandbox: true,
			nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  // and load the index.html of the app.
  win.loadFile('src/view/topoview.html');

  // Open the DevTools.
  //win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow);
app.whenReady().then(() => {
  // Set the macOS dock icon to the app icon (Electron shows its own icon
  // during development otherwise).
  if (process.platform === 'darwin' && app.dock) {
    app.dock.setIcon(iconPng);
  }
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});

// IPC: synchronous screen-size query (called via ipcRenderer.sendSync)
ipcMain.on('get-window-size', (event) => {
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
	event.returnValue = { width, height };
});

// IPC: synchronous parent-window query (called via ipcRenderer.sendSync)
ipcMain.on('get-parent', (event) => {
	event.returnValue = win;
});

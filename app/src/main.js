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

require('@electron/remote/main').initialize();

function createWindow () {
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
	console.log("Icon path:" + path.resolve(path.join(".","logo", "Icon.icns")));

  // Create the browser window.
  win = new BrowserWindow({
    width: width,
    height: height,
    icon: path.resolve(path.join(".","logo", "Icon.icns")),
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
app.whenReady().then(createWindow)

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

// Async return: event.sender.send(data)
// Synchronus return
ipcMain.handle('get-window-size', (event, arg)=>{
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
	event.returnValue= {'width':width, 'height':height};
});

ipcMain.handle('get-parent', (event, arg)=>{
	event.returnValue= win;
});

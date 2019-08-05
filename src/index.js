import {app, BrowserWindow, ipcMain} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import {enableLiveReload} from 'electron-compile';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
global.mainWindow = null;
const isDevMode = process
  .execPath
  .match(/[\\/]electron/);

if (isDevMode) 
  enableLiveReload({strategy: 'react-hmr'});

const createWindow = async() => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 663,
    height: 530,
    minHeight: 530,
    minWidth: 663,
    background: '#2DACAD',
    frame: false,
    center: true,
    backgroundThrottling: true,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow
      .webContents
      .once('dom-ready', () => {
        mainWindow.openDevTools()
      })
    //mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows in an array if
    // your app supports multi windows, this is the time when you should delete the
    // corresponding element.
    mainWindow = null;
  });

  mainWindow
    .webContents
    .on('dom-ready', () => {
      console.log('HOLA, DOM READY')
    })

  mainWindow
    .webContents
    .once('did-finish-load', () => {
      mainWindow.show()
      mainWindow.focus()
    })

};

// This method will be called when Electron has finished initialization and is
// ready to create browser windows. Some APIs can only be used after this event
// occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar to stay active until
  // the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the dock icon is
  // clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
app
  .commandLine
  .appendSwitch('--inspect-electron')

var initBoard = (arg) => {
  let win
  win = new BrowserWindow({
    resizable: true, width: 300, height: 220,
    frame: false,
    parent: mainWindow, 
    modal: false, 
    show: false,
    webPreferences: {
      nodeIntegration: true,
      additionalArguments: [JSON.stringify(arg)],
    }
  })

  if (isDevMode) {
    win
      .webContents
      .once('dom-ready', () => {
        win.openDevTools()
      })
    }

  win.loadURL(`file://${__dirname}/index2.html`)

  win.on('close', () => {
    mainWindow
      .webContents
      .send('status', false)
    
    mainWindow
      .webContents
      .send('isStarted', false)
    
    mainWindow
      .webContents
      .send('reload')
    
    ipcMain.removeAllListeners('statusBoard')
    ipcMain.removeAllListeners('data')
    ipcMain.removeAllListeners('close-board')
    
    win = null
  })

  
  /**
   * Gestion del estdo de la tarjeta
   */
  ipcMain.on('close-board', (event) => {
    console.log('close now')
    win.close()
  })
  ipcMain.on('statusBoard', (event, boardState) => {
    console.log("Estado de la tarjeta", boardState)
    mainWindow
      .webContents
      .send('status', boardState)
    mainWindow
      .webContents
      .send('isStarted', boardState)
  })

  ipcMain.on('data', (event, data) => {
    console.log(`Sensor ${data.sensorPin}: ${data.data}`)
    mainWindow
      .webContents
      .send(`sensor${data.sensorPin}`, data.data)
  })

};

/**
 * coneccion entre el main proccess y el renderer proccess
 * usando las ipc API's de electron
 */

ipcMain.on('init-board', (event, arg) => {
  console.log("received from front: ",{arg})
  initBoard(arg)
})


ipcMain.on('watch', (event, arg) => {
  console.log("llegue de watch")
  mainWindow
      .webContents
      .send('update')
})

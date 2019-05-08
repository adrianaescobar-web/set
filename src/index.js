import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import {
  enableLiveReload,
} from 'electron-compile';
import * as usb from 'usb';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const isDevMode = process.execPath.match(/[\\/]electron/);

if(isDevMode) enableLiveReload({
  strategy: 'react-hmr'
});

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    
    webPreferences: {
      titleBarStyle: 'hiddenInset',
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const five = require('johnny-five');

let globalBoard=null;
let boardState = false;

let cloneObject=(obj)=>{
  
  return Object.assign({}, obj);
};

var initBoard = () =>{
  console.log('Iniciando');
  globalBoard = new five.Board({repl: false});

  globalBoard.on('ready', ()=>{
    boardState = globalBoard.isReady;
    console.log("board is ready", globalBoard);
    console.log('board port 1:', globalBoard.port);
    mainWindow.webContents.send('status', boardState);
  });    
};

let restartConnection = (port)=>{
  console.log('Reiniciando');
  let portConnected = 'COM' + port;
  globalBoard = null;
  globalBoard = new five.Board({repl: false, port: portConnected });
  
  globalBoard.on('ready', ()=>{
    boardState = globalBoard.isReady;
    console.log("board is ready", globalBoard);
    console.log('board port 1:', globalBoard.port);
    mainWindow.webContents.send('status', boardState);
  });    
};

initBoard();

console.warn("board status", boardState);
//console.warn("board port 2", globalBoard.port);

usb.on('attach', function(device) {
  
  if (!boardState){
    restartConnection(device.portNumbers[0]);
  }
   
});

ipcMain.on('get-state', (event, arg)=>{
  event.returnValue = boardState;
});

/**
 * Gestion del puerto USB
 */

usb.on('detach', function(device) {
  const port = 'COM' + device.portNumbers[0];
  console.log('port off:', device.portNumbers[0]);
  console.log('board port:',globalBoard.port || undefined);
  if(port===globalBoard.port || globalBoard.port===undefined){
    globalBoard.emit('exit', () => {
      console.log('desconectado'); 
    });
    boardState = false;
    device.close();
    mainWindow.webContents.send('status', boardState);
  };
 });

/**
 * coneccion entre el main proccess y el renderer proccess
 * usando las ipc API's de electron
 */


ipcMain.on('restart-board', (event, arg) => {
  console.log("curren boarState on main", boardState);
  restartConnection();
});


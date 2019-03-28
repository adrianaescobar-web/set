import {
  app,
  BrowserWindow,
  ipcMain
} from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import {
  enableLiveReload
} from 'electron-compile';
import {
  Board,
  Led
} from 'johnny-five';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({
  strategy: 'react-hmr'
});

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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


let myBoard; // variable global que almacena una instancia de board
let led;

const loadBoard = (event) => {
  if (myBoard !== Board) {
    
    myBoard = new Board({ repl: false });
    if (!myBoard.isReady){
      console.log('no conectada');
      event.sender.send('init-reply', {
        message: false,
      });
    } else {
      console.log('Recien creada!');
      event.sender.send('init-reply', {
        message: true,
      });
    }
  } else {

    myBoard.on('exit',()=>{
      myBoard = null;
    });
    myBoard = new Board({ repl: false });
    if (!myBoard.isReady){
      console.log('no conectada');
      event.sender.send('init-reply', {
        message: false,
      });
    } else {
      console.log('Reinstanciada!');
      event.sender.send('init-reply', {
        message: true,
      });
    }
  }
}

const startBoard= (val)=>{
  console.log("desde funcion: ",val);
    console.log('is ready?:', myBoard.isReady);
      if(myBoard.isReady){
        led = new Led(13);
        led.blink(val);
        myBoard.loop(100, ()=>{
          console.log(val);
      });
    } 
  }

const updateBoard= (val)=>{
    console.log("updated to: ",val);
      console.log('is ready?:', myBoard.isReady)
      if(myBoard.isReady){
        led.blink(val);
        myBoard.loop(val, ()=>{
          console.log(val);
        });
      } 
}
  
/**
 * coneccion entre el main proccess y el renderer proccess
 * usando las ipc API's de electron
 */

ipcMain.on('init', (event, arg) => {
  loadBoard(event);
});

ipcMain.on('start', (event, arg) => {
  console.log(arg.value);
  startBoard(arg.value);
});

ipcMain.on('update', (event, arg) => {
  console.log(arg.value);
  updateBoard(arg.value);
  event.sender.send('update-reply', {
    message: 'updated',
  });
});

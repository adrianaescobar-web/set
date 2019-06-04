const path = require('path')
const five = require('johnny-five')
const {ipcRenderer} = require('electron')
import * as usb from 'usb'

console.log('Iniciando')
const globalBoard = new five.Board({repl: false})
let boardState = false
let portConnected = null

//console.log("argv:",process.argv)

/**
 * Gestion del puerto USB
 */


/* usb.on('detach', function (device) {
  const port = 'COM' + device.portNumbers[0]
  console.log('port off:', device.portNumbers[0])
  console.log('board port:', portConnected || undefined)
  if (port === portConnected || portConnected === undefined) {

    device.close()
    ipcRenderer.send('close')
  }
}) */

globalBoard.on('ready', ()=>{
    boardState = globalBoard.isReady;
    portConnected = globalBoard.port;
    console.log(globalBoard, portConnected);
    
    let sensors = new five.Sensors(
      [
      {
        pin: "0", 
        freq: 1000,
      },
      {
        pin: "1",
        freq: 1000,
      },
      {
        pin: "2",
        freq: 1000,
      },
      {
        pin: "3",
        freq: 1000,
        type: 'analog',
      },
      {
        pin: "4",
        freq: 1000,
        type: 'analog',
      },
      {
        pin: "5",
        freq: 1000,
        type: 'analog',
      },
      ]);
    
    sensors.map((sen,index) => {
      sen.on('data', (data)=>{
        console.log('sensor'+sen.pin, data);
        //mainWindow.webContents.send('sensor'+sen.pin, data);
        ipcRenderer.send('data', { sensorPin: sen.pin, data: data})
      });
      
    });
      
    ipcRenderer.send('statusBoard', boardState)
    

    globalBoard.on("exit", () => {
      console.log("Board exit");
      
      boardState = false;
      
      /* mainWindow.webContents.send('status', boardState); */
    });

    

  })
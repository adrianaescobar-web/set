const path = require('path')
const five = require('johnny-five')
const {ipcRenderer} = require('electron')
const fs = require('fs')
const os = require('os')

console.log('Iniciando')

const globalBoard = new five.Board({repl: false})
let boardState = false
let portConnected = null
let currentdate= new Date()
var datetime = currentdate.getDay() + "-"+currentdate.getMonth() 
+ "-" + currentdate.getFullYear() + "@" 
+ currentdate.getHours() + "-" 
+ currentdate.getMinutes() + "-" + currentdate.getSeconds();
const dirName = `LogSess-${datetime}`
//console.log("argv:",process.argv)

const folderDir = path.join(os.homedir(),'.iot-duino')
console.log({folderDir})
try {
  if (!fs.existsSync(folderDir)){
    fs.mkdirSync(folderDir)
  }
  if (!fs.existsSync(path.join(folderDir, dirName))){
    fs.mkdirSync(path.join(folderDir, dirName))
  }
} catch (err) {
  console.error(err)
}

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
        let obj = { sensorPin: parseInt(sen.pin), data, date: currentdate.toLocaleString('en-US',{
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
        insertInFile(obj)
        ipcRenderer.send('data', obj)
      });
      
    });
      
    ipcRenderer.send('statusBoard', boardState)
    

    globalBoard.on("exit", () => {
      console.log("Board exit");
      
      boardState = false;
      
      /* mainWindow.webContents.send('status', boardState); */
    });

    

  })

  

  let insertInFile = (data) => {
    // eslint-disable-next-line no-path-concat
    try {
      fs.appendFile(path.join(folderDir, `${dirName}/sensor${data.sensorPin}`), `${JSON.stringify(data)}\n`, (err)=>{
      if(err) throw err
      })
    } catch (error) {
      console.err({err})
    }
    
  }
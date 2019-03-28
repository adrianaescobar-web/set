import React from 'react';
import { ipcRenderer } from 'electron';
import Slider from '@material-ui/lab/Slider';
import { indigo } from '@material-ui/core/colors';
import { isNumber } from 'util';

export default class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      value: 20,
    };
  }

  initBoard() {
    ipcRenderer.send('init');
    let plays=document.querySelector('.play');
    ipcRenderer.on('init-reply', (event, arg) => {
      if(arg.message){
        plays.disable = false;
        console.log('Board conected');
      } else {
        plays.disable = true;
      }
    });
  }
  startBoard(){
    ipcRenderer.send('start', { value: 100 });
    ipcRenderer.on('start-reply', (event, arg) => {
      console.log(arg.message);
    });
  }

  handleChange(){
    let element=document.querySelector('#mls');
    let val = parseInt(element.value);
    if(isNaN(val)){
      element.style = 'border: solid 1px red';
    } else {
      element.style ='border: solid 1px white';
      console.log("Hollaa", val);
      ipcRenderer.send('update', { value: val });
      ipcRenderer.on('update-reply', (event, arg) => {
      console.log(arg.message);
    });
  }
}


  render() {
    const { value } = this.state;
    return (
    <div>
      <h2><button onClick={() => this.initBoard()}>Load!</button></h2>
      <h2><button onClick={() => this.startBoard()} className="play">Start Test</button></h2>
      <form action="">
        <input className="play" id="mls" onChange={() => this.handleChange()}  placeholder='milisecons' type="text"/>
      </form>
      <Slider
        value ={value}
        min={5}
        max={200}
        onChange = {() => console.log('Cambiè!')}
      />
      <p>Al presionar el boton el led empezara a parpadear a la velocidad indicada en
        el archivo app.jsx
      </p>
    </div>);
  }
}

import React from 'react';
import {ipcRenderer} from 'electron';



export default class App extends React.Component {

  initBoard(){
    ipcRenderer.send('start', { value: 15});
    ipcRenderer.on('start-reply', () =>{
      console.log(arg.message);
    });
  }

  render() {
    return (<div>
      <h2><button onClick={ () => this.initBoard()}>Start Test</button></h2>
      <p>Al presionar el boton el led empezara a parpadear a la velocidad indicada en
        el archivo app.jsx
      </p>
    </div>);
  }
}

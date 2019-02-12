import React from 'react';
import { ipcRenderer } from 'electron';

export default class App extends React.Component {

  constructor() {
    super();
    this.initBoard = this.initBoard.bind(this);
  }

  initBoard() {
    ipcRenderer.send('init');
    ipcRenderer.on('init-reply', (event, arg) => {
      console.log(arg.message);
    });
  }
  startBoard() {
    ipcRenderer.send('start', { value: 15 });
    ipcRenderer.on('start-reply', (event, arg) => {
      console.log(arg.message);
    });
  }

  render() {
    return (<div>
      <h2><button onClick={() => this.initBoard()}>Load!</button></h2>
      <h2><button onClick={() => this.startBoard()}>Start Test</button></h2>
      <p>Al presionar el boton el led empezara a parpadear a la velocidad indicada en
        el archivo app.jsx
      </p>
    </div>);
  }
}

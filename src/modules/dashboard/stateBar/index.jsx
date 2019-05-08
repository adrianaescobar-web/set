import React from 'react';
import { ipcRenderer } from 'electron';


ipcRenderer.setMaxListeners(0);

class StateBar extends React.Component {
  
  constructor() {
    super();
    this.state = {
      boardState: false,
    };
     
    this.getState = this.getState.bind(this);
  }

  getState(){
        this.setState({ boardState: ipcRenderer.sendSync('get-state')});
  };
  

  componentDidMount(){
    this.getState() ;
    ipcRenderer.on('status', ( event, state ) => {
      this.setState({ boardState: state });
    });
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('status');
  }
  
  render() {
    
    var styles = {
        padding: '0px',
        margin: '0px',
    };
    var styles1 = {
        padding: '0px',
        margin: '0px',
        width: '100%',
        height: '5px',
        backgroundColor: 'green',
      };
    var styles2 = {
        padding: '0px',
        margin: '0px',
        width: '100%',
        height: '5px',
        backgroundColor: 'red',
    };
    
    
    return (
      <div style={styles}>
         { this.state.boardState ? <div style={styles1} /> :<div style={styles2} />}
      </div>
    );
  }
}

export default StateBar;
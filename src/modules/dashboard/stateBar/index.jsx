import React from 'react';
import { ipcRenderer } from 'electron';

ipcRenderer.setMaxListeners(0);

class StateBar extends React.Component {

  constructor() {
    super();
    this.state = {
      boardState: false,
    }
  }

  componentDidMount() {
    ipcRenderer.on('status', (event, state) => {
      this.setState({ boardState: state });
    });
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners('status');
  }

  render() {
    const styles = {
      padding: '0px',
      margin: '0px',
    };
    const styles1 = {
      padding: '0px',
      margin: '0px',
      width: '100%',
      height: '5px',
      background: 'linear-gradient(to bottom, #73D393 30%, #226C3B 100%)',
    };
    const styles2 = {
      padding: '0px',
      margin: '0px',
      width: '100%',
      height: '5px',
      background: 'linear-gradient(to top, #ff0844 30%, #ffb199 100%)',
    };

    return (
      <div style={styles}>
        {this.state.boardState
          ? <div style={styles1} />
          : <div style={styles2} />}
      </div>
    );
  }
}

export default StateBar;

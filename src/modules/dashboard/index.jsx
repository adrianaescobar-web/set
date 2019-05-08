// @flow
import * as React from 'react';
import {Link} from 'react-router-dom';
import {withRouter } from 'react-router-dom';
import SocketContext from '../../socket-context';
import StateBar from './stateBar';
import {ipcRenderer} from 'electron';
type Props = { 
  
};
type State = {
  
};
class Dashboard extends React.Component<Props, State>{
  constructor(){
    super();
    console.log(this.RouterContext);
  }
  render() {
    const {history, socket}=this.props;

    return (
      
      <div>
        <StateBar/>
        <button onClick={()=>{
          history.push('/'); 
          socket.disconnect(true)}}>Logout</button>
        {/* <button onClick={()=>{
          ipcRenderer.send('restart-board')}}>Restart arduino</button> */}
          Dashboard
      </div>
    );
  };
};

const NestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  {socket => <Dashboard {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default withRouter(NestedComponentWithSocket);
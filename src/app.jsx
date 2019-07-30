import React from 'react';
import { Route, Switch, HashRouter} from "react-router-dom";
import { ipcRenderer } from 'electron';
import SocketContext from './socket-context';
import Login from './modules/login';
import Dashboard from './modules/dashboard';
import FileReader from './modules/fileReader';
import DirExplorer from './modules/dirExplorer';
import ErrorPage from './modules/error404';
import Nav from './modules/nav';
import openSocket from 'socket.io-client';
ipcRenderer.setMaxListeners(0);

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      value: 20,
      boardState: false,
    };
    
  }

 
  render() {
    const { history } = this.props;
    const socket = openSocket('https://peaceful-thicket-37969.herokuapp.com/');
    
    return (
      <React.Fragment>
        
        <SocketContext.Provider value={socket} >
          <Nav/>
          {/* <HashRouter basename="/" /> */}
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/explorer" component={DirExplorer} />
            <Route path="/readFile" component={FileReader} />
            <Route component={ErrorPage} />
          </Switch>
        </SocketContext.Provider>
      </React.Fragment>
      
    );
  }
}

export default App;
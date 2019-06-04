import React from 'react';
import { Route, Switch, HashRouter} from "react-router-dom";
import { ipcRenderer } from 'electron';
import SocketContext from './socket-context';
import Login from './modules/login';
import Dashboard from './modules/dashboard';
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
    ipcRenderer.send('init');
    console.log("context", this.context);
  }

 
  render() {
    const { history } = this.props;
    const socket = openSocket('http://localhost:3000');
    
    return (
      <React.Fragment>
        
        <SocketContext.Provider value={socket} >
          <Nav/>
          {/* <HashRouter basename="/" /> */}
          <Switch>
            <Route path="/" exact component={Login} />
            <Route to="/dashboard" component={Dashboard} />
            <Route component={ErrorPage} />
          </Switch>
        </SocketContext.Provider>
      </React.Fragment>
      
    );
  }
}

export default App;
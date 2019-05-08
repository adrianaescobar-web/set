import React from 'react';
import { Route, Switch} from "react-router-dom";
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

 

  initBoard(){
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

 
  render() {
    const { history } = this.props;
    const socket = openSocket('http://localhost:3000');
    
    return (
      <React.Fragment>
        
        <SocketContext.Provider value={socket} >
          <Nav/>
          
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
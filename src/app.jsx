import React, { Fragment } from 'react';
import { Route, Link, Switch, Redirect} from "react-router-dom";
import { ipcRenderer } from 'electron';

import Login from './modules/login';
import Dashboard from './modules/dashboard';
import ErrorPage from './modules/error404';
import Nav from './modules/nav';
ipcRenderer.setMaxListeners(0);



class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      value: 20,
    };
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
    const { history } = this.props;
    const { value } = this.state;
  

    return (
      <React.Fragment>
       
        <Nav/>
        
        <Switch>
          <Route path="/" exact component={Login} />
          <Route to="/dashboard" component={Dashboard} />
          <Route component={ErrorPage} />
        </Switch>
       
      </React.Fragment>
      
    );
  }
}

export default App;
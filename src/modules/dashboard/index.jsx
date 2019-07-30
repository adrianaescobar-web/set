// @flow
import * as React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import SocketContext from '../../socket-context';
import StateBar from './stateBar';
import {ipcRenderer} from 'electron';
import Pin from './boardPin';
import {Grid, Button, Divider} from '@material-ui/core';
import Chart from './chart';
import DashBoardContext from '../../dashboard-context';
import ListDirectories from './ListDirectories'
import { sizing } from '@material-ui/system';

class Dashboard extends React.Component <Props,State> {
  constructor() {
    super();
    console.log(this.RouterContext);
    this.state = {
      sensorsConfig: [],
      isStarted: false,
      buttonState: true
      }
    }
  

  componentDidMount() {
    ipcRenderer.on('isStarted', (event, state) => {
      this.setState({isStarted: state});
    });
    ipcRenderer.on('update', (event, state) => {
      if(this.state.sensorsConfig.length == 0){
        this.setState({ buttonState: true});
      }else{
        this.setState({ buttonState: false});
      }
    });
  }
  componentWillUnmount(){
    ipcRenderer.removeAllListeners('update');
    ipcRenderer.removeAllListeners('isStarted');
  }
  
  render() {
    const {history, socket} = this.props;
    const {sensorsConfig, isStarted, buttonState} = this.state;
    
    return (

      <DashBoardContext.Provider value={{sensorsConfig, buttonState, history}}>

        <Grid container spacing={8} >
          <Grid item xs={12}>
            <StateBar/>
          </Grid>


            <Grid item xs={6} >
        
                <Grid item xs={12}>
                  <h3>Analog pins</h3>
                </Grid>
                  <Grid container spacing={8} justify="space-around" >
                  
                  <Grid item xs={4}>
                    <Pin type="analog" id={0}/>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Pin type="analog" id={1}/>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Pin type="analog" id={2}/>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Pin type="analog" id={3}/>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Pin type="analog" id={4}/>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Pin type="analog" id={5}/>
                  </Grid>
                  </Grid>
            </Grid>
              
            
            <Grid item xs={6}>
              <Grid item xs={12}>
                <h3>Reports</h3>
              </Grid>
              <Grid item xs={12}>
                <ListDirectories/>
              </Grid>
            </Grid>

          
          <Divider /> 
          

            <Grid item xs={12} align='center'>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                disabled={buttonState}
                onClick={() => {
                ipcRenderer.send('init-board', sensorsConfig)
              }}>Start</Button>

              <Button
                color="primary"
                size="medium"
                onClick={() => {
                  history.push("/explorer?test")
              }}>read</Button>
            
          </Grid>

        </Grid>
        
        <Chart elementWidth={600} elementHeight={270}/> {/*  <AppBar position="fixed" color="primary" className={classes.appBar}/> */}
      </DashBoardContext.Provider>
    );
  };
};

const NestedComponentWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Dashboard {...props} socket={socket}/>}
  </SocketContext.Consumer>
)

export default withRouter(NestedComponentWithSocket);
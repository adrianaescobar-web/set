// @flow
import * as React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import SocketContext from '../../socket-context';
import StateBar from './stateBar';
import {ipcRenderer} from 'electron';
import Pin from './boardPin';
import {Grid, Button} from '@material-ui/core';
import Chart from './chart';
import DashBoardContext from '../../dashboard-context';


class Dashboard extends React.Component < Props,
State > {
  constructor() {
    super();
    console.log(this.RouterContext);
    this.state = {
      sensorsConfig : [],
      isStarted: false,
    }
  }

  componentDidMount(){
    ipcRenderer.on('isStarted', (event, state) => {
      this.setState({ isStarted: state });
    });
  }
  componentDidMount(){
    ipcRenderer.on('isStarted', (event, state) => {
      this.setState({ isStarted: state });
    });
  }
  render() {
    const {history, socket} = this.props;
    const {sensorsConfig, isStarted} = this.state;
    return (

      <DashBoardContext.Provider value = {sensorsConfig }>
      
      <Grid container>
      <Grid item xs={12}>
      <StateBar/>
      </Grid>
      
      <Grid container >
      <h3>Analog pins</h3>
      <Grid container spacing={8}>
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
      <Grid container spacing={8}>
        
        <Grid item xs={12} align='center'>
        <Button variant="contained" color="primary" size="medium" disabled={isStarted}onClick={() => {
        ipcRenderer.send('init-board')
        }}>Start</Button>
        </Grid>
        <Grid item xs={12}>
        <Button
        onClick={() => {
        history.push('/');
        socket.disconnect(true)
        }}>Logout </Button>
        </Grid>
      </Grid>

      </Grid>
      <Chart elementWidth={600} elementHeight={270}/>
     {/*  <AppBar position="fixed" color="primary" className={classes.appBar}/> */}
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
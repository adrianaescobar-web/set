// @flow
import * as React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import SocketContext from '../../socket-context';
import StateBar from './stateBar';
import {ipcRenderer} from 'electron';
import Pin from './boardPin';
import {Grid, Button, Divider, withStyles} from '@material-ui/core';
import Chart from './chart';
import DashBoardContext from '../../dashboard-context';
import ListDirectories from './ListDirectories'

const styles={
  dashboard:{
    backgroundColor: '#2DACAD',
    height: '90vh',
    fontFamily: 'Roboto',
  },
  section:{
    width: '50%',
    height: '100%',
    marginTop: '1%',
    marginRight: '0.5%',
    marginLeft: '1%',
  },
  sensors: {
    paddingBottom: '1%',
    height: '100%',
  },
  sensor:{
    margin: '0px 1%',
    width: '30%',
    height: '50%',
    display: 'inline-block',
    boxSizing: 'content-box',
    filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,.4))',
  },
  sensorSection:{
    display: 'flex',
    flexWrap: 'wrap',
    height: '73%',
    boxSizing:'content-box',
    alignContent:'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,226,225,.9)',
    padding: '2%',
    filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,.4))',
  },
  sectionContainer:{
    display:'flex',
    height: '100%',
    boxSizing:'content-box',
    padding: '2%',
    marginBottom: '2%',
  },
  title:{
    margin: '0px',
    color: 'white',
  },
  titleContainer:{
    height: '6%',
    backgroundColor: '#3265A0',
    filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,.4))',
  },
  buttonSection:{
    width: '100%',
    height: '15%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
button:{
    height: '60%',
    background: 'linear-gradient(to top, rgba(53,45,173,.8) 30%, rgba(48,75,184,.8) 100%)',
    filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,.4))',
    '&:disabled':{
      background: 'linear-gradient(to top, rgba(22,107,211,.5) 30%, rgba(30,67,254,.5) 100%)',
     
    }
  },
  button2:{
    height: '60%',
    background: 'linear-gradient(to top, rgba(237,107,141,.8) 30%, rgba(233,67,108,.8) 100%)',
    filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,.4))',
    '&:disabled':{
      background: 'linear-gradient(to top, rgba(237,107,141,.5) 30%, rgba(233,67,108,.5) 100%)',
    }
  },
  listContainer:{
    height: '85%',
    backgroundColor: 'rgba(254,250,197,.7)',
    paddingBottom: '2%',
    paddingTop: '2%',
    filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,.4))',
  },
  list:{
    height: '100%',
    overflowY: 'scroll',
  }
}

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
    const {history, socket, classes} = this.props;
    const {sensorsConfig, isStarted, buttonState} = this.state;
    
    return (

      <DashBoardContext.Provider value={{sensorsConfig, buttonState, history}}>

        <div className={classes.dashboard}>
          <div>
           <StateBar/>
          </div>
          <div className={classes.sectionContainer}>
            <div className={classes.section}>
            
        
                <div className={classes.titleContainer}>
                  <h3 className={classes.title}>Analog pins</h3>
                </div>
                  
                <div className={classes.sensors}>
                  
                  <div className={classes.sensorSection}><div className={classes.sensor}>
                  <Pin type="analog" id={0}/>
                  </div>
                  <div className={classes.sensor}>
                  <Pin type="analog" id={1}/>
                  </div>
                  <div className={classes.sensor}>
                  <Pin type="analog" id={2}/>
                  </div>
                  <div className={classes.sensor}>
                  <Pin type="analog" id={3}/>
                  </div>
                  <div className={classes.sensor}>
                  <Pin type="analog" id={4}/>
                  </div>
                  <div className={classes.sensor}>
                  <Pin type="analog" id={5}/>
                  </div></div>
                  <div className={classes.buttonSection}>
                <Button
                  variant="contained"
                  className={classes.button}
                  color="primary"
                  size="medium"
                  disabled={(buttonState)||(isStarted)}
                  onClick={() => {
                  ipcRenderer.send('init-board', sensorsConfig)
                }}>Start</Button>

                <Button
                  color="primary"
                  size="medium"
                  className={classes.button2}
                  disabled={!isStarted}
                  onClick={() => {
                    ipcRenderer.send('close-board')
                }}>Stop</Button>
              
              </div>
                </div>
                
              </div>  
            <div className={classes.section}>
              
              
              <div className={classes.titleContainer}>
                <h3 className={classes.title}>Reports</h3>
              </div>
              <div className={classes.listContainer}>
              <div className={classes.list}>
              <ListDirectories/>
              </div></div>
            </div>
              
            </div>
        </div>

      </DashBoardContext.Provider>
    );
  };
};

const NestedComponentWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Dashboard {...props} socket={socket}/>}
  </SocketContext.Consumer>
)

export default withRouter(withStyles(styles)(NestedComponentWithSocket));
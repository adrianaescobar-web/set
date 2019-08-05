import React, {Component} from 'react';
import {
  withStyles,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import {Slider} from '@material-ui/lab';
import {ipcRenderer} from 'electron';
import DashBoardContext from '../../../dashboard-context';
const styles = {
  card: {
    margin: '1% 0',
    height: '97%',
    boxSizing: 'content-box',
    textAlign: 'center',
  },
  root: {
    padding: 0,
    margin: 0
  },
  extra: {
    padding: 0,
    margin: 0,
    background: 'linear-gradient(45deg, #29A0B1 30%, #98D7C2 90%)',
    color: 'white',
    fontSize: 14
  },
  button: {
    height: 5,
    padding: 0,
    width: '20%'
  },
  slide: {
    padding: 10,
    fontSize: 8
  },
  paperVal: {
    marginTop: 8,
    marginLeft: 5,
    marginRight: 5,
    height: '50%',
    width: '80%',
    background: 'linear-gradient(to right top, #f6f6f6, #f5f8fb, #f0fcfd, #f0fff8, #fafff0)'
  },
  headerSensor:{
    display: 'flex',
    justifyContent:'space-around',
    alignItems: 'center',
    height: '20%',
    background: 'linear-gradient(15deg, #3093B8 20%, #2DACAD 100%)',
  },
  freqContainer:{
    display: 'flex',
    justifyContent:'space-around',
    flexDirection: 'column',
    alignItems: 'center',
    height: '25%',
    fontSize: '.7em',
  },
  valContainer: {
    display: 'flex',
    justifyContent:'space-around',
    alignItems: 'center',
    height: '30%',
  },
  switchContainer: {
    height: '20%',
  },
  switch:{

  },
};

class BoardPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      status: false,
      value: null,
      boardState: false,
      sensorConfig: {
        freq: 2000
      },
      buttonState: this.props.buttonState
    };

    this.onClick = this
      .onClick
      .bind(this);
    this.handleFreqChange = this
      .handleFreqChange
      .bind(this);
    this.removeElement = this
      .removeElement
      .bind(this);
  }

  removeElement(arry, index) {
    let newArry = [...arry]
    newArry.splice(index, 1)
    return newArry
  }

  onClick(event) {
    event.preventDefault();
    let {id, sensorConfig, buttonState} = this.props
    let {status} = this.state
    if (!status) {
      sensorConfig.push({pin: id, freq: this.state.sensorConfig.freq})
      this.setState({
        status: !status
      });
    } else {
      sensorConfig
        .filter(function (value, index) {
          if (value.pin === id) {
            sensorConfig.splice(index, 1)
          }

        })
      this.setState({
        status: !status
      });
    }
    ipcRenderer.send('watch');

  }

  handleFreqChange(event, value) {
    this.setState({
      sensorConfig: {
        freq: value
      }
    });
  }

  componentDidMount() {
    ipcRenderer.on('status', (event, state) => {
      this.setState({boardState: state});
    });
    ipcRenderer.on(`sensor${this.props.id}`, (event, dat) => {
      this.setState({value: dat});
    });
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners(`sensor${this.props.id}`);
    ipcRenderer.removeAllListeners('status');
  }

  render() {
    const {classes, sensorsConfig, buttonState} = this.props;
    const {status, type, boardState} = this.state;
    const {freq} = this.state.sensorConfig;
    console.log("props", this.props)
    return (
          <Card className={classes.card}>

                  <div className={classes.headerSensor}>{type === 'analog'
                  ? 'A' + (this.props.id)
                  : 'D' + (this.props.id - 5)}
                  </div>
                    <div className={classes.freqContainer}>freq: {freq} ms
                    {boardState
                    ? null
                    : <Slider
                    value={freq}
                    min={500}
                    aria-labelledby="labelSlide"
                    max={5000}
                    step={500}
                    onChange={this.handleFreqChange}
                    disabled={status}/>}</div>
                  
                  <div className={classes.valContainer}><Paper className={classes.paperVal}>
                  {(boardState && status)
                  ? this.state.value
                  : null}
                  
                  </Paper></div>
               
                  <div className={classes.switchContainer}><Switch className={classes.switch} checked={status}
                  onChange={this.onClick}
                  color="primary"
                  disabled={boardState}
                  /></div>
          </Card>

    );
  }
}

const NestedComponentWithDashboard = props => (
  <DashBoardContext.Consumer>
    {value => <BoardPin {...props} sensorConfig={value.sensorsConfig} buttonState={value.buttonState} />}
  </DashBoardContext.Consumer>
)

export default withStyles(styles)(NestedComponentWithDashboard);

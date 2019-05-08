import React from 'react';
import {withRouter} from 'react-router-dom';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import SocketContext from '../../socket-context';


const styles = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
    padding: {
        padding: theme.spacing.unit*10,
    },
    button: {
        backgroundColor: '#047a9e',
        color: 'White',
        border: 0,
    }
});

class Login extends React.Component {
  constructor(){
    super();
    this.state = {
      user: '',
      pass: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChanges = this.handleChanges.bind(this);   

  }
  
  handleChanges(event) {
    event.preventDefault();
    let id=event.target.id;
    let value=event.target.value;
    switch (id) {
        case 'username':
            this.setState({user: value });
            break;
        
        case 'password':
            this.setState({pass: value });
            break;
    
        default:
            console.err('no hay un a menejador de evento definido');
            break;
    }
    
  }

  handleSubmit(event) {
    const { socket, history, location} = this.props;
    event.preventDefault();
    socket.connect();
    
    let {user, pass} = this.state;
    var data = {user, pass}
    
    socket.emit('authentication', {username: user, password: pass });
    socket.on('authenticated', function() {
        // use the socket as usual
        
        history.push('/dashboard');
    });

    socket.on('unauthorized', function(err){
        console.log("There was an error with the authentication:", err.message);
      });
  }

/**
 * Component lifecycle 
 */

  componentDidMount() {
    
 }

  render() {
    const { classes, history, socket } = this.props;
    return (
        <Paper className={classes.padding}> 
            <div className={classes.margin}>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Face />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="username" label="Username" type="email" fullWidth autoFocus required onChange={this.handleChanges}/>
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Fingerprint />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="password" label="Password" type="password" fullWidth required onChange={this.handleChanges}/>
                    </Grid>
                </Grid>
                
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Button className={classes.button}  variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={this.handleSubmit}>Login</Button>
                    <Button className={classes.button}  variant="outlined" color="primary" style={{ textTransform: "none" }} onClick={()=>{history.push('/Dashboard')}}>Pass</Button>
                </Grid>
            </div>
        </Paper>
    );
}
}

const NestedLoginWithSocket = props => (
    <SocketContext.Consumer>
    {socket => <Login {...props} socket={socket} />}
    </SocketContext.Consumer>
  )

export default withStyles(styles)(withRouter(NestedLoginWithSocket));
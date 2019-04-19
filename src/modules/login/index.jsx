import React from 'react';
import {withRouter} from 'react-router-dom';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import openSocket from 'socket.io-client';



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
    this.state={
        user: '',
        pass: '',
        isLoged: true,
        urlSocket: 'http://localhost:3000',
        socket: null,
    }
    
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
    event.preventDefault();
    let {socket}=this.state;
    const {history}=this.props;
    
    let {user, pass} = this.state;
    var data = {user, pass}
    console.log("objeto a enviar",data);
    
    socket.on('messages', function(res) {
        console.log( res )
      })
    socket.emit('nuevo-mensaje', data);
       
  }
/**
 * Componen ifecycle 
 */

 componentDidMount(){
    this.state.socket = openSocket.connect(this.state.urlSocket);
 }

render() {
    const { classes, history } = this.props;
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
                </Grid>
            </div>
        </Paper>
    );
}
}

export default withStyles(styles)(withRouter(Login));
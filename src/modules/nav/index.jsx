import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {MenuIcon} from '@material-ui/icons/Menu';
import {ArrowBack} from '@material-ui/icons/';
import {withRouter } from 'react-router-dom';
import SocketContext from '../../socket-context';

const styles = {
  root: {
    flexGrow: 1,
    background: 'linear-gradient(15deg, #352DAD 0%, #3093B8 100%)',
    height: '10%',
    fontFamily: 'Roboto',
    fontSize: '1.5em',
    justifyContent: 'center',
  },
  grow: {
    flexGrow: 1,
    fontSize: '1em',
    height: '10%',
  },
  menuButton: {
    background: 'rgba(10,0,20,.2)'
  },
};

function Nav(props) {
  const { classes, history, socket } = props;
   
   return (
     <AppBar position="static" className={classes.root}>
        <Toolbar >
          
          <Typography variant="h6" color="inherit" className={classes.grow} align="center">
            IoT Plattform
          </Typography>
          {socket.connected && <IconButton className={classes.menuButton} color="inherit" edge="end" aria-label="Menu" onClick={() => {
                history.push('/');
                socket.disconnect(true)
              }}>
          <ArrowBack/>
          </IconButton>}
        </Toolbar>
      </AppBar>
  )
}

Nav.propTypes = {
    classes: PropTypes.object.isRequired,
};

const NestedLoginWithSocket = props => (
  <SocketContext.Consumer>
  {socket => <Nav {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default withStyles(styles)(withRouter(NestedLoginWithSocket));
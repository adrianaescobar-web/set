import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {ExitToApp} from '@material-ui/icons/Menu';
import {withRouter } from 'react-router-dom';
import SocketContext from '../../socket-context';

const styles = {
  root: {
    flexGrow: 1,
    background: 'linear-gradient(15deg, #13547a 0%, #80d0c7 100%)',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    
    marginLeft: -12,
    marginRight: 20,
  },
};

function Nav(props) {
  const { classes, history, socket } = props;
   
   return (
    <div>
     <AppBar position="static" >
        <Toolbar className={classes.root}>
          
          <Typography variant="h6" color="inherit" className={classes.grow} align="center">
            IoT Plattform
          </Typography>
          {true && <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          {/* <ExitToApp/> */}
          </IconButton>}
        </Toolbar>
      </AppBar>
    </div>
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
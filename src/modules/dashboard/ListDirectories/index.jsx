import React, {Component} from 'react';
import DashBoardContext from '../../../dashboard-context';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  withStyles
} from '@material-ui/core/';
import FolderIcon from '@material-ui/icons/Folder';
import {ipcRenderer} from 'electron'

const os = require('os');
const fs = require('fs');
const path = require('path');


//let contentFolder = [1,2,3,4,5];

const styles = {

  element: {
    background: '#f1f1f1',
    '&:hover': {
      background: '#0F0'
    }
  },

  root: {
    background: 'linear-gradient(45deg, #DEA 30%, #AED 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px #AED',
    color: 'white',
    height: 240,
    padding: '10px',
    overflowY: 'scroll'
  }
};

class ListDirectories extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folderList: null
    }

  }

  loadFolders() {
    const folderDir = path.join(os.homedir(), '.iot-duino');

    let contentFolder = fs.readdirSync(folderDir, (err, files) => {
      console.log("contemnndio", {files})

    });
    let folders = contentFolder.map((val, ind) => {
      return (
        <ListItem
          className={this.props.classes.element}
          key={val.toString()}
          onClick={(event) => (
            this.props.history.push('/explorer?'+event.currentTarget.querySelector('span').textContent)
            )}>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={val} secondary="Jan 7, 2014"/>
        </ListItem>
      )

    })
    return folders
  }
  componentDidMount() {
    ipcRenderer.on('reload', () => {
      let aux=this.loadFolders()
      console.log('Reloaded', aux)
      this.setState({
        folderList: aux
      })
    })

    this.setState({
      folderList: this.loadFolders()
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('reload');
  }

  render() {
    let folderList = this.state.folderList
    return (
      <List className={this.props.classes.root}>
        {folderList}
      </List>
    )
  }
}

const NestedComponentWithDashboard = props => (
  <DashBoardContext.Consumer>
    {value => <ListDirectories {...props} history={value.history} />}
  </DashBoardContext.Consumer>
)
NestedComponentWithDashboard()
export default withStyles(styles)(NestedComponentWithDashboard)
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
      background: 'linear-gradient(15deg, #3093B8 20%, #2DACAD 100%)',
      filter: 'alpha(opacity=50)',
    }
  },

  root: {
    border: 0,
    borderRadius: 3,
    color: 'white',
    margin: '2%',
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
    try {
      if (!fs.existsSync(folderDir)){
        fs.mkdirSync(folderDir)
        
      }
    } catch (err) {
      console.error(err)
    }

    let contentFolder = fs.readdirSync(folderDir, (err, data) => {
      if (err) throw err
      return data
    });
    let folders=[]
    
    if(contentFolder!=undefined){
    folders = contentFolder.map((val, ind) => {
      let options = { year: 'numeric', month: 'numeric', day: 'numeric', timeZoneName: 'short' }
      let dirStats=fs.statSync(path.join(folderDir, val))
      let dirCreationDate= new Date(dirStats.birthtime).toLocaleTimeString('en-US', options)
      
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
          <ListItemText primary={val} secondary={dirCreationDate}/>
        </ListItem>
      )

    })}
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
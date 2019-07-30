import React, {Component} from 'react';
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

const styles = {

    element: {
      background: '#f1f1f1',
      '&:hover': {
        background: 'rgba(54, 179, 176,.5)'
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

class DirExplorer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: null
    }

  }
  componentDidMount() {
    const folderDir = path.join(os.homedir(), '.iot-duino')
    const nameFolder = this.props.location.search
    const documentos = path.join(folderDir, nameFolder.slice(1, nameFolder.length))
    /* console.log('direccion:', documentos) */
    const contentFolder = fs.readdirSync(documentos, (err, files) => {
      return null
    })

    let files = contentFolder.map((val, ind) => {
      console.log("props", this.props.classes)
      return (
        <ListItem
          className={this.props.classes.element}
          key={val.toString()}
          onClick={(event) => (
              this.props.history.push('/readFile'+nameFolder+'/'+event.currentTarget.querySelector('span').textContent))}>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={val} secondary="Jan 7, 2014"/>
        </ListItem>
      )

    })
    this.setState({fileList: files})
  }

  render() {
    const {history} = this.props
    let folderList = this.state.fileList
    return (
      <div>
        <List className={this.props.classes.root}>
          {this.state.fileList}
        </List>
        <button onClick={() => {
          history.goBack()
        }}>
          back
        </button>
      </div>

    );

  }
}

export default withStyles(styles)(DirExplorer)
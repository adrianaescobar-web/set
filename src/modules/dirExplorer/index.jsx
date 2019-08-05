import React, {Component} from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  withStyles,
  Button
} from '@material-ui/core/';
import FileIcon from '@material-ui/icons/insertDriveFile';
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
      height: '78vh',
      padding: '10px',
      overflowY: 'scroll'
    },
    button:{
      background: 'linear-gradient(to top, rgba(53,45,173,.8) 30%, rgba(48,75,184,.8) 100%)',
      '&:hover':{
        background: 'linear-gradient(to top, rgba(53,45,173,.6) 30%, rgba(48,75,184,.6) 100%)',
      }
    },
    buttonContainer:{
      display: 'flex',
      justifyContent: 'center',
      margin: '1%',
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
      let options = { year: 'numeric', month: 'numeric', day: 'numeric', timeZoneName: 'short' }
      let dirStats=fs.statSync(path.join(documentos, val))
      let fileCreationDate= new Date(dirStats.birthtime).toLocaleTimeString('en-US', options)
  

      return (
        <ListItem
          className={this.props.classes.element}
          key={val.toString()}
          onClick={(event) => (
              this.props.history.push('/readFile'+nameFolder+'/'+event.currentTarget.querySelector('span').textContent))}>
          <ListItemAvatar>
            <Avatar>
              <FileIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={val} secondary={fileCreationDate}/>
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
        <div className={this.props.classes.buttonContainer}>
        <Button className={this.props.classes.button} onClick={() => {
          history.goBack()
        }}>
          back to dashboard
        </Button>
        </div>
      </div>

    );

  }
}

export default withStyles(styles)(DirExplorer)
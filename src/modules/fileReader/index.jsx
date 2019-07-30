import React from "react";
import {withStyles} from '@material-ui/core/';

const os = require('os');
const path = require('path');
/*
	Read a text file and out put the content.
	
	Example Usage:
	var myTxt = require("./myTxt.txt");
	...
	<TextFileReader
		txt={myTxt}
	/>
 */

const styles = {

	element: {
	  background: '#f1f1f1',
	  '&:hover': {
		background: '#0F0'
	  }
	},
  
	root: {
	  background: '#d5e8eb',
	  border: 0,
	  color: '#295961',
	  height: '350px',
	  padding: '10px',
	  overflowY: 'scroll'
	}
  };

class FileReader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: ""
		};
	}

	componentDidMount() {
		const folderDir = path.join(os.homedir(), '.iot-duino');
		let pathFile = this.props.location.search
		console.log(path.join(folderDir,pathFile.slice(1,pathFile.length)))
		this.readTextFile(path.join(folderDir,pathFile.slice(1,pathFile.length)));
	}

	readTextFile (file) {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status == 0) {
					var allText = rawFile.responseText;
					this.setState({
						text: allText
					});
				}
			}
		};
		rawFile.send(null);
	};

	render() {
		const classes = this.props.classes
		return (
			<div>
				<div className={classes.root}>
					{this.state.text.split("\n").map((item, key) => {
						return <span key={key}>{item}<br /></span>;
					})}
				</div>
				<div>
					<button onClick={
						()=>(this.props.history.goBack())
					}>Back</button>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(FileReader);
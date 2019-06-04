import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Chart} from 'chart.js';
import {Bar} from 'react-chartjs-2';
class index extends Component {
  constructor(props) {
    super(props);
    
  }


componentWillMount() {}

componentDidMount() {
 /*  var ctx = document.getElementById('myChart')
  let data = [
    {
      x: new Date(),
      y: 1
    }, {
      t: new Date(),
      y: 10
    }
  ]
  var chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      scales: {
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'minute'
            }
          }
        ]
      }
    }
  }); */
}

render() {
    

    return (
      <div />
    );
}
}

index.propTypes = {};

export default index;
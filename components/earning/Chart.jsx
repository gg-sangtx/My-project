import React, { Component } from 'react';
import {LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip,  ResponsiveContainer} from 'recharts';
import {getPrice} from 'constants/money';

const CustomTooltip  = React.createClass({
  formatValue(value) {

  },

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <div className="custom-tooltip">
          <p>{label}</p>
          {
            payload.map(item=> {
              return(
                  <p style={{color: item.stroke}}>{`${item.name} : ¥${item.value ? getPrice(item.value) : 0}`}</p>
                )
            })
          }
        </div>
      );
    }

    return null;
  }
});

class Chart extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: this.props.data,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.data != nextProps.data) {
      this.state.data = nextProps.data;
      this.setState({...this.state});
    }
  }


  render() {
    return (
      <div className="wrap-chart">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={this.state.data}>
              <XAxis dataKey="name"/>
              <YAxis allowDecimals={false}/>
              <Legend/>
              <Tooltip content={<CustomTooltip/>}/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Line dataKey='合計金額' stroke='#6A5ACD' barSize={20}/>
              <Line dataKey='予約金額' stroke='#cc0000' barSize={20}/>
              <Line dataKey='物販商品金額' stroke='#3d85c6' barSize={20}/>
           </LineChart>
          </ResponsiveContainer>
      </div>
    );
  }
}



Chart.defaultProps = {
  data: []
}

export default Chart;

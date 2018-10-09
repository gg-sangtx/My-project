import React from 'react';
import DatetimeRangePicker from './DatetimeRangePicker.jsx';
import moment from 'moment';
import {msg} from 'constants/message';
import {DateFormat, TimeFormat, DateTimeFormat} from 'constants/datetime';
import {ShowIf, validatable} from 'components/utils';


class ReactDateTimeRangePicker extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: '',
      startDate: this.props.startDate ? new Date(this.props.startDate) : '',
      endDate: this.props.endDate ? new Date(this.props.endDate) : ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.update == true || this.props.alwayUpdate == true) {
      this.state.startDate = new Date(nextProps.startDate);
      this.state.endDate = new Date(nextProps.endDate);
      this.setState({...this.state});
    }
  }

  onChange(name, e) {
    this.state[name] = e;
    this.setState({...this.state})
    if(name == 'startDate') {
      this.props.onChangeStartDay(e)
    }
    if(name == 'endDate') {
      this.props.onChangeEndDay(e)
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <DatetimeRangePicker
          className='date-time-range-picker calendar_icon'
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          dateFormat={this.props.dateFormat}
          timeFormat={this.props.timeFormat}
          onStartDateChange = {this.onChange.bind(this, 'startDate')}
          onEndDateChange = {this.onChange.bind(this, 'endDate')}
          closeOnSelect={true}
        />
      </div>
    )
  }
}

ReactDateTimeRangePicker.defaultProps = {
  dateFormat: DateFormat,
  timeFormat: TimeFormat,
  require: false,
  alwayUpdate: false,
  onChangeStartDay: function() {},
  onChangeEndDay: function() {},
}
export default ReactDateTimeRangePicker;

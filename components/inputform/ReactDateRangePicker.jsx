import React from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme';
import moment from 'moment';
import omit from 'lodash/omit';
import {msg} from 'constants/message';
import {DateFormat} from 'constants/datetime';
import {ShowIf, validatable} from 'components/utils';

ThemedStyleSheet.registerInterface(aphroditeInterface);
ThemedStyleSheet.registerTheme(DefaultTheme);

class ReactDateRangePicker extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      startDate: this.props.startDate ? moment(this.props.startDate) : null,
      endDate: this.props.endDate ? moment(this.props.endDate) : null
    }
  }

  componentDidMount() {
    let startDate = document.getElementById('your_unique_start_date_id');
    startDate.readOnly = true;
    let endDate = document.getElementById('your_unique_end_date_id');
    endDate.readOnly = true;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.update == true) {
      if(nextProps.startDate != this.props.startDate) {
        this.state.startDate = moment(nextProps.startDate);
        this.setState({...this.state});
      }
      if(nextProps.endDate != this.props.endDate) {
        this.state.endDate = moment(nextProps.endDate);
        this.setState({...this.state});
      }
    }
    if(nextProps.type_view != this.props.type_view && nextProps.type_view == 'DAILY' && !nextProps.initData) {
      if(nextProps.startDate && nextProps.endDate && (new Date(moment(nextProps.startDate).add(1, 'months')).getTime() < new Date(moment(nextProps.endDate)).getTime())) {
        this.state.endDate = moment(nextProps.startDate).add(1, 'months');
        this.setState({...this.state});
        this.props.onChangeEndDay(moment(nextProps.startDate).add(1, 'months'));
      }
    }
  }

  onChange(startDate, endDate) {
    this.setState({startDate, endDate})
    if(startDate) {
      this.props.onChangeStartDay(startDate)
    }
    if(endDate) {
      this.props.onChangeEndDay(endDate)
    }
  }

  isOutsideRange(day) {
    if(this.props.type_view == 'MONTHLY') {
      if (this.state.focusedInput === 'endDate') {
        if (this.state.startDate) {
          return moment(day).isAfter(this.state.startDate.clone().add(1, 'years')) || moment(day).isBefore(this.state.startDate);
        } else {
          return moment().isAfter(moment()) || moment().isBefore(moment())
        }
      } else {
        if (this.state.endDate) {
          return moment(day).isBefore(this.state.endDate.clone().add(-1, 'years')) || moment(day).isAfter(this.state.endDate);
        } else {
          return moment().isAfter(moment()) || moment().isBefore(moment())
        }
      }
    } else {
      if (this.state.focusedInput === 'endDate') {
        if (this.state.startDate) {
          return moment(day).isAfter(this.state.startDate.clone().add(1, 'months')) || moment(day).isBefore(this.state.startDate);
        } else {
          return moment().isAfter(moment()) || moment().isBefore(moment())
        }
      } else {
        if (this.state.endDate) {
          return moment(day).isBefore(this.state.endDate.clone().add(-1, 'months')) || moment(day).isAfter(this.state.endDate);
        } else {
          return moment().isAfter(moment()) || moment().isBefore(moment())
        }
      }
    }
  }

  onFocusChange(e) {
    this.state.focusedInput = e;
    this.setState({...this.state});
  }

  clearStart() {
    this.state.startDate = null;
    this.setState({...this.state});
    this.props.onChangeStartDay(null)
  }

  clearEnd() {
    this.state.endDate = null;
    this.setState({...this.state});
    this.props.onChangeEndDay(null)
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
        <div className='wrap-date-range-picker'>
          <ShowIf condition={this.state.startDate != null}>
            <span className='clear-start' onClick={this.clearStart.bind(this)}>×</span>
          </ShowIf>
          <ShowIf condition={this.state.endDate != null}>
            <span className='clear-end' onClick={this.clearEnd.bind(this)}>×</span>
          </ShowIf>
          <DateRangePicker
            startDate={this.state.startDate}
            startDateId="your_unique_start_date_id"
            endDateId="your_unique_end_date_id"
            startDatePlaceholderText={msg.startDatePlaceholderText}
            endDatePlaceholderText={msg.endDatePlaceholderText}
            endDate={this.state.endDate}
            monthFormat={this.props.monthFormat}
            displayFormat={this.props.displayFormat}
            isOutsideRange={this.isOutsideRange.bind(this)}
            onDatesChange={({ startDate, endDate }) => this.onChange(startDate, endDate)}
            focusedInput={this.state.focusedInput}
            onFocusChange={this.onFocusChange.bind(this)}
          />
        </div>
      </div>
    )
  }
}

ReactDateRangePicker.defaultProps = {
  require: false,
  monthFormat: DateFormat,
  displayFormat: DateFormat,
  initData: false,
  onChangeStartDay: function() {},
  onChangeEndDay: function() {},
}
export default ReactDateRangePicker;

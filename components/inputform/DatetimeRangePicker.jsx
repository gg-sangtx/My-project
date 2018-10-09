import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';
import {ShowIf} from 'components/utils';
import {msg} from "constants/message";

class DatetimeRangePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start: moment(props.startDate) || moment(),
      end: moment(props.endDate) || moment(),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.start = moment(nextProps.startDate)
    this.state.end = moment(nextProps.endDate)
    this.setState({...this.state})
  }

  getInputProps(type) {
    const inputReadOnlyStyle = {
      cursor: 'pointer',
      backgroundColor: 'white',
    };

    return this.props.input
      ? this.props.inputProps
      : {
        input: true,
        inputProps: {
          ...this.props.inputProps,     // merge inputProps with default
          readOnly: true,
          style: inputReadOnlyStyle,
          placeholder: type == 'start' ? msg.startDatePlaceholderText : msg.endDatePlaceholderText
        },
      };
  }

  propsToPass() {
    return {
      end: this.state.end.toDate(),
      start: this.state.start.toDate(),
    };
  }

  calcBaseProps() {
    return {
      utc: this.props.utc,
      locale: this.props.locale,
      input: !this.props.inline,
      viewMode: this.props.viewMode,
      dateFormat: this.props.dateFormat,
      timeFormat: this.props.timeFormat,
      closeOnTab: this.props.closeOnTab,
      className: this.props.pickerClassName,
      closeOnSelect: this.props.closeOnSelect,
    };
  }


  calcStartTimeProps() {
    const baseProps = this.calcBaseProps();
    const inputProps = this.getInputProps('start');

    return {
      ...baseProps,
      ...inputProps,
      defaultValue: this.props.startDate,
      onBlur: this.props.onStartDateBlur,
      onFocus: this.props.onStartDateFocus,
      timeConstraints: this.props.startTimeConstraints,
    };
  }

  calcEndTimeProps() {
    const baseProps = this.calcBaseProps();
    const inputProps = this.getInputProps('end');

    return {
      ...baseProps,
      ...inputProps,
      onBlur: this.props.onEndDateBlur,
      defaultValue: this.props.endDate,
      onFocus: this.props.onEndDateFocus,
      timeConstraints: this.props.endTimeConstraints,
    };
  }

  validateMinDate(date) {
    return this.state.start.isSameOrBefore(date, 'day');
  }

  isValidEndDate(currentDate, selectedDate) {
    return this.validateMinDate(currentDate)
      && this.props.isValidEndDate(currentDate, selectedDate);
  }

  onStartDateChange(date) {
    const options = {
      start: date,
    };

    if (this.state.end.isBefore(date)) {
      options.end = date.add(1, 'd');
    }

    this.setState(options, () => {
      this.props.onChange(this.propsToPass());
      this.props.onStartDateChange(this.propsToPass().start);
    });
  }

  onEndDateChange(date) {
    this.setState({ end: date }, () => {
      this.props.onChange(this.propsToPass());
      this.props.onEndDateChange(this.propsToPass().end);
    });
  }

  onFocus() {
    this.props.onFocus();
  }

  onBlur() {
    this.props.onBlur(this.propsToPass());
  }

  renderDay(props, currentDate) {
    const { start, end } = this.state;
    const { className, ...rest } = props;
    const date = moment(props.key, 'M_D');

    // style all dates in range
    let classes = date.isBetween(start, end, 'day')
      ? `${props.className} in-selecting-range` : props.className;

    // add rdtActive to selected startdate and endDate in pickers
    classes = date.isSame(start, 'day') || date.isSame(end, 'day') ? `${classes} rdtActive` : classes;

    return (
      <td {...rest}
        className={classes}>
        {currentDate.date()}
      </td>
    );
  }
  closeValue(name) {
    this.state[name] = moment('');
    this.setState ({...this.state});
    if(name == 'start') {
      this.props.onStartDateChange('')      
    } else {
      this.props.onEndDateChange('') 
    }
  }
  render() {
    const startProps = this.calcStartTimeProps();
    const endProps = this.calcEndTimeProps();
    return (
      <div
        className={this.props.className}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}>
        <div className='col-md-6 box-group-date'>
          <ShowIf condition={this.state.start && this.state.start._d && this.state.start._d != 'Invalid Date'}>
            <span className='btn-remove-date' onClick={this.closeValue.bind(this, 'start')}>×</span>
          </ShowIf>
          <Datetime
            {...startProps}
            isValidDate={this.props.isValidStartDate}
            onChange={this.onStartDateChange.bind(this)}
            value={this.state.start}
            renderDay={this.renderDay.bind(this)} />
        </div>
        <div className='col-md-6 box-group-date'>
          <ShowIf condition={this.state.end && this.state.end._d && this.state.end._d != 'Invalid Date'}>
            <span className='btn-remove-date' onClick={this.closeValue.bind(this, 'end')}>×</span>
          </ShowIf>
          <Datetime
            {...endProps}
            isValidDate={this.isValidEndDate.bind(this)}
            value={this.state.end}
            onChange={this.onEndDateChange.bind(this)}
            renderDay={this.renderDay.bind(this)} />
        </div>
      </div>
    );
  }
}

DatetimeRangePicker.defaultProps = {
  utc: false,
  locale: null,
  input: false,   // This defines whether or not to to edit date manually via input
  inline: false,  // This defines whether or not to show input field
  className: '',
  viewMode: 'days',
  dateFormat: true,
  timeFormat: true,
  closeOnTab: true,
  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
  pickerClassName: '',
  endDate: new Date(),
  closeOnSelect: false,
  inputProps: undefined,
  startDate: new Date(),
  onEndDateBlur: () => {},
  endTimeConstraints: {},
  onEndDateFocus: () => {},
  isValidStartDate: () => true,
  isValidEndDate: () => true,
  onStartDateBlur: () => {},
  onEndDateChange: () => {},    // This is called after onChange
  onStartDateFocus: () => {},
  startTimeConstraints: {},
  onStartDateChange: () => {},  // This is called after onChange
};


DatetimeRangePicker.propTypes = {
  utc: PropTypes.bool,
  input: PropTypes.bool,
  inline: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  locale: PropTypes.string,
  onChange: PropTypes.func,
  viewMode: PropTypes.oneOf(['years', 'months', 'days', 'time']),
  closeOnTab: PropTypes.bool,
  className: PropTypes.string,
  inputProps: PropTypes.object,   // eslint-disable-line
  closeOnSelect: PropTypes.bool,
  isValidEndDate: PropTypes.func,
  onEndDateBlur: PropTypes.func,
  onEndDateFocus: PropTypes.func,
  onEndDateChange: PropTypes.func,
  onStartDateBlur: PropTypes.func,
  isValidStartDate: PropTypes.func,
  onStartDateFocus: PropTypes.func,
  onStartDateChange: PropTypes.func,
  pickerClassName: PropTypes.string,
  endDate: PropTypes.instanceOf(Date),
  endTimeConstraints: PropTypes.object,   // eslint-disable-line
  startDate: PropTypes.instanceOf(Date),
  startTimeConstraints: PropTypes.object,   // eslint-disable-line
  dateFormat: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  timeFormat: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default DatetimeRangePicker;

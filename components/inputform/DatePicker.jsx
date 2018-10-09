import React from 'react';
import { msg } from 'constants/message';
import Datetime from 'react-datetime';
import moment from 'moment';
import { ShowIf, validatable } from 'components/utils';
import * as CONFIG from 'constants/datetime';

class DatePicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isValid: true,
      value: this.props.value,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      message: ''
    }
  }

  onChange(e) {
    let inputDate = e;
    if (e._d) {
      inputDate = e._d;
    }

    this.state.value = inputDate
    this.setState({
      ...this.state
    });
    this.validate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate != this.state.startDate) {
      this.setState({
        startDate: nextProps.startDate
      });
    }

    if (nextProps.endDate != this.state.endDate) {
      this.setState({
        endDate: nextProps.endDate
      });
    }

    if (nextProps.value != this.props.value) {
      this.setState({
        value: nextProps.value
      });
    }

    if(!this.state.isValid && nextProps.require && !nextProps.value) {
      this.setState({
        isValid: false,
        message: this.props.requireMessage
      });
    } else if (nextProps.value && !moment(nextProps.value, CONFIG.DateFormat).isValid()) {
      this.setState({
        isValid: false,
        message: this.props.errMessage
      });
    } else if((!nextProps.require && moment(nextProps.value, CONFIG.DateFormat).isValid()) || (nextProps.require && nextProps.value && moment(nextProps.value, CONFIG.DateFormat).isValid())) {
      this.setState({
        isValid: true
      });
    }
  }

  classNames() {
    if (this.state.isValid) {
      return 'calendar_icon';
    } else {
      return 'calendar_icon pt-datepicker-danger';
    }
  }

  clearValue() {
    this.state.value = '';
    this.setState({
      ...this.state
    })
    this.props.onChange(this.state.value);
  }

  validate() {
    if(this.props.value != this.state.value) {
      this.props.onChange(this.state.value);
    }
    let isValid = (typeof this.state.value == 'string' && this.state.value.trim() == '') || moment(this.state.value, CONFIG.DateFormat).isValid();

    this.setState(
      {
        isValid
      }
    );

    if(this.props.require && (typeof this.state.value == 'string' && this.state.value.trim() == '')) {
      this.setState(
        {
          // TODO: Need to check if date string is valid, eg: '20/07/32ab'
          isValid: false,
          message: this.props.requireMessage
        }
      );
      this.DatetimePicker.focus();
      return false;
    } else if (!isValid) {
      this.setState(
        {
          // TODO: Need to check if date string is valid, eg: '20/07/32ab'
          isValid: false,
          message: this.props.errMessage
        }
      );
      this.DatetimePicker.focus();
      return false;
    } else {
      return true;
    }
  }

  render() {
    var renderers = {
      renderMonth: function( props, month, year, selectedDate){
        return <td {...props}>{ month + 1 + '月' }</td>;
      }
    }
    return (
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className="ip-label">
            { this.props.label }
            <ShowIf condition={this.props.require}>
              <span className="text-required label-require">&nbsp;*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className="input-datepicker">
          <ShowIf condition={this.state.value}>
            <span className="btn-clearDate" onClick={this.clearValue.bind(this)}>×</span>
          </ShowIf>
          <Datetime className={ this.classNames() } renderMonth={renderers.renderMonth} onChange={ this.onChange.bind(this) } dateFormat={ this.props.dateFormat } timeFormat={ this.props.timeFormat } value={ this.state.value }
            closeOnSelect={true} inputProps={{disabled: true}} isValidDate={ this.props.isValidDate.bind(this) } onBlur={ this.validate.bind(this) } inputProps={ { placeholder: this.props.placeholder, maxLength: this.props.maxLength, name: this.props.name } } />
        </div>
        <ShowIf condition={this.props.require == true}>
          <input className='hidden-input' ref={(DatetimePicker) => {this.DatetimePicker = DatetimePicker}}/>
        </ShowIf>
        <ShowIf condition={!this.state.isValid}>
          <div className="pt-form-helper-text">
            { this.state.message }
          </div>
        </ShowIf>
      </div>
    )
  }
}

function isValidDate(current) {
  let validBefore = true,
    validAfter = true;

  if (moment(this.state.startDate, CONFIG.DateFormat).isValid()) {
    validBefore = !current.isBefore(moment(this.state.startDate, CONFIG.DateFormat));
  }

  if (moment(this.state.endDate, CONFIG.DateFormat).isValid()) {
    validAfter = !current.isAfter(moment(this.state.endDate, CONFIG.DateFormat));
  }

  return validBefore && validAfter;
}

DatePicker.defaultProps = {
  className: 'input-group',
  label: '',
  timeFormat: false,
  dateFormat: CONFIG.DateFormat,
  placeholder: CONFIG.DateFormat,
  maxLength: 10,
  value: '',
  require: false,
  errMessage: msg.dateInvalid,
  requireMessage: msg.messageDefault,
  onChange: function() {
    console.log('Please assign onChange method')
  },
  startDate: '',
  endDate: '',
  isValidDate: isValidDate,
  name:''
}

export default validatable(DatePicker);

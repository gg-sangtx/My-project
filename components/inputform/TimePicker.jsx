import React from 'react';
import { msg } from 'constants/message';
import Datetime from 'react-datetime';
import moment from 'moment';
import { ShowIf, validatable } from 'components/utils';
import * as CONFIG from 'constants/datetime';

class TimePicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isValid: true,
      value: this.props.value ? moment(this.props.value, 'HH:mm') : '',
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      message: ''
    }
  }

  componentDidMount() {
    const datePicker = document.getElementsByClassName(this.props.name)[0];
    datePicker.childNodes[0].setAttribute("readOnly",true);
  }

  onChange(e) {
    let inputDate = e;
    if (e._d) {
      inputDate = e._d;
    }
    this.state.isValid = true;
    this.state.value = inputDate;
    this.setState({
      ...this.state
    });
    let data= {
      target: {
        value: inputDate
      }
    }
    this.props.onChange(data);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.props.value) {
      this.setState({
        value: nextProps.value
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

  validate() {
    let isValid = (typeof this.state.value == 'string' && this.state.value.trim() == '') || (typeof this.state.value != 'string' && moment(this.state.value).format(CONFIG.TimeFormat)  === 'Invalid date');

    if(this.props.require && (typeof this.state.value == 'string' && this.state.value.trim() == '')) {

      this.setState(
        {
          // TODO: Need to check if date string is valid, eg: '20/07/32ab'
          isValid: false,
          message: this.props.requireMessage
        }
      );
      this.TimePicker.focus();
      return false;
    } else if (isValid) {
      this.setState(
        {
          // TODO: Need to check if date string is valid, eg: '20/07/32ab'
          isValid: false,
          message: this.props.errMessage
        }
      );
      this.TimePicker.focus();
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className="ip-label">
            { this.props.label }
            <ShowIf condition={this.props.require}>
              <span className="label-require">&nbsp;*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className="input-datepicker" style={{position: 'relative'}}>
          <Datetime readOnly={true} className={`${this.props.name} ${this.classNames()}` } onChange={ this.onChange.bind(this) } dateFormat={ this.props.dateFormat } timeFormat={ this.props.timeFormat } value={ this.state.value }
            closeOnSelect={true} inputProps={{disabled: true}} isValidDate={ this.props.isValidDate } inputProps={ { placeholder: this.props.placeholder, maxLength: this.props.maxLength, name: this.props.name } } />
          <input className='hidden-input' ref={(TimePicker) => {this.TimePicker = TimePicker}}/>
        </div>
        <ShowIf condition={!this.state.isValid}>
          <div className="pt-form-helper-text">
            { this.state.message }
          </div>
        </ShowIf>
      </div>
    )
  }
}

TimePicker.defaultProps = {
  className: 'input-group',
  label: '',
  timeFormat: 'HH:mm',
  dateFormat: false,
  placeholder: 'HH:mm',
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
  isValidDate: function() {},
  name:''
}

export default validatable(TimePicker);

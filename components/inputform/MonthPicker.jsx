import React from 'react';
import { msg } from 'constants/message';
import Datetime from 'react-datetime';
import moment from 'moment';
import { ShowIf, validatable } from 'components/utils';
import * as CONFIG from 'constants/datetime';

class MonthPicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isValid: true,
      value: this.props.value
    }
  }

  onChange(e) {
    if (e._d) {
      let value = {
        target: {
          value: e._d
        }
      }
      this.props.onChange(value);
      this.state.value = e._d
      this.setState({
        ...this.state
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value != nextProps.value) {
      this.state.value = nextProps.value;
      this.setState({...this.state})
    }
  }

  componentDidMount() {
    const datePicker = document.getElementsByClassName('month-picker')[0];
    datePicker.childNodes[0].setAttribute("readOnly",true);
  }

  classNames() {
    if (this.state.isValid) {
      return 'calendar_icon month-picker';
    } else {
      return 'calendar_icon month-picker pt-datepicker-danger';
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className="ip-label">
            { this.props.label }
            <ShowIf condition={this.props.require}>
              <span className="text-required">&nbsp;*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className="input-datepicker">
          <Datetime
            className={ this.classNames() }
            onChange={ this.onChange.bind(this) }
            dateFormat={ this.props.dateFormat }
            timeFormat={ this.props.timeFormat }
            value={ this.state.value }
            closeOnSelect={true}
            inputProps={{readOnly: true}}
            inputProps={ { placeholder: this.props.placeholder, maxLength: this.props.maxLength, name: this.props.name } } />
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

MonthPicker.defaultProps = {
  className: 'input-group',
  label: '',
  timeFormat: false,
  dateFormat: CONFIG.MonthFormat,
  placeholder: CONFIG.MonthFormat,
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
  name:''
}

export default validatable(MonthPicker);

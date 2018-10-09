import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";
import {TimePicker} from 'components/inputform';
import moment from 'moment';

class CoupleTime extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      valueMin: this.props.valueMin || '',
      valueMax: this.props.valueMax || '',
      isValid: true
    }
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.state.isValid = true;
    this.setState({
      ...this.state
    })
    if (name=='valueMin') {
      this.props.onChangeMin(e);
    } else {
      this.props.onChangeMax(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.valueMin = nextProps.valueMin;
    this.state.valueMax = nextProps.valueMax;
    this.setState({
      ...this.state
    });
    if(nextProps.require && typeof nextProps.valueMin == 'string' && nextProps.valueMin.trim()) {
      this.state.isValid = true
      this.setState({
        ...this.state
      });
    }
    if(nextProps.require && typeof nextProps.valueMax == 'string' && nextProps.valueMax.trim()) {
      this.state.isValid = true
      this.setState({
        ...this.state
      });
    }
  }

  classNames() {
    if (this.state.isValid) {
      return 'pt-input';
    } else {
      return 'pt-input pt-intent-danger';
    }
  }

  handleFocus(e) {
    e.target.select();
  }

  render() {
    let timeMax = moment(this.state.valueMax, 'HH:mm');
    let timeMin = moment(this.state.valueMin, 'HH:mm');
    return (
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className='group-input row'>
          <TimePicker className='col-xs-12' require={this.props.require} isValidDate={moment().isAfter(timeMax)} bindValidator={this} channel='form' name={`${this.props.name}min`} value={this.state.valueMin} onChange={this.onChange.bind(this, 'valueMin')}/>
          <span className='gap-input'>&nbsp;~&nbsp;</span>
          <TimePicker className='col-xs-12' require={this.props.require} isValidDate={moment().isBefore(timeMin)} bindValidator={this} channel='form' name={`${this.props.name}max`} value={this.state.valueMax} onChange={this.onChange.bind(this, 'valueMax')}/>
        </div>
        <ShowIf condition={!this.state.isValid && (this.state.valueMax.trim()== '' || this.state.valueMin.trim()== '')}>
          <span className="pt-form-helper-text">{msg.messageDefault}</span>
        </ShowIf>
      </div>
    )
  }
}

CoupleTime.defaultProps = {
  label: 'This is label',
  className: 'form-group',
  require: false,
  type: 'text',
  maxLength: 255,
  name: '',
  valueMin: '',
  valueMax: '',
  disabled: false,
  onChangeMin: function() {
    console.log('Need to assign onChangeMin method')
  },
  onChangeMax: function() {
    console.log('Need to assign onChangeMax method')
  }
}

export default validatable(CoupleTime);

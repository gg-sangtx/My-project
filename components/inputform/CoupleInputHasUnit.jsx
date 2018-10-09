import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";

const PhoneNumber = (input) => {
  return input = input.replace(/[^0-9]+/g, "");
}

class CoupleInputHasUnit extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      valueMin: this.props.valueMin || '',
      valueMax: this.props.valueMax || '',
      isValid: true
    }
  }

  onChange(name, e) {
    e.target.value = PhoneNumber(e.target.value)
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

  validate() {
    if (typeof this.state.valueMin == 'string' && this.state.valueMin.trim() == '') {
      this.setState({
        isValid: false
      });
      this.inputMin.focus();
      return false;
    } else if (typeof this.state.valueMax == 'string' && this.state.valueMax.trim() == '') {
      this.setState({
        isValid: false
      });
      this.inputMax.focus();
      return false;
    } else {
      this.setState({
        isValid: true
      });
      return true;
    }
  }

  handleFocus(e) {
    e.target.select();
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
        <ShowIf condition={this.props.labelMin != '' && this.props.labelMax != ''}>
          <div className='group-input'>
            <label className='form-label'>{this.props.labelMin}
              <ShowIf condition={this.props.require == true}>
                <span className='label-require'>*</span>
              </ShowIf>
            </label>
            <label className='form-label'>{this.props.labelMax}
              <ShowIf condition={this.props.require == true}>
                <span className='label-require'>*</span>
              </ShowIf>
            </label>
          </div>
        </ShowIf>
        <div className='group-input'>
          <div className='group-input-has-unit'>
            <label className='unit-label pr5 mb0'>{this.props.unitLabel}</label>
            <input disabled={this.props.disabled} ref={(inputMin) => {this.inputMin = inputMin}} className='form-input' type={this.props.type} maxLength={this.props.maxLength} name={`${this.props.name}min`} value={this.state.valueMin} onChange={this.onChange.bind(this, 'valueMin')}/>
          </div>
          <span className='gap-input pl15 pr15'>&nbsp;〜&nbsp;</span>
          <div className='group-input-has-unit'>
            <label className='unit-label pr5 mb0'>{this.props.unitLabel}</label>
            <input disabled={this.props.disabled} ref={(inputMax) => {this.inputMax = inputMax}} className='form-input' type={this.props.type} maxLength={this.props.maxLength} name={`${this.props.name}max`} value={this.state.valueMax} onChange={this.onChange.bind(this, 'valueMax')}/>
          </div>
        </div>
        <ShowIf condition={!this.state.isValid && (this.state.valueMax.trim()== '' || this.state.valueMin.trim()== '')}>
          <span className="pt-form-helper-text">{msg.messageDefault}</span>
        </ShowIf>
      </div>
    )
  }
}

CoupleInputHasUnit.defaultProps = {
  label: 'This is label',
  className: 'form-group',
  require: false,
  type: 'text',
  maxLength: 255,
  name: '',
  valueMin: '',
  valueMax: '',
  labelMin: '',
  labelMax: '',
  disabled: false,
  onChangeMin: function() {
    console.log('Need to assign onChangeMin method')
  },
  onChangeMax: function() {
    console.log('Need to assign onChangeMax method')
  }
}

export default validatable(CoupleInputHasUnit);
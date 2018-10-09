import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";


class InputCurrency extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || '',
      isValid: true
    }
  }

  onChange(e) {
    this.state.value = e.target.value;
    this.state.isValid = true;
    this.setState({
      ...this.state
    })
    if(this.props.changeOnBlur != true) {
      this.props.onChange(e);
    }
  }

  onBlur(e) {
    if (this.props.changeOnBlur == true) {
      this.state.value = e.target.value;
      this.state.isValid = true;
      this.setState({
        ...this.state
      })
      this.props.onChange(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.value = nextProps.value;
    this.setState({
      ...this.state
    });
    if(nextProps.require && typeof nextProps.value == 'string' && nextProps.value.trim()) {
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
    if (typeof this.state.value == 'string' && this.state.value.trim() == '' && this.props.require) {
      this.setState({
        isValid: false
      });
      this.input.focus();
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
      <div className={this.props.className + ' currency-input'}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className="input-group">
          <span className="input-group-addon">
            ¥
          </span>
          <input autoComplete='off' disabled={this.props.disabled} ref={(input) => {this.ref = input}} className='form-input' type={this.props.type} maxLength={this.props.maxLength} name={this.props.name} value={this.state.value} onBlur={this.onBlur.bind(this)} onChange={this.onChange.bind(this)}/>
        </div>
        <ShowIf condition={!this.state.isValid && this.state.value.trim()== ''}>
          <span className="pt-form-helper-text">{msg.messageDefault}</span>
        </ShowIf>
      </div>
    );
  }
}

InputCurrency.defaultProps = {
  label: 'This is label',
  require: false,
  type: 'text',
  maxLength: 255,
  name: '',
  value: '',
  disabled: false,
  changeOnBlur: false,
  className: 'form-control form-input',
  onChange: function() {
    console.log('Need to assign onChange method')
  }
}

export default validatable(InputCurrency);

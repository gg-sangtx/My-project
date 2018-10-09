import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";

class TextArea extends React.Component {
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
    // this.props.onChange(e);
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
    if (((typeof this.state.value == 'string' && this.state.value.trim() == '') || (this.props.type == 'sdt' && this.state.value == 0)) && this.props.require) {
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
      <div className={this.props.className}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <textarea rows={5} disabled={this.props.disabled} ref={(input) => {this.input = input}} className='form-textarea' maxLength={this.props.maxLength} name={this.props.name} value={this.state.value} onBlur={this.onBlur.bind(this)} onChange={this.onChange.bind(this)}/>
        <ShowIf condition={!this.state.isValid && this.state.value.trim()== ''}>
          <span className="pt-form-helper-text">{msg.messageDefault}</span>
        </ShowIf>
      </div>
    )
  }
}

TextArea.defaultProps = {
  label: 'This is label',
  require: false,
  maxLength: 255,
  name: '',
  value: '',
  disabled: false,
  changeOnBlur: false,
  className: 'form-group',
  onChange: function() {
    console.log('Need to assign onChange method')
  }
}

export default validatable(TextArea);

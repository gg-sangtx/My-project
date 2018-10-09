import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";

class InputTel extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tel1: this.props.tel1 || '',
      tel2: this.props.tel2 || '',
      tel3: this.props.tel3 || '',
      isValid: true
    }
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.state.isValid = true;
    this.setState({
      ...this.state
    })
    if (name=='tel1') {
      this.props.onChangeTel1(e);
    } else if (name=='tel2') {
      this.props.onChangeTel2(e);
    } else {
      this.props.onChangeTel3(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.tel1 = nextProps.tel1;
    this.state.tel2 = nextProps.tel2;
    this.state.tel3 = nextProps.tel3;
    this.setState({
      ...this.state
    });
    if(nextProps.require && typeof nextProps.tel1 == 'string' && nextProps.tel1.trim()) {
      this.state.isValid = true
      this.setState({
        ...this.state
      });
    }
    if(nextProps.require && typeof nextProps.tel2 == 'string' && nextProps.tel2.trim()) {
      this.state.isValid = true
      this.setState({
        ...this.state
      });
    }
    if(nextProps.require && typeof nextProps.tel3 == 'string' && nextProps.tel3.trim()) {
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
    if (typeof this.state.tel1 == 'string' && this.state.tel1.trim() == '') {
      this.setState({
        isValid: false
      });
      this.tel1.focus();
      return false;
    } else if (typeof this.state.tel2 == 'string' && this.state.tel2.trim() == '') {
      this.setState({
        isValid: false
      });
      this.tel2.focus();
      return false;
    } else if (typeof this.state.tel3 == 'string' && this.state.tel3.trim() == '') {
      this.setState({
        isValid: false
      });
      this.tel3.focus();
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
        <div className='group-input'>
          <label className='form-label'>{this.props.labelTel1}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
          <label className='form-label'>{this.props.labelTel2}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
          <label className='form-label'>{this.props.labelTel3}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>*</span>
            </ShowIf>
          </label>
        </div>
        <div className='group-input'>
          <input disabled={this.props.disabled} ref={(tel1) => {this.tel1 = tel1}} className='form-input' type={this.props.type} maxLength={this.props.maxLength} name={`${this.props.name}1`} value={this.state.tel1} onChange={this.onChange.bind(this, 'tel1')}/>
          <span className='gap-input pl15 pr15'>&nbsp;-&nbsp;</span>
          <input disabled={this.props.disabled} ref={(tel2) => {this.tel2 = tel2}} className='form-input' type={this.props.type} maxLength={this.props.maxLength} name={`${this.props.name}2`} value={this.state.tel2} onChange={this.onChange.bind(this, 'tel2')}/>
          <span className='gap-input pl15 pr15'>&nbsp;-&nbsp;</span>
          <input disabled={this.props.disabled} ref={(tel3) => {this.tel3 = tel3}} className='form-input' type={this.props.type} maxLength={this.props.maxLength} name={`${this.props.name}3`} value={this.state.tel3} onChange={this.onChange.bind(this, 'tel3')}/>
        </div>
        <div className='group-input'>
          <span className="pt-form-helper-text form-label">
            <ShowIf condition={!this.state.isValid && this.state.tel1.trim() == ''}>
              <span>{msg.messageDefault}</span>
            </ShowIf>
          </span>
          <span className="pt-form-helper-text form-label">
            <ShowIf condition={!this.state.isValid && this.state.tel2.trim() == ''}>
              <span>{msg.messageDefault}</span>
            </ShowIf>
          </span>
          <span className="pt-form-helper-text form-label">
            <ShowIf condition={!this.state.isValid && this.state.tel3.trim() == ''}>
              <span>{msg.messageDefault}</span>
            </ShowIf>
          </span>
        </div>
      </div>
    )
  }
}

InputTel.defaultProps = {
  className: 'form-group',
  require: false,
  type: 'text',
  maxLength: 255,
  name: '',
  tel1: '',
  tel2: '',
  tel3: '',
  labelTel1: '',
  labelTel2: '',
  labelTel3: '',
  disabled: false,
  onChangeTel1: function() {
    console.log('Need to assign onChangeTel1 method')
  },
  onChangeTel2: function() {
    console.log('Need to assign onChangeTel2 method')
  },
  onChangeTel3: function() {
    console.log('Need to assign onChangeTel3 method')
  }
}

export default validatable(InputTel);
import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {msg} from "constants/message";

class ListCoupleInput extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: this.props.value || [{
        [this.props.valueNameOne]: '',
        [this.props.valueNameTwo]: '',
        [this.props.valueNameThree]: ''
      }],
      isValid: true
    }
  }

  onChange(index, name, e) {
    this.state.value[index][name] = e.target.value;
    this.state.isValid = true;
    this.setState({
      ...this.state
    })
    let value = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(value);

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value != nextProps.value) {
      this.state.value = nextProps.value;
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
    let indexItem;
    let inputErr;
    if(this.state.value.length == 0) {
      this.setState({
        isValid: false
      });
      this.input.focus();
      return false;
    } else {
      let pass = true
      this.state.value.map((item, index) => {
        if(!item[this.props.valueNameOne] || !item[this.props.valueNameTwo] || !item[this.props.valueNameThree]) {
          pass = false;
          indexItem = index;
          inputErr = !item[this.props.valueNameOne] ? 'inputOne' : (!item[this.props.valueNameTwo] ? 'inputTwo' : 'inputThree')
        }
      })
      if (pass == false) {
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
  }

  removeItem(index) {
    this.state.value.splice(index, 1);
    this.setState({...this.state});
    let value = {
      target: {
        value: this.state.value
      }
    }
    this.props.onChange(value);
  }

  addNewItem() {
    let newItem = {
      [this.props.valueNameOne]: '',
      [this.props.valueNameTwo]: '',
      [this.props.valueNameThree]: ''
    }
    this.state.value.push(newItem);
    this.setState({...this.state})
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
        <ShowIf condition={this.props.labelOne != '' && this.props.labelTwo != ''}>
          <div className='group-input'>
            <label className='form-label'>{this.props.labelOne}
              <ShowIf condition={this.props.require == true}>
                <span className='label-require'>*</span>
              </ShowIf>
            </label>
            <label className='form-label'>{this.props.labelTwo}
              <ShowIf condition={this.props.require == true}>
                <span className='label-require'>*</span>
              </ShowIf>
            </label>
            <label className='form-label'>{this.props.labelThree}
              <ShowIf condition={this.props.require == true}>
                <span className='label-require'>*</span>
              </ShowIf>
            </label>
          </div>
        </ShowIf>
        <ShowIf condition={this.state.value.length > 0}>
          <div>
            {
              this.state.value.map((item, index) => {
                return (
                  <div className={`group-input ${index == this.state.value.length - 1 ? '' : 'mb15'}`} key={index}>
                    <ShowIf condition={index == 0}>
                      <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}one${index}`} value={item[this.props.valueNameOne]} onChange={this.onChange.bind(this, index, this.props.valueNameOne)}/>
                    </ShowIf>
                    <ShowIf condition={index > 0}>
                      <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}one${index}`} value={item[this.props.valueNameOne]} onChange={this.onChange.bind(this, index, this.props.valueNameOne)}/>
                    </ShowIf>
                    <span className='gap-input pl15 pr15'>&nbsp;&nbsp;</span>
                    <ShowIf condition={index == 0}>
                      <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}two${index}`} value={item[this.props.valueNameTwo]} onChange={this.onChange.bind(this, index, this.props.valueNameTwo)}/>
                    </ShowIf>
                    <ShowIf condition={index > 0}>
                      <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}two${index}`} value={item[this.props.valueNameTwo]} onChange={this.onChange.bind(this, index, this.props.valueNameTwo)}/>
                    </ShowIf>
                    <span className='gap-input pl15 pr15'>&nbsp;&nbsp;</span>
                    <ShowIf condition={index == 0}>
                      <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}three${index}`} value={item[this.props.valueNameThree]} onChange={this.onChange.bind(this, index, this.props.valueNameThree)}/>
                    </ShowIf>
                    <ShowIf condition={index > 0}>
                      <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}three${index}`} value={item[this.props.valueNameThree]} onChange={this.onChange.bind(this, index, this.props.valueNameThree)}/>
                    </ShowIf>
                    <ShowIf condition={this.state.value.length > 1}>
                      <span disabled={this.props.disabled} className='btn-delete-image' onClick={this.removeItem.bind(this, index)}/>
                    </ShowIf>
                    <input className='hidden-input' ref={(input) => {this.input = input}}/>
                  </div>
                )
              })
            }
          </div>
        </ShowIf>
        <ShowIf condition={this.state.value.length == 0}>
          <div className='group-input'>
            <input disabled={this.props.disabled} className='form-input' ref={(input) => {this.input = input}} type={this.props.type} name={`${this.props.name}one${0}`} value={''} onChange={this.onChange.bind(this, 0, this.props.valueNameOne)}/>
            <span className='gap-input pl15 pr15'>&nbsp;&nbsp;</span>
            <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}two${0}`} value={''} onChange={this.onChange.bind(this, 0, this.props.valueNameTwo)}/>
            <span className='gap-input pl15 pr15'>&nbsp;&nbsp;</span>
            <input disabled={this.props.disabled} className='form-input' type={this.props.type} name={`${this.props.name}three${0}`} value={''} onChange={this.onChange.bind(this, 0, this.props.valueNameThree)}/>
          </div>
        </ShowIf>
        <div className='mb15'>
          <ShowIf condition={!this.state.isValid}>
            <span className="pt-form-helper-text mb15">{msg.messageDefault}</span>
          </ShowIf>
        </div>
        <span className='btn-confirm' onClick={this.addNewItem.bind(this)}>追加</span>
      </div>
    )
  }
}

ListCoupleInput.defaultProps = {
  label: '',
  className: 'form-group',
  require: false,
  type: 'text',
  maxLength: 255,
  name: '',
  value: [{}],
  valueNameOne: '',
  valueNameTwo: '',
  labelOne: '',
  labelTwo: '',
  disabled: false,
  onChange: function() {
    console.log('Need to assign onChange method')
  }
}

export default validatable(ListCoupleInput);
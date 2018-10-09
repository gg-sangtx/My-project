import React from 'react';
import {ShowIf} from 'components/utils';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";

class InputGroupCurrency extends React.Component {

  onChange(name, e) {
    if (name == 'from') {
      this.props.onChangeFrom(e);
    } else if (name == 'to') {
      this.props.onChangeTo(e);
    }
  }

  onBlur(name, e) {
    if (name == 'from') {
      this.props.onBlurFrom(e);
    } else if (name == 'to') {
      this.props.onBlurTo(e);
    }
    this.props.onChange(e);
  }

  render() {
    return (
      <div className="row">
        <ShowIf condition={this.props.labelGroup != ''}>
          <div className="col-xs-12">
            <label htmlFor="price">{this.props.labelGroup}</label>
          </div>
        </ShowIf>
        <div className='group-input col-xs-12'>
          <div className="input-group">
            <span className="input-group-addon">
              {this.props.labelTo}
            </span>
              <input type="text" name={this.props.name + 'From'} ref={(input) => {this.input = input}} className="form-control form-input" type={this.props.type} value={this.props.valueFrom} onChange={this.onChange.bind(this, 'from')} onBlur={this.onBlur.bind(this, 'from')} autoComplete='off' disabled={this.props.disabled}/>
          </div>
          <span className='gap-input pl15 pr15'>&nbsp;~&nbsp;</span>
          <div className="input-group">
            <span className="input-group-addon">
              {this.props.labelTo}
            </span>
              <input type="text" name={this.props.name + 'To'} ref={(input) => {this.input = input}} className="form-control form-input" type={this.props.type} value={this.props.valueTo} onChange={this.onChange.bind(this, 'to')} onBlur={this.onBlur.bind(this, 'to')} autoComplete='off' disabled={this.props.disabled}/>
          </div>
        </div>
      </div>
    );
  }
}

InputGroupCurrency.defaultProps = {
  labelGroup: 'This is label',
  type: 'number',
  maxLength: 255,
  name: '',
  value: '',
  disabled: false,
  onChange() {
    console.log('Need to assign onChange method');
  }
};

export default InputGroupCurrency;

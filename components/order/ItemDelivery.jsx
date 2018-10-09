import React, { Component } from 'react';

export default class ItemDelivery extends Component {
  onChange(e) {
    let Data = this.props;
    let dataSuggest = {
      first_name: Data.first_name ? Data.first_name : '',
      last_name: Data.last_name ? Data.last_name : '',
      postal_code1: Data.postal_code1 ? Data.postal_code1 : '',
      postal_code2: Data.postal_code2 ? Data.postal_code2 : '',
      prefecture: Data.prefecture ? Data.prefecture : 1,
      tel1: Data.tel1 ? Data.tel1 : '',
      tel2: Data.tel2 ? Data.tel2 : '',
      tel3: Data.tel3 ? Data.tel3 : '',
      address1: Data.address1 ? Data.address1 : '',
      address2: Data.address2 ? Data.address2 : ''
    }
    let value = {
      target: {
        value: dataSuggest
      }
    }
    this.props.onChange(value)
  }
  render() {
    return (
      <div className='wrap-item-delivery'>
        <input type='radio' onClick={this.onChange.bind(this)} id={this.props.name + (this.props.index + 1)} name={this.props.name} defaultChecked={this.props.defaultChecked ? true : false} className='input-radio'/>
        <label className='mark-for-radio-button' htmlFor={this.props.name + this.props.index}/>
        <div className='wrap-content-delivery'>
          <p className='bold'>{this.props.isMember == true ? '会員登録住所' : ('配送先住所' + (this.props.index + 1))}</p>
          <p>{this.props.address1 ? this.props.address1 : ''}{this.props.address2 ? + ' ' + this.props.address2 : ''}</p>
          <p>{this.props.tel1 ? this.props.tel1 : ''}{this.props.tel2 ? '-' + this.props.tel2 : ''}{this.props.tel3 ? '-' + this.props.tel3 : ''}</p>
        </div>
      </div>
    );
  }
}

ItemDelivery.defaultProps = {
  defaultChecked: false,
  isMember: false
}

import React, { Component } from 'react';
import { Input, DropDown, Text, CoupleInput, DatePicker, InputTel} from 'components/inputform';
import { connect } from 'react-redux';
import { Customer } from 'api';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import * as CONFIG from 'constants/datetime';
import moment from 'moment';
import {ListDelivery} from 'components/customer-deliveries';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      first_name: '',
      last_name: '',
      first_name_kana: '',
      last_name_kana: '',
      birthday: '',
      email: '',
      post_code_1: '',
      post_code_2: '',
      prefecture: '',
      address_1: '',
      address_2: '',
      gender: '',
      created_at: '',
      updated_at: '',
      tel_1: '',
      tel_2: '',
      tel_3: '',
      past_booking_date: '',
      next_booking_date: '',
      listGender: [{id: 1, value: '男性'},{id: 2, value: '女性'}],
      dataLocation: this.props.dataLocation || [],
      children: [],
      idBooking: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataLocation != this.props.dataLocation) {
      this.state.dataLocation = nextProps.dataLocation;
    }
    this.setState({...this.state});
  }

  componentDidMount() {
    this.getDetail(this.props.params.id);
  }

  getDetail(id) {
    Customer.actions.get.request({id: id}).then(res => {
      if(res.data) {
        let dataDetail = res.data.data.customer;
        this.getData(dataDetail);
      }
    }).catch(err => {
      if(err && err.response) {
        let message = err.response.data.errors;
        if(typeof message == String) {
          Toastr(message, 'error');
        } else if (message.length > 0) {
          message.map(error => {
            Toastr(error, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error')
        }
      } else {
        Toastr(msg.systemFail, 'error')
      }
    })
  }

  getData(data) {
    this.state.first_name = data.first_name ? data.first_name : '';
    this.state.last_name = data.last_name ? data.last_name : '';
    this.state.first_name_kana = data.first_name_kana ? data.first_name_kana : '';
    this.state.last_name_kana = data.last_name_kana ? data.last_name_kana : '';
    this.state.birthday = data.birthday ? new Date(data.birthday) : '';
    this.state.email = data.email ? data.email : '';
    this.state.post_code_1 = data.post_code_1 ? data.post_code_1 : '';
    this.state.post_code_2 = data.post_code_2 ? data.post_code_2 : '';
    this.state.prefecture = data.prefecture ? data.prefecture : '';
    this.state.address_1 = data.address_1 ? data.address_1 : '';
    this.state.address_2 = data.address_2 ? data.address_2 : '';
    this.state.tel_1 = data.tel_1 ? data.tel_1 : '';
    this.state.tel_2 = data.tel_2 ? data.tel_2 : '';
    this.state.tel_3 = data.tel_3 ? data.tel_3 : '';
    this.state.gender = data.gender ? data.gender : '';
    this.state.idBooking = data.next_booking_id ? data.next_booking_id : '';
    if(data.children.length > 0) {
      data.children.map(item => {
        let newItem = {
          name: item.name,
          gender: item.gender,
          birthday: item.birthday ? new Date(item.birthday) : ''
        }
        this.state.children.push(newItem);
      })
    }
    this.state.created_at = data.created_at ? moment(data.created_at).format(CONFIG.DateFormat) : '';
    this.state.updated_at = data.updated_at ? moment(data.updated_at).format(CONFIG.DateFormat) : '';
    this.state.past_booking_date = data.past_booking_date ? data.past_booking_date : '-';
    this.state.next_booking_date = data.next_booking_date ? data.next_booking_date : '-';
    this.setState({...this.state})
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  onChangeDate(name, e) {
    this.state[name] = e;
    this.setState({
      ...this.state
    })
  }

  onChangeItem(name, index, e) {
    this.state.children[index][name] = e.target.value;
    this.setState({...this.state})
  }

  onChangeDateItem(name, index, e) {
    this.state.children[index][name] = e;
    this.setState({...this.state})
  }

  getParams() {
    let params = {};
    params.first_name = this.state.first_name ? this.state.first_name : null;
    params.last_name = this.state.last_name ? this.state.last_name : null;
    params.first_name_kana = this.state.first_name_kana ? this.state.first_name_kana : null;
    params.last_name_kana = this.state.last_name_kana ? this.state.last_name_kana : null;
    params.birthday = this.state.birthday ? moment(this.state.birthday).format(CONFIG.DateFormat) : null;
    params.email = this.state.email ? this.state.email : null;
    params.post_code_1 = this.state.post_code_1 ? this.state.post_code_1 : null;
    params.post_code_2 = this.state.post_code_2 ? this.state.post_code_2 : null;
    params.prefecture = this.state.prefecture ? this.state.prefecture : null;
    params.address_1 = this.state.address_1 ? this.state.address_1 : null;
    params.address_2 = this.state.address_2 ? this.state.address_2 : null;
    params.tel_1 = this.state.tel_1 ? this.state.tel_1 : null;
    params.tel_2 = this.state.tel_2 ? this.state.tel_2 : null;
    params.tel_3 = this.state.tel_3 ? this.state.tel_3 : null;
    params.gender = this.state.gender ? this.state.gender : null;
    if (this.state.children.length > 0) {
      let data = [];
      this.state.children.map(item => {
        if(item.name || item.birthday) {
          let newItem = {
            name: item.name ? item.name : null,
            gender: item.gender ? item.gender : null,
            birthday: item.birthday ? moment(item.birthday).format(CONFIG.DateFormat) : null
          }
          data.push(newItem);
        }
      })
      params.children = data;
    } else {
      params.children = [];
    }
    return params
  }

  createCustomer(e) {
    e.preventDefault();
    let params = this.getParams();
    if(this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({...this.state});
      this.patchProcess(params);
    }
  }

  patchProcess(params) {
    Customer.actions.update.request({id: this.props.params.id}, params).then(res => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(`${this.state.last_name} ${this.state.first_name} ${msg.updateCustomer}`, 'success');
      this.goBack();
    }).catch(err => {
      if(err && err.response) {
        let message = err.response.data.errors;
        if(typeof message == String) {
          Toastr(message, 'error');
        } else if (message.length > 0) {
          message.map(error => {
            Toastr(error, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error')
        }
      } else {
        Toastr(msg.systemFail, 'error')
      }
      this.state.loading = false;
      this.setState({...this.state});
    })
  }

  validateSubmitForm() {
    let pass = true;
    this.props.validators['form'].map(validator => {
      if(pass) {
        pass = validator.validate();
      } else {
        validator.validate();
      }
    })
    return pass;
  }

  componentWillUnmount() {
    this.props.validators['form'] = [];
  }

  createChildrent(e) {
    e.preventDefault();
    this.state.children.push({name: '', gender: 1, birthday: ''});
    this.setState({...this.state});
  }

  deleteChildrent(index, e) {
    e.preventDefault();
    this.state.children.splice(index, 1);
    this.setState({...this.state});
  }

  goBack() {
    this.props.dispatch({type: 'CUSTOMER_GO_BACK'});
    this.props.history.push('/customers');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>会員情報 <small>編集</small></h2>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>
            <Text className='col-xs-12 mb15' label='会員ID' name='customer_id' value={this.props.params.id}/>
            <Input className='col-xs-6 mb15 clear-left' require bindValidator={this} channel='form' label='会員名（姓)' type='text' name='last_name' value={this.state.last_name} onChange={this.onChange.bind(this, 'last_name')}/>
            <Input className='col-xs-6 mb15' require bindValidator={this} channel='form' label='会員名（名)' type='text' name='first_name' value={this.state.first_name} onChange={this.onChange.bind(this, 'first_name')}/>
            <Input className='col-xs-6 mb15 clear-left' require bindValidator={this} channel='form' label='カナ（姓)' type='text' name='last_name_kana' value={this.state.last_name_kana} onChange={this.onChange.bind(this, 'last_name_kana')}/>
            <Input className='col-xs-6 mb15' require bindValidator={this} channel='form' label='カナ（名)' type='text' name='first_name_kana' value={this.state.first_name_kana} onChange={this.onChange.bind(this, 'first_name_kana')}/>
            <DatePicker className='col-xs-6 mb15 clear-left' dateFormat='YYYY年MM月DD日' placeholder='YYYY年MM月DD日' require bindValidator={this} channel='form' label='生年月日' type='text' name='birthday' value={this.state.birthday} onChange={this.onChangeDate.bind(this, 'birthday')}/>
            <Input className='col-xs-6 mb15' require bindValidator={this} channel='form' label='メールアドレス' type='email' require bindValidator={this} channel='form' name='email' value={this.state.email} onChange={this.onChange.bind(this, 'email')}/>
            <CoupleInput className='col-xs-6 mb15 clear-left' require bindValidator={this} channel='form' label='' labelMin='郵便番号１' labelMax='郵便番号2' valueMin={this.state.post_code_1} valueMax={this.state.post_code_2} onChangeMin={this.onChange.bind(this, 'post_code_1')} onChangeMax={this.onChange.bind(this, 'post_code_2')}/>
            <DropDown className='col-xs-6 mb15' label='都道府県' require bindValidator={this} channel='form' options={this.state.dataLocation} keyName='key' valueName='value' name='prefecture' value={this.state.prefecture} onChange={this.onChange.bind(this, 'prefecture')}/>
            <Input className='col-xs-6 mb15 clear-left' require bindValidator={this} channel='form' label='住所１' type='text' name='address_1' value={this.state.address_1} onChange={this.onChange.bind(this, 'address_1')}/>
            <Input className='col-xs-6 mb15' require bindValidator={this} channel='form' label='住所2' type='text' name='address_2' value={this.state.address_2} onChange={this.onChange.bind(this, 'address_2')}/>
            <InputTel className='col-xs-12 mb15' require bindValidator={this} channel='form' labelTel1='電話番号１' labelTel2='電話番号2' labelTel3='電話番号3' tel1={this.state.tel_1} tel2={this.state.tel_2} tel3={this.state.tel_3} onChangeTel1={this.onChange.bind(this, 'tel_1')} onChangeTel2={this.onChange.bind(this, 'tel_2')} onChangeTel3={this.onChange.bind(this, 'tel_3')} type='text' name='address_2' value={this.state.address_2} onChange={this.onChange.bind(this, 'address_2')}/>
            <DropDown className='col-xs-3 mb15' label='性別' require bindValidator={this} channel='form' options={this.state.listGender} keyName='id' valueName='value' name='gender' value={this.state.gender} onChange={this.onChange.bind(this, 'gender')}/>
            <div className={`col-xs-12 mb15 ${this.state.children.length > 0 ? 'mb15' : ''}`}>
              {
                this.state.children.map((item, index) => {
                  return(
                    <div className='row'>
                      <Input changeOnBlur={true} className='col-xs-3 mb15' label={`子供${this.state.children.length > 1 ? index + 1 : ''}`} name={`name${index}`} value={item.name} onChange={this.onChangeItem.bind(this, 'name', index)}/>
                      <DropDown className='col-xs-3 mb15' label='性別' options={this.state.listGender} keyName='id' valueName='value' name={`gender${index}`} value={item.gender} onChange={this.onChangeItem.bind(this, 'gender', index)}/>
                      <DatePicker className='col-xs-3 mb15' dateFormat='YYYY年MM月DD日' placeholder='YYYY年MM月DD日' label='生年月日' name={`birthday${index}`} value={item.birthday} onChange={this.onChangeDateItem.bind(this, 'birthday', index)}/>
                      <div className='col-xs-3 mb15 pt25'>
                        <button className='btn-confirm btn-red' onClick={this.deleteChildrent.bind(this, index)}>削除</button>
                      </div>
                    </div>
                  )
                })
              }
              <div className='col-xs-12 pl0 pr0'>
                <button className='btn-confirm' onClick={this.createChildrent.bind(this)}>子供を追加</button>
              </div>
            </div>
            <div className='col-xs-12'/>
            <Text className='col-xs-6 mb15' label='登録日' type='text' name='created_at' value={this.state.created_at} onChange={this.onChange.bind(this, 'created_at')}/>
            <Text className='col-xs-6 mb15' label='更新日' type='text' name='updated_at' value={this.state.updated_at} onChange={this.onChange.bind(this, 'updated_at')}/>
            <Text className='col-xs-6 mb15' label='前回予約' type='text' name='past_booking_date' value={this.state.past_booking_date}/>
            <Text className='col-xs-6 mb15' label='直近予約' type='text' name='next_booking_date' value={this.state.next_booking_date}/>

            <div className='col-xs-12 pt15'>
              <ListDelivery id={this.props.params.id}/>
            </div>
            <div className='col-xs-12 pt15'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.createCustomer.bind(this)}>保存</button>
              <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Add.defaultProps={
  validators: {
    form: []
  },
  dataList: [],
  dataLocation: [],
}

function bindStateToProps(state) {
  return {
    dataList: state.listCustomer.data,
    dataLocation: state.systemData.prefectures
  }
}

export default connect(bindStateToProps)(withRouter(Add))
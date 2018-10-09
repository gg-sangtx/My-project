import React from 'react';
import WrapBlockEdit from './WrapBlockEdit.jsx';
import {Text, DropDown, DatePicker, TimePicker, Input} from 'components/inputform';
import {Datatable} from 'components/datatable';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';
import header from 'constants/header';
import ListItemEdit from './ListItemEdit.jsx';
import {ShowIf} from 'components/utils';
import Modal from 'react-modal';
import {Booking} from 'api';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import * as CONFIG from 'constants/datetime';
import moment from 'moment';

let checkValue;

class Edit extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageData: {
        number: 0,
        size: 50,
        totalElements: 0
      },
      modalIsOpen: false,
      deleteLoading: false,
      messageDelete: 'キャンセルしてもよろしいですか?',
      booking_children: [],
      booking_plan_options: [],
      header: [
        { name: 'オプション名', width: 200 },
        { name: 'オプションコード', width: 150 },
        { name: '金額', width: 150 },
        { name: '操作', width: 70, minWidth: 70 }
      ],
      planOptions: [],
      costumes: [],
      dataPlan: [],
      dataBookingHours: [],
      sexData: [{id: 1, value: '男性'},{id: 2, value: '女性'}],
      booking_code: '',
      branch_number: '',
      booking_payment_type: '',
      payment_trade_number: '',
      studio_name: '',
      plan_id: '',
      plan_price: '',
      booking_date: '',
      booking_status_id: '',
      booking_hour_id: '',
      customer_id: '',
      customer_first_name: '',
      customer_last_name: '',
      customer_first_name_kana: '',
      customer_last_name_kana: '',
      customer_postal_code1: '',
      customer_postal_code2: '',
      customer_address: '',
      customer_tel: '',
      customer_email: '',
      coupon_code: '',
      coupon_id: '',
      coupon_code_loading: false,
      coupon_code_err: false,
      studio_id:'',
      edit_booking_plan_options: [],
      delete_booking_plan_option_ids: [],
      edit_booking_childrens: [],
      statusChecking: '',
      type_date: ''
    }
  }

  componentDidMount() {
    this.getDetail(this.props.params.id);
    this.getPlanOption();
    this.getCostumes();
    this.getListPlan();
  }

  getDetail(id) {
    Booking.actions.detail.request({id: id}).then(res => {
      if(res.data) {
        let Data = res.data.data;
        let DataBooking = Data.booking;
        // data booking
        this.state.booking_code = DataBooking.booking_code + '-' + DataBooking.branch_number || '';
        this.state.booking_payment_type = DataBooking.booking_payment_type || '';
        this.state.payment_trade_number = DataBooking.payment_trade_number || '';
        this.state.booking_status_name = DataBooking.booking_status_name || '';
        this.state.studio_name = DataBooking.studio_name || '';
        this.state.plan_id = DataBooking.plan_id || '';
        this.state.plan_price = DataBooking.plan_price || '';
        this.state.booking_date = new Date(DataBooking.booking_date) || '';
        this.state.booking_hour_id = DataBooking.booking_hour_id || '';
        this.state.studio_id = DataBooking.studio_id || '',
        this.state.booking_status_id = DataBooking.booking_status_id | '';
        // data customer
        this.state.customer_id = DataBooking.customer_id || '';
        this.state.customer_first_name = DataBooking.customer_first_name || '';
        this.state.customer_last_name = DataBooking.customer_last_name || '';
        this.state.customer_first_name_kana = DataBooking.customer_first_name_kana || '';
        this.state.customer_last_name_kana = DataBooking.customer_last_name_kana || '';
        this.state.customer_postal_code1 = DataBooking.customer_postal_code1 || '';
        this.state.customer_postal_code2 = DataBooking.customer_postal_code2 || '';
        this.state.customer_address = DataBooking.customer_address1 ? (DataBooking.customer_address2 ? (DataBooking.customer_address1 + DataBooking.customer_address2) : DataBooking.customer_address1) : '';
        this.state.customer_tel = DataBooking.customer_tel1 + (DataBooking.customer_tel2 ? ('-' + DataBooking.customer_tel2) : '') + (DataBooking.customer_tel3 ? ('-' + DataBooking.customer_tel3) : '');
        this.state.customer_email = DataBooking.customer_email || '';
        this.state.coupon_code = DataBooking.coupon_code || '';
        this.state.coupon_id = DataBooking.coupon_id || '';
        // data booking_plan_options
        this.state.booking_plan_options = Data.booking_plan_options || [];
        // data booking_children
        this.getBookingChildren(Data.booking_children);
        this.setState({...this.state})
        this.checkBookingTime('init');
        this.getListBookingHours();
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getBookingChildren(data) {
    if(data.length > 0) {
      data.map(item => {
        let newItem = {
          id: item.id,
          booking_id: item.booking_id,
          costumes: [],
          name: item.name,
          sex: item.sex
        }
        item.costumes.map(itemImage => {
          let newItemImage = {
            costume_id: itemImage.id,
            costume_code: itemImage.code || '',
          }
          if(itemImage.costume_images.length > 0) {
            newItemImage.image = itemImage.costume_images[0].image_url || ''
          } else {
            newItemImage.image = ''
          }
          newItem.costumes.push(newItemImage)
        })
        this.state.booking_children.push(newItem);
      })
    } else {
      this.state.booking_children = []
    }
    this.setState({...this.state})
  }

  getPlanOption() {
    Booking.actions.getPlanOption.request().then(res => {
      if(res.data) {
        this.state.planOptions = res.data.data.planOptions;
        this.setState({...this.state})
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getCostumes() {
    Booking.actions.getCostumes.request().then(res => {
      if(res.data) {
        this.state.costumes = res.data.data.costumes;
        this.setState({...this.state})
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getListPlan() {
    Booking.actions.getPlan.request().then(res => {
      if(res.data) {
        this.state.dataPlan = res.data.data.plans;
        this.setState({...this.state})
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getListBookingHours() {
    Booking.actions.getBookingHours.request({studio_id: this.state.studio_id}).then(res => {
      if(res.data) {
        this.state.dataBookingHours = res.data.data.bookingHours;
        this.setState({...this.state})
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  onChange(name, e) {
    if(name == 'coupon_code') {
      clearTimeout(checkValue);
    }
    this.state[name] = e.target.value;
    this.setState({...this.state}, () => {
      if(name == 'coupon_code') {
        this.checkValue()
      }
    });
    if(name == 'booking_hour_id') {
      this.checkBookingTime();
    }
    if(name == 'plan_id') {
      this.checkPrice()
    }
  }

  checkValue() {
    let self = this;
    if(this.state.coupon_code) {
      checkValue = setTimeout(function(){
        self.state.coupon_code_loading = true;
        self.setState({...self.state})
        Booking.actions.checkCoupons.request({code: self.state.coupon_code}).then(res => {
          let Data = {};
          if(res.data) {
            let Data = res.data.data.coupon;
            let DataStudio = res.data.data.studios;
            if (DataStudio.findIndex(item => item.id == self.state.studio_id) != -1 && Data.type == 3) {
              self.state.coupon_id = Data.id;
              self.state.coupon_code_err = false;
              Toastr(msg.couponSafe, 'success');
            } else {
              self.state.coupon_id = '';
              self.state.coupon_code_err = true;
              Toastr(msg.couponNotFound, 'error');
            }
          }
          self.state.coupon_code_loading = false;
          self.setState({...self.state})
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
          self.state.coupon_code_err = true;
          self.state.coupon_code_loading = false;
          self.setState({...self.state})
        })
      }, 1000)
    } else {
      this.state.coupon_code_err = false;
      this.setState({...this.state})
    }
  }

  onChangeDate(name, e) {
    this.state[name] = e;
    this.setState({...this.state});
    if(name == 'booking_date') {
      this.checkBookingTime();
    }
  }

  onChangePlan(value, index) {
    this.state.booking_plan_options[index] = value;
    this.checkExistPlan(value);
  }

  checkExistPlan(Item) {
    let indexEdit = this.state.edit_booking_plan_options.findIndex(x => x.id == Item.id);
    if(indexEdit != -1) {
      this.state.edit_booking_plan_options[indexEdit] = Item;
    } else {
      this.state.edit_booking_plan_options.push(Item);
    }
  }

  deleteItem(planId) {
    let indexExist = this.state.edit_booking_plan_options.findIndex(x => x.id == planId);
    let indexList = this.state.booking_plan_options.findIndex(x => x.id == planId);
    if (indexExist != -1) {
      this.state.edit_booking_plan_options.splice(indexExist, 1);
    }
    if (indexList != -1) {
      this.state.booking_plan_options.splice(indexList, 1);
    }
    this.state.delete_booking_plan_option_ids.push(planId);
    this.setState({...this.state})
  }

  onChangeItem(name, index, e) {
    this.state.booking_children[index][name] = e.target.value;
    this.checkExistItem(this.state.booking_children[index]);
    this.setState({...this.state})
  }

  onChangeImageItem(name, indexChildren, indexItem, e) {
    this.state.booking_children[indexChildren].costumes[indexItem].costume_id = e.target.value;
    this.state.booking_children[indexChildren].costumes[indexItem].image = this.state.costumes[this.state.costumes.findIndex(x => x.id == e.target.value)].costume_images.length > 0 ? this.state.costumes[this.state.costumes.findIndex(x => x.id == e.target.value)].costume_images[0].image_url : '';
    this.state.booking_children[indexChildren].costumes[indexItem].costume_code = this.state.costumes[this.state.costumes.findIndex(x => x.id == e.target.value)].code || '';
    this.checkExistItem(this.state.booking_children[indexChildren]);
    this.setState({...this.state})
  }

  checkExistItem(Item) {
    let indexEdit = this.state.edit_booking_childrens.findIndex(x => x.id == Item.id);
    if(indexEdit != -1) {
      this.state.edit_booking_childrens[indexEdit] = Item;
    } else {
      this.state.edit_booking_childrens.push(Item);
    }
  }

  getParams() {
    let params = {
      plan_id: this.state.plan_id,
      plan_price: this.state.plan_price ? this.state.plan_price : 0,
      date: this.state.booking_date ? moment(this.state.booking_date).format(CONFIG.DateFormat) : null,
      booking_hour_id: this.state.booking_hour_id,
      coupon_id: this.state.coupon_id || null
    }

    if(this.state.edit_booking_plan_options.length > 0) {
      let edit_booking_plan_options = [];
      this.state.edit_booking_plan_options.map(item => {
        let newItem = {
          id: item.id,
          plan_option_id: item.plan_option_id,
          price: item.price
        }
        edit_booking_plan_options.push(newItem);
      })
      params.edit_booking_plan_options = edit_booking_plan_options;
    }

    if (this.state.delete_booking_plan_option_ids.length > 0) {
      params.delete_booking_plan_option_ids = this.state.delete_booking_plan_option_ids;
    }

    if (this.state.edit_booking_childrens.length > 0) {
      let edit_booking_childrens = [];
      this.state.edit_booking_childrens.map(item => {
        let newItem = {
          id: item.id || '',
          name: item.name || '',
          sex: item.sex || '',
          costume_ids: []
        }
        item.costumes.map(imageItem => {
          newItem.costume_ids.push(imageItem.costume_id)
        })
        edit_booking_childrens.push(newItem)
      })
      params.edit_booking_childrens = edit_booking_childrens;
    }
    return params
  }

  editBooking() {
    if(this.state.statusChecking == 'danger') {
      this.checkBooking.focus();
    } else {
      if(this.validateSubmitForm()) {
        this.state.loading = true;
        this.setState({...this.state})
        let params = this.getParams();
        Booking.actions.edit.request({id: this.props.params.id}, params).then(res => {
          Toastr(msg.editBooking, 'success');
          this.goBack();
        }).catch(err => {
          if(err.response && err.response.data.errors.length > 0) {
            err.response.data.errors.map((errors, i) => {
              Toastr(errors, 'error');
            })
          } else {
            Toastr(msg.systemFail, 'error');
          }
          this.state.loading = false;
          this.setState({...this.state});
        })
      }
    }
  }

  validateSubmitForm() {
    let pass = true;
    if (this.state.coupon_code_err == true) {
      pass = false;
      Toastr(msg.couponNotFound, 'error');
    } else {
      this.props.validators['form'].map(validator => {
        if(pass) {
          pass = validator.validate();
        } else {
          validator.validate();
        }
      })
    }
    return pass;
  }

  componentWillUnmount() {
    this.props.validators['form'] = [];
  }

  openModal() {
    this.state.modalIsOpen = true;
    this.setState({
      ...this.state
    })
  }

  closeModal() {
    this.state.modalIsOpen = false;
    this.setState({
      ...this.state
    })
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  goBack() {
    this.props.dispatch({type: 'BOOKING_GO_BACK'});
    this.props.history.push('/bookings');
  }

  getPrice(value) {
    String.prototype.splice = function(idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    let result = value;
    if(String(result).length < 3) {
      return result
    } else {
      for (let j = Number(String(result).length); j > 0;) {
        j = j - 3;
        if(j > 0) {
          result = String(result).splice(j, 0, ",");
        }
      }
      return result
    }
  }

  checkBookingTime(type) {
    if(this.state.booking_date) {
      if(type != 'init') {
        this.state.statusChecking = 'loading';
        this.setState({...this.state});
      }
      let params = {
        booking_id: this.props.params.id,
        studio_id: this.state.studio_id,
        date: moment(this.state.booking_date).format(CONFIG.DateFormat),
        booking_hour_id: this.state.booking_hour_id
      }
      Booking.actions.checkBookingTime.request(params).then(res => {
        if(res.data) {
          if(type == 'init') {
            this.state.type_date = res.data.data.result.type_date;
          } else {
            let result = res.data.data.result.is_valid;
            this.state.statusChecking = result == true ? 'safe' : 'danger';
            this.state.type_date = res.data.data.result.type_date;
            this.checkPrice();
          }
          this.setState({...this.state})
        }
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.state.statusChecking = '';
        this.setState({...this.state});
      })
    }
  }

  checkPrice() {
    if(this.state.type_date == 'VALID') {
      this.state.plan_price = this.state.dataPlan[this.state.dataPlan.findIndex(x => x.id == this.state.plan_id)].weekday_price
    } else {
      this.state.plan_price = this.state.dataPlan[this.state.dataPlan.findIndex(x => x.id == this.state.plan_id)].holiday_price
    }
    this.setState({...this.state})
  }

  cancelBooking() {
    this.state.deleteLoading = true;
    this.setState({...this.state});
    Booking.actions.cancelBooking.request('',{id: this.props.params.id}).then(res => {
      Toastr(msg.editBooking, 'success');
      this.goBack();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.deleteLoading = false;
      this.setState({...this.state});
    })
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block mb20'>
          <h2 className='heading-2'>予約情報 <small>編集</small></h2>
          <ShowIf condition={this.state.booking_status_id == 1 || this.state.booking_status_id == 3}>
            <button className='btn-addnew btn-red' onClick={this.openModal.bind(this)}>予約キャンセル</button>
          </ShowIf>
        </div>
        <WrapBlockEdit title='予約情報'>
          <div className='row mb15'>
            <Text label='予約コード' value={this.state.booking_code} className='col-xs-3'/>
          </div>
          <div className='row mb15'>
            <Text label='決済方法' value={this.state.booking_payment_type} className='col-xs-3'/>
            <Text label='決済取引番号' value={this.state.payment_trade_number} className='col-xs-3'/>
            <Text label='決済ステータス' value={this.state.booking_status_name} className='col-xs-3'/>
          </div>
          <div className='row mb15'>
            <Text label='スタジオ名' value={this.state.studio_name} className='col-xs-3'/>
          </div>
          <div className='row mb15'>
            <DropDown label='プラン' value={this.state.plan_id} onChange={this.onChange.bind(this, 'plan_id')} require={true} bindValidator={this} channel='form' options={this.state.dataPlan} keyName='id' valueName='name' className='col-xs-4'/>
            <Text label='金額' value={'¥' + this.getPrice(this.state.plan_price)} className='col-xs-4'/>
            <div className={`col-xs-4 no-gutter wrap-input-search ${this.state.coupon_code_loading ? 'disabled' : ''}`}>
              <Input label='クーポンコード' value={this.state.coupon_code} onChange={this.onChange.bind(this, 'coupon_code')} className='col-xs-12'/>
            </div>
          </div>
          <div className='row'>
            <DatePicker value={this.state.booking_date} onChange={this.onChangeDate.bind(this, 'booking_date')} require={true} bindValidator={this} channel='form' label='日付' className='col-xs-4'/>
            <DropDown value={this.state.booking_hour_id} onChange={this.onChange.bind(this, 'booking_hour_id')} require={true} bindValidator={this} channel='form' options={this.state.dataBookingHours} keyName='id' valueName='time' label='開始時刻' name='開始時刻' className='col-xs-4'/>
            <div className='col-xs-4 wrap-check-date'>
              <div className={`item-check-date ${this.state.statusChecking}`}>{msg.existDate}</div>
              <input className='hidden-input' ref={(checkBooking) => {this.checkBooking = checkBooking}}/>
            </div>
          </div>
        </WrapBlockEdit>
        <WrapBlockEdit title='予約オプション情報'>
          <Datatable
            title={null}
            showTitle={false}
            header={this.state.header}
            pageData={this.state.pageData}
            dataList={this.state.booking_plan_options}
            numberColumnHeader={4}
          >
            <ListItemEdit dataOptions={this.state.planOptions} deleteItem={this.deleteItem.bind(this)} onChange={this.onChangePlan.bind(this)}/>
          </Datatable>
        </WrapBlockEdit>
        <WrapBlockEdit title='会員情報'>
          <div className='row mb15'>
            <Text label='会員ID' value={this.state.customer_id} className='col-xs-4'/>
          </div>
          <div className='row mb15'>
            <Text label='会員名（姓）' value={this.state.customer_last_name} className='col-xs-4'/>
            <Text label='会員名（名）' value={this.state.customer_first_name} className='col-xs-4'/>
          </div>
          <div className='row mb15'>
            <Text label='会員名（姓カナ)' value={this.state.customer_last_name_kana} className='col-xs-4'/>
            <Text label='会員名（名カナ）' value={this.state.customer_first_name_kana} className='col-xs-4'/>
          </div>
          <div className='row mb15'>
            <Text label='郵便番号' value={this.state.customer_postal_code1 + '-' + this.state.customer_postal_code2} className='col-xs-4'/>
            <Text label='住所' showHtml={true} value={this.state.customer_address} className='col-xs-4'/>
          </div>
          <div className='row mb15'>
            <Text label='電話番号' value={this.state.customer_tel} className='col-xs-4'/>
            <Text label='メールアドレス' value={this.state.customer_email} className='col-xs-4'/>
          </div>
        </WrapBlockEdit>
        {
          this.state.booking_children.map((item, index) => {
            if (index == this.state.booking_children.length - 1) {
              return (
                <WrapBlockEdit title={this.state.booking_children.length == 1 ? `子供情報` : `子供情報${index + 1}`} key={index} hasBottomBorder={true}>
                  <div className='row mb15'>
                    <Input label='名前' value={item.name} onChange={this.onChangeItem.bind(this, 'name', index)} require={true} bindValidator={this} channel='form' className='col-xs-4'/>
                    <DropDown label='性別' value={item.sex} onChange={this.onChangeItem.bind(this, 'sex', index)} options={this.state.sexData} require={true} bindValidator={this} channel='form' keyName='id' valueName='value' className='col-xs-4'/>
                  </div>
                  <div className='wrap-list-costume'>
                    {
                      item.costumes.map((itemImage, i) => {
                        return(
                          <div className='wrap-costume-result' key={i}>
                            <label className="form-label">{`衣装 ${i + 1}`}</label>
                            <div className='wrap-image mb15'>
                              <ShowIf condition={itemImage.image != ''}>
                                <img src={itemImage.image} alt={itemImage.costume_code} className='img-result'/>
                              </ShowIf>
                              <ShowIf condition={itemImage.image == ''}>
                                <span>データなし</span>
                              </ShowIf>
                            </div>
                            <DropDown value={itemImage.costume_id} onChange={this.onChangeImageItem.bind(this, 'costume_id', index, i)} label={`衣装${i + 1} コード`} options={this.state.costumes} keyName='id' valueName='code' className='mb0'/>
                          </div>
                        )
                      })
                    }
                  </div>
                </WrapBlockEdit>
              )
            } else {
              return (
                <WrapBlockEdit title={`子供情報${index + 1}`} key={index}>
                  <div className='row mb15'>
                    <Input label='名前' value={item.name} onChange={this.onChangeItem.bind(this, 'name', index)} require={true} bindValidator={this} channel='form' className='col-xs-4'/>
                    <DropDown label='性別' value={item.sex} onChange={this.onChangeItem.bind(this, 'sex', index)} options={this.state.sexData} require={true} bindValidator={this} channel='form' keyName='id' valueName='value' className='col-xs-4'/>
                  </div>
                  <div className='wrap-list-costume'>
                    {
                      item.costumes.map((itemImage, i) => {
                        return(
                          <div className='wrap-costume-result' key={i}>
                            <label className="form-label">{`衣装 ${i + 1}`}</label>
                            <div className='wrap-image mb15'>
                              <ShowIf condition={itemImage.image != ''}>
                                <img src={itemImage.image} alt={itemImage.costume_code} className='img-result'/>
                              </ShowIf>
                              <ShowIf condition={itemImage.image == ''}>
                                <span>データなし</span>
                              </ShowIf>
                            </div>
                            <DropDown value={itemImage.costume_id} onChange={this.onChangeImageItem.bind(this, 'costume_id', index, i)} label={`衣装${i + 1} コード`} options={this.state.costumes} keyName='id' valueName='code' className='mb0'/>
                          </div>
                        )
                      })
                    }
                  </div>
                </WrapBlockEdit>
              )
            }
          })
        }
        <div className='row'>
          <div className='col-xs-12 pt15'>
            <button className='btn-confirm mr20 has-loading' onClick={this.editBooking.bind(this)} disabled={this.state.loading}>保存</button>
            <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>確認</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this)}></button>
          </div>
          <div className='wrap-content-modal'>
            <p className='p-14'>{this.state.messageDelete}</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.cancelBooking.bind(this)}>OK</button>
              <button className='btn-close-confirm' disabled={this.state.deleteLoading ? true : false} onClick={this.closeModal.bind(this)}>閉じる</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

Edit.defaultProps = {
  validators: {
    form: []
  }
}

export default connect()(withRouter(Edit));

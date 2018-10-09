import React from 'react';
import WrapBlockEdit from './WrapBlockEdit.jsx';
import {Text, DropDown, DatePicker, TimePicker, Input} from 'components/inputform';
import {Datatable} from 'components/datatable';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';
import header from 'constants/header';
import {ShowIf} from 'components/utils';
import Modal from 'react-modal';
import {StaffBooking} from 'api';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import * as CONFIG from 'constants/datetime';
import moment from 'moment';

class Detail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      booking_children: [],
      booking_plan_options: [],
      header: [
        { name: 'オプション名', width: 200 },
        { name: 'オプションコード', width: 150 },
        { name: '値', width: 150 },
        { name: '金額', width: 150 },
        { name: '操作', width: 70, minWidth: 70 }
      ],
      planOptions: [],
      costumes: [],
      dataPlan: [],
      dataBookingHours: [],
      sexData: [{id: 1, value: '男性'},{id: 2, value: '女性'}],
      booking_code: '',
      booking_payment_type: '',
      payment_trade_number: '',
      studio_name: '',
      plan_id: '',
      price: '',
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
      studio_id:'',
      statusChecking: '',
      type_date: ''
    }
  }

  componentDidMount() {
    this.getDetail(this.props.params.id);
  }

  getDetail(id) {
    StaffBooking.actions.detail.request({id: id}).then(res => {
      if(res.data) {
        let Data = res.data.data;
        let DataBooking = Data.booking;
        // data booking
        this.state.booking_code = DataBooking.booking_code || '';
        this.state.studio_name = DataBooking.studio_name || '';
        this.state.plan_name = DataBooking.plan_name || '';
        this.state.booking_date = moment(DataBooking.booking_date_time).format('YYYY年MM月DD日 HH:mm') || '';
        // data customer
        this.state.customer_first_name = DataBooking.customer_first_name || '';
        this.state.customer_last_name = DataBooking.customer_last_name || '';
        this.state.customer_first_name_kana = DataBooking.customer_first_name_kana || '';
        this.state.customer_last_name_kana = DataBooking.customer_last_name_kana || '';
        // data booking_plan_options
        this.state.booking_plan_options = Data.booking_plan_options || [];
        // data booking_children
        this.state.booking_children = Data.booking_children
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

  goBack() {
    this.props.dispatch({type: 'STAFF_BOOKING_GO_BACK'});
    this.props.history.push('/staff/bookings');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block mb20'>
          <h2 className='heading-2'>予約情報 <small>編集</small></h2>
        </div>
        <WrapBlockEdit title='予約情報'>
          <div className='row mb15'>
            <Text label='予約コード' value={this.state.booking_code} className='col-xs-4'/>
          </div>
          <div className='row'>
            <Text value={this.state.booking_date} label='日付' className='col-xs-4'/>
            <Text label='スタジオ名' value={this.state.studio_name} className='col-xs-4'/>
            <Text label='プラン' value={this.state.plan_name} className='col-xs-4'/>
          </div>
        </WrapBlockEdit>
        <WrapBlockEdit title='予約オプション情報'>
          <div>
            <ShowIf condition={this.state.booking_plan_options && this.state.booking_plan_options.length > 0}>
              <div className='row'>
                {
                  this.state.booking_plan_options.map((item, i) => {
                    return(
                      <p className={`col-xs-12 ${this.state.booking_plan_options.length != i + 1 ? 'mb15' : 'mb0'}`} key={i}>{item.plan_option_name}</p>
                    )
                  })
                }
              </div>
            </ShowIf>
            <ShowIf condition={this.state.booking_plan_options && this.state.booking_plan_options.length == 0}>
              <span>データなし</span>
            </ShowIf>
          </div>
        </WrapBlockEdit>
        <WrapBlockEdit title='会員情報'>
          <div className='row mb15'>
            <Text label='会員名（姓）' value={this.state.customer_last_name} className='col-xs-4'/>
            <Text label='会員名（名）' value={this.state.customer_first_name} className='col-xs-4'/>
          </div>
          <div className='row'>
            <Text label='会員名（姓カナ)' value={this.state.customer_last_name_kana} className='col-xs-4'/>
            <Text label='会員名（名カナ）' value={this.state.customer_first_name_kana} className='col-xs-4'/>
          </div>
        </WrapBlockEdit>
        {
          this.state.booking_children.map((item, index) => {
            if (index == this.state.booking_children.length - 1) {
              return (
                <WrapBlockEdit title={this.state.booking_children.length == 1 ? `子供情報` : `子供情報${index + 1}`} key={index} hasBottomBorder={true}>
                  <div className='row mb15'>
                    <Text label='名前' value={item.name} className='col-xs-4'/>
                    <Text label='性別' value={item.sex == 1 ? '男の子' : '女の子'} className='col-xs-4'/>
                  </div>
                  <div className='wrap-list-costume'>
                    {
                      item.costumes.map((itemImage, i) => {
                        return(
                          <div className='wrap-costume-result' key={i}>
                            <label className="form-label">{`衣装 ${i + 1}`}</label>
                            <div className='wrap-image mb15'>
                              <ShowIf condition={itemImage.costume_images.length > 0}>
                                <img src={itemImage.costume_images[0].image_url} alt={itemImage.costume_code} className='img-result'/>
                              </ShowIf>
                              <ShowIf condition={itemImage.costume_images.length == 0}>
                                <span>データなし</span>
                              </ShowIf>
                            </div>
                            <Text value={itemImage.code} label={`衣装${i + 1} コード`} className='mb0'/>
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
                    <Text label='名前' value={item.name} className='col-xs-4'/>
                    <Text label='性別' value={item.sex == 1 ? '男の子' : '女の子'} className='col-xs-4'/>
                  </div>
                  <div className='wrap-list-costume'>
                    {
                      item.costumes.map((itemImage, i) => {
                        return(
                          <div className='wrap-costume-result' key={i}>
                            <label className="form-label">{`衣装 ${i + 1}`}</label>
                            <div className='wrap-image mb15'>
                              <ShowIf condition={itemImage.costume_images.length > 0}>
                                <img src={itemImage.costume_images[0].image_url} alt={itemImage.costume_code} className='img-result'/>
                              </ShowIf>
                              <ShowIf condition={itemImage.costume_images.length == 0}>
                                <span>データなし</span>
                              </ShowIf>
                            </div>
                            <Text value={itemImage.code} label={`衣装${i + 1} コード`} className='mb0'/>
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
            <button className='btn-close-confirm' onClick={this.goBack.bind(this)}>戻る</button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(withRouter(Detail));

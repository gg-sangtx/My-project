import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, GroupRadio, DropDown, ReactDateTimeRangePicker} from 'components/inputform';
import {connect} from 'react-redux';
import {News} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import moment from 'moment';
import * as CONFIG from 'constants/datetime';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      // order_id: '',
      product_code: '',
      product_name: '',
      customer_id: '',
      customer_name: '',
      customer_email: '',
      customer_tel: '',
      booking_code: '',
      status: '',
      order_date_from: '',
      order_date_to: '',
      delivery_date_from: '',
      delivery_date_to: '',
      send_date_from: '',
      send_date_to: '',
      dataOrderStatus: [
        {value: 1, name: '新規受付'},
        {value: 2, name: '生産中'},
        {value: 3, name: '配送中'},
        {value: 4, name: '配送完了'},
        {value: 5, name: 'キャンセル'},
        {value: 6, name: '返品'}
      ]
    }
  }

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  onChangeDate(name, e) {
    this.setState({
      [name]: e
    })
  }

  onChangeStartDay(name, e) {
    this.state[name] = e ? moment(e).format(CONFIG.DateFormat) : '';
    this.setState({...this.state})
  }

  onChangeEndDay(name, e) {
    this.state[name] = e ? moment(e).format(CONFIG.DateFormat) : '';
    this.setState({...this.state})
  }

  Collapse() {
    this.state.isOpen = !this.state.isOpen;
    this.setState({
      ...this.state
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.loading == false) {
      this.state.search = false;
    }
    if(nextProps.goBack == true) {
      // this.state.order_id = nextProps.dataSearch.order_id;
      this.state.product_code = nextProps.dataSearch.product_code;
      this.state.product_name = nextProps.dataSearch.product_name;
      this.state.customer_id = nextProps.dataSearch.customer_id;
      this.state.customer_name = nextProps.dataSearch.customer_name;
      this.state.customer_email = nextProps.dataSearch.customer_email;
      this.state.customer_tel = nextProps.dataSearch.customer_tel;
      this.state.booking_code = nextProps.dataSearch.booking_code;
      this.state.status = nextProps.dataSearch.status;
      this.state.order_date_from = nextProps.dataSearch.order_date_from;
      this.state.order_date_to = nextProps.dataSearch.order_date_to;
      this.state.delivery_date_from = nextProps.dataSearch.delivery_date_from;
      this.state.delivery_date_to = nextProps.dataSearch.delivery_date_to;
      this.state.send_date_from = nextProps.dataSearch.send_date_from;
      this.state.send_date_to = nextProps.dataSearch.send_date_to;
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      // order_id: this.state.order_id ? this.state.order_id : '',
      product_code: this.state.product_code ? this.state.product_code : '',
      product_name: this.state.product_name ? this.state.product_name : '',
      customer_id: this.state.customer_id ? this.state.customer_id : '',
      customer_name: this.state.customer_name ? this.state.customer_name : '',
      customer_email: this.state.customer_email ? this.state.customer_email : '',
      customer_tel: this.state.customer_tel ? this.state.customer_tel : '',
      booking_code: this.state.booking_code ? this.state.booking_code : '',
      status: this.state.status ? this.state.status : '',
      order_date_from: this.state.order_date_from ? this.state.order_date_from : '',
      order_date_to: this.state.order_date_to ? this.state.order_date_to : '',
      delivery_date_from: this.state.delivery_date_from ? this.state.delivery_date_from : '',
      delivery_date_to: this.state.delivery_date_to ? this.state.delivery_date_to : '',
      send_date_from: this.state.send_date_from ? this.state.send_date_from : '',
      send_date_to: this.state.send_date_to ? this.state.send_date_to : '',
    }
    this.props.search(data);
    return;
  }

  render() {
    return (
      <div className='search-container'>
        <div className='title-collapse'>
          <h3 className='heading-3 bold'>検索条件</h3>
          <button className={`btn-collapse ${this.state.isOpen ? 'collaped' : ''}`} onClick={this.Collapse.bind(this)}></button>
        </div>
        <Collapse isOpened={this.state.isOpen}>
          <div className='wrap-collapse-content'>
            <form className='search-form'>
              <div className='col-xs-12'>
                {/*<Input className='col-xs-4 mb15' label='受注ID' type='text' name='order_id' value={this.state.order_id} onChange={this.onChange.bind(this, 'order_id')}/>*/}
                <Input className='col-xs-3 mb15' label='物販商品コード' type='text' name='product_code' value={this.state.product_code} onChange={this.onChange.bind(this, 'product_code')}/>
                <Input className='col-xs-3 mb15' label='物販商品名' type='text' name='product_name' value={this.state.product_name} onChange={this.onChange.bind(this, 'product_name')}/>
                <Input className='col-xs-3 mb15' label='会員ID' type='text' name='customer_id' value={this.state.customer_id} onChange={this.onChange.bind(this, 'customer_id')}/>
                <Input className='col-xs-3 mb15' label='会員名' type='text' name='customer_name' value={this.state.customer_name} onChange={this.onChange.bind(this, 'customer_name')}/>
                <Input className='col-xs-3 mb15' label='会員メールアドレス' type='text' name='customer_email' value={this.state.customer_email} onChange={this.onChange.bind(this, 'customer_email')}/>
                <Input className='col-xs-3 mb15' label='会員電話番号' type='text' name='customer_tel' value={this.state.customer_tel} onChange={this.onChange.bind(this, 'customer_tel')}/>
                <Input className='col-xs-3 mb15' label='予約情報コード' type='text' name='booking_code' value={this.state.booking_code} onChange={this.onChange.bind(this, 'booking_code')}/>
                <DropDown className='col-xs-3 mb15' label='ステータス' placeholder="ステータス" showPlaceholder={true} name='status' value={this.state.status} onChange={this.onChange.bind(this, 'status')} options={this.state.dataOrderStatus} keyName='value' valueName='name'/>
              </div>
              <div className='col-xs-12'>
                <ReactDateTimeRangePicker
                  timeFormat={false}
                  onChangeStartDay={this.onChangeStartDay.bind(this, 'order_date_from')}
                  onChangeEndDay={this.onChangeEndDay.bind(this, 'order_date_to')}
                  startDate={this.state.order_date_from}
                  endDate={this.state.order_date_to}
                  update={this.props.goBack}
                  label='受注日'
                  className='col-xs-12 col-sm-6 mb20'/>
                <ReactDateTimeRangePicker
                  timeFormat={false}
                  onChangeStartDay={this.onChangeStartDay.bind(this, 'delivery_date_from')}
                  onChangeEndDay={this.onChangeEndDay.bind(this, 'delivery_date_to')}
                  startDate={this.state.delivery_date_from}
                  endDate={this.state.delivery_date_to}
                  update={this.props.goBack}
                  label='配送指定日時'
                  className='col-xs-12 col-sm-6 mb20'/>
                <ReactDateTimeRangePicker
                  timeFormat={false}
                  onChangeStartDay={this.onChangeStartDay.bind(this, 'send_date_from')}
                  onChangeEndDay={this.onChangeEndDay.bind(this, 'send_date_to')}
                  startDate={this.state.send_date_from}
                  endDate={this.state.send_date_to}
                  update={this.props.goBack}
                  label='発送日'
                  className='col-xs-12 col-sm-6 mb20'/>
              </div>
              <div className='wrap-button'>
                <button className={`btn-submit-form${this.state.search == true ? ' has-loading' : ''}`} disabled={this.props.loading ? true : false} onClick={this.search.bind(this)}>検索する</button>
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    );
  }
}

Search.defaultProps = {
  dataSearch: {},
  goBack: false,
  studioCanWork: [],
}

function bindStateToProps(state) {
  return {
    dataSearch: state.order.dataSearch,
    goBack: state.order.goBack,
    studioCanWork: state.systemData.studioCanWork,
  }
}

export default connect(bindStateToProps)(Search)
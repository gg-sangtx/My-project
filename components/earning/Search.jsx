import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, DropDown, ReactDateTimeRangePicker} from 'components/inputform';
import {connect} from 'react-redux';
import {DateFormat, DateTimeFormat} from 'constants/datetime';
import moment from 'moment';
import {Booking, Earning} from 'api';
import * as CONFIG from 'constants/datetime';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      update: false,
      plan_code: '',
      studio_code: '',
      product_code: '',
      product_id: '',
      plan_ids: '',
      studio_ids: '',
      dataShow: ['is_has_booking', 'is_has_order'],
      date_from:moment().add(-1, 'months').add(1, 'days'),
      date_to: moment(),
      studios: this.props.studios,
      initData: true,
      products: [],
      dataPlan: [],
      dataOption: [{value: 'is_has_booking' , name: '予約金額'},{value: 'is_has_order', name: '物販商品金額'}],
      type_view: this.props.type_view
    }
  }

  componentDidMount() {
    this.getProduct();
    this.getListPlan();
  }

  getProduct() {
    let params = {
      is_sub_list: 1,
      limit: 0
    }
    Earning.actions.getPrduct.request(params).then(res => {
      if(res.data) {
        this.state.products = res.data.data.products;
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

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
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
    if(nextProps.studios != this.props.studios) {
      this.state.studios = nextProps.studios;
    }
    if(this.props.type_view != nextProps.type_view) {
      this.state.type_view = nextProps.type_view;
      if(nextProps.type_view == 'MONTHLY' && this.state.initData) {
        this.state.update = true;
        this.state.date_from = moment().add(-1, 'years').add(1, 'months');
        this.state.date_to = moment();
        this.setState({...this.state});
      } else if (this.state.initData) {
        this.state.update = true;
        this.state.date_from = moment((moment().format('YYYY-MM') + '-01'));
        this.state.date_to = moment(moment(this.state.date_from).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD'));
        this.setState({...this.state});
      }
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.state.initData = false;
    this.setState({...this.state});
    let data = {
      plan_code: this.state.plan_code ? this.state.plan_code : '',
      studio_code: this.state.studio_code ? this.state.studio_code : '',
      product_code: this.state.product_code ? this.state.product_code : '',
      product_id: this.state.product_id ? this.state.product_id : '',
      plan_ids: this.state.plan_ids ? this.state.plan_ids : '',
      studio_ids: this.state.studio_ids ? this.state.studio_ids : '',
      date_from: this.state.date_from ? this.state.date_from : '',
      date_to: this.state.date_to ? this.state.date_to : '',
      dataShow: this.state.dataShow ? this.state.dataShow : []
    }
    this.props.search(data);
    return;
  }

  onChangeStartDay(e) {
    this.state.update = false;
    this.state.date_from = e ? moment(e).format(DateTimeFormat) : '';
    this.setState({...this.state})
  }

  onChangeEndDay(e) {
    this.state.update = false;
    this.state.date_to = e ? moment(e).format(DateTimeFormat) : '';
    this.setState({...this.state})
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
              <div className='wrap-list-check-box'>
                <GroupCheckBox label='表示項目' data={this.state.dataOption} name='dataShow' value={this.state.dataShow} onChange={this.onChange.bind(this, 'dataShow')} keyName='value' valueName='name'/>
              </div>
              <div className='col-xs-12'>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='撮影費用コード' type='text' name='plan_code' value={this.state.plan_code} onChange={this.onChange.bind(this, 'plan_code')}/>
              </div>

              <div className='wrap-list-check-box'>
                <GroupCheckBox label='撮影費用タイプ名' data={this.state.dataPlan} name='plan_ids' value={this.state.plan_ids} onChange={this.onChange.bind(this, 'plan_ids')} keyName='id' valueName='name'/>
              </div>

              <div className='col-xs-12'>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='スタジオコード' type='text' name='studio_code' value={this.state.studio_code} onChange={this.onChange.bind(this, 'studio_code')}/>
              </div>

              <div className='wrap-list-check-box'>
                <GroupCheckBox label='スタジオ名' data={this.state.studios} name='studio_ids' value={this.state.studio_ids} onChange={this.onChange.bind(this, 'studio_ids')} keyName='id' valueName='name'/>
              </div>

              <div className='col-xs-12'>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='物販商品コード' type='text' name='product_code' value={this.state.product_code} onChange={this.onChange.bind(this, 'product_code')}/>
                <DropDown className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='物販商品名' placeholder='物販商品名' showPlaceholder={true} options={this.state.products} keyName='id' valueName='name' type='text' name='product_id' value={this.state.product_id} onChange={this.onChange.bind(this, 'product_id')}/>
              </div>

              <div className='col-xs-12'>
                <ReactDateTimeRangePicker
                  onChangeStartDay={this.onChangeStartDay.bind(this)}
                  onChangeEndDay={this.onChangeEndDay.bind(this)}
                  startDate={this.state.date_from}
                  endDate={this.state.date_to}
                  update={this.state.update}
                  label='期間'
                  dateFormat={this.state.type_view == 'MONTHLY' ? CONFIG.MonthFormat : CONFIG.DateFormat}
                  timeFormat={null}
                  className='col-xs-12 col-sm-6 mb20'/>
              </div>
              <div className='wrap-button text-center mt10 mb15 col-xs-12 no-gutter'>
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
  typeStaff: [],
  studios: [],
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    typeStaff: state.systemData.typeStaff,
    studios: state.systemData.listStudio,
    dataSearch: state.listStaff.dataSearch,
    goBack: state.listStaff.goBack,
  }
}

export default connect(bindStateToProps)(Search)

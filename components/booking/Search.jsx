import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, CoupleInput, ReactDateTimeRangePicker} from 'components/inputform';
import {connect} from 'react-redux';
import {DateFormat, DateTimeFormat} from 'constants/datetime';
import {ShowIf} from 'components/utils';
import moment from 'moment';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      listStudio: this.props.listStudio,
      data2: [{id: 1,name: '撮影前'}, {id: 2,name: 'キャンセル済み'}, {id: 3,name: '撮影後'}, {id: 4, name: '写真公開済み'}],
      data3: [{id: 1,name: '撮影前'}, {id: 3,name: '撮影後'}, {id: 4, name: '写真公開済み'}],
      booking_date_from: moment().startOf('day'),
      booking_date_to: '',
      booking_code: '',
      booking_statuses: [],
      customer_id: '',
      customer_name: '',
      customer_email: '',
      customer_tel: '',
      studio_code: '',
      studio_ids: [],
      staff_id: '',
      staff_name: '',
      staff_name_kana: '',
    }
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

  componentDidMount() {
    if(this.props.goBack == true) {
      this.state.booking_date_from = this.props.dataSearch.booking_date_from ? this.props.dataSearch.booking_date_from: '';
      this.state.booking_date_to = this.props.dataSearch.booking_date_to ? this.props.dataSearch.booking_date_to: '';
      this.state.booking_code = this.props.dataSearch.booking_code ? this.props.dataSearch.booking_code: '';
      this.state.booking_statuses = this.props.dataSearch.booking_statuses ? this.props.dataSearch.booking_statuses: [];
      this.state.customer_id = this.props.dataSearch.customer_id ? this.props.dataSearch.customer_id: '';
      this.state.customer_name = this.props.dataSearch.customer_name ? this.props.dataSearch.customer_name: '';
      this.state.customer_email = this.props.dataSearch.customer_email ? this.props.dataSearch.customer_email: '';
      this.state.customer_tel = this.props.dataSearch.customer_tel ? this.props.dataSearch.customer_tel: '';
      this.state.studio_code = this.props.dataSearch.studio_code ? this.props.dataSearch.studio_code: [];
      this.state.studio_ids = this.props.dataSearch.studio_ids ? this.props.dataSearch.studio_ids: '';
      this.state.staff_id = this.props.dataSearch.staff_id ? this.props.dataSearch.staff_id: '';
      this.state.staff_name = this.props.dataSearch.staff_name ? this.props.dataSearch.staff_name: '';
      this.state.staff_name_kana = this.props.dataSearch.staff_name_kana ? this.props.dataSearch.staff_name_kana: '';
      this.setState({...this.state});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.listStudio != nextProps.listStudio) {
      this.state.listStudio = nextProps.listStudio;
    }
    if(nextProps.goBack == true) {
      this.state.booking_date_from = nextProps.dataSearch.booking_date_from ? nextProps.dataSearch.booking_date_from: '';
      this.state.booking_date_to = nextProps.dataSearch.booking_date_to ? nextProps.dataSearch.booking_date_to: '';
      this.state.booking_code = nextProps.dataSearch.booking_code ? nextProps.dataSearch.booking_code: '';
      this.state.booking_statuses = nextProps.dataSearch.booking_statuses ? nextProps.dataSearch.booking_statuses: [];
      this.state.customer_id = nextProps.dataSearch.customer_id ? nextProps.dataSearch.customer_id: '';
      this.state.customer_name = nextProps.dataSearch.customer_name ? nextProps.dataSearch.customer_name: '';
      this.state.customer_email = nextProps.dataSearch.customer_email ? nextProps.dataSearch.customer_email: '';
      this.state.customer_tel = nextProps.dataSearch.customer_tel ? nextProps.dataSearch.customer_tel: '';
      this.state.studio_code = nextProps.dataSearch.studio_code ? nextProps.dataSearch.studio_code: [];
      this.state.studio_ids = nextProps.dataSearch.studio_ids ? nextProps.dataSearch.studio_ids: '';
      this.state.staff_id = nextProps.dataSearch.staff_id ? nextProps.dataSearch.staff_id: '';
      this.state.staff_name = nextProps.dataSearch.staff_name ? nextProps.dataSearch.staff_name: '';
      this.state.staff_name_kana = nextProps.dataSearch.staff_name_kana ? nextProps.dataSearch.staff_name_kana: '';
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      booking_date_from:this.state.booking_date_from ? this.state.booking_date_from : '',
      booking_date_to:this.state.booking_date_to ? this.state.booking_date_to : '',
      booking_code:this.state.booking_code ? this.state.booking_code : '',
      booking_statuses:this.state.booking_statuses ? this.state.booking_statuses : '',
      customer_id:this.state.customer_id ? this.state.customer_id : '',
      customer_name:this.state.customer_name ? this.state.customer_name : '',
      customer_email:this.state.customer_email ? this.state.customer_email : '',
      customer_tel:this.state.customer_tel ? this.state.customer_tel : '',
      studio_code:this.state.studio_code ? this.state.studio_code : '',
      studio_ids:this.state.studio_ids ? this.state.studio_ids : '',
      staff_id:this.state.staff_id ? this.state.staff_id : '',
      staff_name:this.state.staff_name ? this.state.staff_name : '',
      staff_name_kana:this.state.staff_name_kana ? this.state.staff_name_kana : ''
    }
    this.props.search(data);
    return;
  }

  onChangeStartDay(e) {
    this.state.booking_date_from = e ? moment(e).format(DateTimeFormat) : '';
    this.setState({...this.state})
  }

  onChangeEndDay(e) {
    this.state.booking_date_to = e ? moment(e).format(DateTimeFormat) : '';
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
              <div className='col-xs-12'>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='会員ID' type='text' maxLength='40' name='customer_id' value={this.state.customer_id} onChange={this.onChange.bind(this, 'customer_id')}/>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='会員名' type='text' maxLength='40' name='customer_name' value={this.state.customer_name} onChange={this.onChange.bind(this, 'customer_name')}/>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='会員メールアドレス' type='text' maxLength='40' name='customer_email' value={this.state.customer_email} onChange={this.onChange.bind(this, 'customer_email')}/>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='会員電話番号' type='text' maxLength='40' name='customer_tel' value={this.state.customer_tel} onChange={this.onChange.bind(this, 'customer_tel')}/>
              </div>
              <div className='col-xs-12'>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='カメラマンID' type='text' maxLength='40' name='staff_id' value={this.state.staff_id} onChange={this.onChange.bind(this, 'staff_id')}/>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='カメラマン名' type='text' maxLength='40' name='staff_name' value={this.state.staff_name} onChange={this.onChange.bind(this, 'staff_name')}/>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='カメラマン名カナ' type='text' maxLength='40' name='staff_name_kana' value={this.state.staff_name_kana} onChange={this.onChange.bind(this, 'staff_name_kana')}/>
                <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='スタジオコード' type='text' maxLength='40' name='studio_code' value={this.state.studio_code} onChange={this.onChange.bind(this, 'studio_code')}/>
              </div>
              <ShowIf condition={this.props.typeView != 'calendar'}>
                <div className='col-xs-12'>
                  <ReactDateTimeRangePicker
                    className='col-xs-12 col-sm-6 mb15'
                    label='予約日時'
                    type='text'
                    maxLength='40'
                    name='booking_date'
                    update={this.props.goBack}
                    startDate={this.state.booking_date_from}
                    endDate={this.state.booking_date_to}
                    onChangeStartDay={this.onChangeStartDay.bind(this)}
                    onChangeEndDay={this.onChangeEndDay.bind(this)}/>
                  <Input className='col-xs-12 col-sm-6 col-lg-3 mb15' label='予約コード' type='text' maxLength='40' name='booking_code' value={this.state.booking_code} onChange={this.onChange.bind(this, 'booking_code')}/>
                </div>
              </ShowIf>
              <div className='wrap-list-check-box'>
                <GroupCheckBox label='スタジオ' data={this.state.listStudio} name='studio_ids' value={this.state.studio_ids} onChange={this.onChange.bind(this, 'studio_ids')} keyName='id' valueName='name'/>
              </div>
              <ShowIf condition={this.props.typeView != 'calendar'}>
                <div className='wrap-list-check-box'>
                  <GroupCheckBox label='ステータス' data={this.state.data2} name='booking_statuses' value={this.state.booking_statuses} onChange={this.onChange.bind(this, 'booking_statuses')} keyName='id' valueName='name'/>
                </div>
              </ShowIf>
              <ShowIf condition={this.props.typeView == 'calendar'}>
                <div className='wrap-list-check-box'>
                  <GroupCheckBox label='ステータス' data={this.state.data3} name='booking_statuses' value={this.state.booking_statuses} onChange={this.onChange.bind(this, 'booking_statuses')} keyName='id' valueName='name'/>
                </div>
              </ShowIf>
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
  listStudio: [],
  goBack: false,
  dataSearch: {}
}

function bindStateToProps(state) {
  return {
    listStudio: state.systemData.listStudio,
    goBack: state.booking.goBack,
    dataSearch: state.booking.dataSearch
  }
}

export default connect(bindStateToProps)(Search)

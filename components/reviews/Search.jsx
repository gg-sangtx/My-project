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
      dataStatus: [
        {id: 1, name: '確認待ち'},
        {id: 2, name: '公開'},
        {id: 3, name: '非公開'},
        {id: 4, name: '保留'},
      ],
      dataCategory: [
        {id: 1, name: '撮影レポート'},
        {id: 2, name: 'お客様レビュー'},
      ],
      category_id: '',
      open_time: '',
      close_time: '',
      status: '',
      booking_code:'',
      plan_code: '',
      studio_code: '',
      dataStudio: this.props.studioCanWork,
      studios_can_work: '',
      tag: '',
      customer_name: '',
      customer_email: '',
    }
  }

  ComponentDidMount() {
    this.getdataReviews();
  }

  getdataReviews() {
    Reviews.actions.list.request().then(res => {
      if(res.data) {
        this.state.dataReview= res.data.data.reviews.data;
      } else {
        this.state.dataReview = []
      }
      this.setState({...this.state});
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

  onChangeDate(name, e) {
    this.setState({
      [name]: e
    })
  }

  Collapse() {
    this.state.isOpen = !this.state.isOpen;
    this.setState({
      ...this.state
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.studioCanWork != this.props.studioCanWork) {
      this.state.dataStudio = nextProps.studioCanWork;
    }
    if(nextProps.loading == false) {
      this.state.search = false;
    }
    if(nextProps.goBack == true) {
      this.state.open_time = nextProps.dataSearch.open_time ;
      this.state.close_time = nextProps.dataSearch.close_time;
      this.state.status = nextProps.dataSearch.status;
      this.state.category_id = nextProps.dataSearch.category_id;
      this.state.booking_code = nextProps.dataSearch.booking_code;
      this.state.plan_code = nextProps.dataSearch.plan_code;
      this.state.studio_code = nextProps.dataSearch.studio_code;
      this.state.studios_can_work = nextProps.dataSearch.studio_ids ? nextProps.dataSearch.studio_ids : [];
      this.state.tag = nextProps.dataSearch.tag;
      this.state.customer_name = nextProps.dataSearch.customer_name;
      this.state.customer_email = nextProps.dataSearch.customer_email;
    }
    this.setState({...this.state});
  }

  onChangeStartDay(name, e) {
    this.state[name] = e ? moment(e).format(CONFIG.DateTimeFormat) : '';
    this.setState({...this.state})
  }

  onChangeEndDay(name, e) {
    this.state[name] = e ? moment(e).format(CONFIG.DateTimeFormat) : '';
    this.setState({...this.state})
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      open_time: this.state.open_time ? this.state.open_time : '',
      close_time: this.state.close_time ? this.state.close_time : '',
      status: this.state.status ? this.state.status : '',
      category_id: this.state.category_id ? this.state.category_id : '',
      booking_code: this.state.booking_code ? this.state.booking_code : '',
      plan_code: this.state.plan_code ? this.state.plan_code : '',
      studio_code: this.state.studio_code ? this.state.studio_code : '',
      studio_ids: this.state.studios_can_work ? this.state.studios_can_work : '',
      tag: this.state.tag ? this.state.tag : '',
      customer_name: this.state.customer_name ? this.state.customer_name : '',
      customer_email: this.state.customer_email ? this.state.customer_email : ''
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
                <ReactDateTimeRangePicker
                  onChangeStartDay={this.onChangeStartDay.bind(this, 'open_time')}
                  onChangeEndDay={this.onChangeEndDay.bind(this, 'close_time')}
                  startDate={this.state.open_time}
                  endDate={this.state.close_time}
                  update={this.props.goBack}
                  label='公開開始日時'
                  className='col-xs-12 col-sm-6 mb20'/>
                <DropDown className=' col-xs-12 col-sm-3 col-md-3 mb15' label='ステータス' showPlaceholder={true} placeholder='選択なし' options={this.state.dataStatus} keyName='id' valueName='name' value={this.state.status} onChange={this.onChange.bind(this, 'status')}/>
                <DropDown className=' col-xs-12 col-sm-3 col-md-3 mb15' label='カテゴリ' showPlaceholder={true} placeholder='選択なし' options={this.state.dataCategory} keyName='id' valueName='name' value={this.state.category_id} onChange={this.onChange.bind(this, 'category_id')}/>
              </div>

              <div className = 'col-xs-12 pb15'>
                <Input className='col-xs-3 mb15' label='予約コード' type='text' maxLength='40' name='Name' value={this.state.booking_code} onChange={this.onChange.bind(this, 'booking_code')}/>
                <Input className='col-xs-3 mb15' label='撮影費用コード' type='text' maxLength='40' name='Name' value={this.state.plan_code} onChange={this.onChange.bind(this, 'plan_code')}/>
                <Input className='col-xs-3 mb15' label='スタジオコード' type='text' maxLength='40' name='Name' value={this.state.studio_code} onChange={this.onChange.bind(this, 'studio_code')}/>
              </div>

              <div className = 'col-xs-12 pb15 pl30 pr15'>
                <GroupCheckBox name='studios_can_work' label='スタジオ' data={this.state.dataStudio} value={this.state.studios_can_work} onChange={this.onChange.bind(this, 'studios_can_work')} keyName='id' valueName='name'/>
              </div>

              <div className = 'col-xs-12 pb15'>
                <Input className='col-xs-3 mb15' label='タグ' type='text' maxLength='40' name='Tag' value={this.state.tag} onChange={this.onChange.bind(this, 'tag')}/>
                <Input className='col-xs-3 mb15' label='会員名' type='text' maxLength='40' name='Name' value={this.state.customer_name} onChange={this.onChange.bind(this, 'customer_name')}/>
                <Input className='col-xs-3 mb15' label='会員メールアドレス' type='text' maxLength='40' name='Email' value={this.state.customer_email} onChange={this.onChange.bind(this, 'customer_email')}/>
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
    dataSearch: state.listReviews.dataSearch,
    goBack: state.listReviews.goBack,
    studioCanWork: state.systemData.studioCanWork,
  }
}

export default connect(bindStateToProps)(Search)
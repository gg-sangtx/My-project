import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, CoupleInput, ReactDateTimeRangePicker} from 'components/inputform';
import {connect} from 'react-redux';
import {DateFormat, DateTimeFormat} from 'constants/datetime';
import moment from 'moment';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      name: '',
      name_kana: '',
      email: '',
      tel: '',
      types: '',
      studios_can_work: '',
      schedule_booking_from: '',
      schedule_booking_to: '',
      typeStaff: this.props.typeStaff,
      studioCanWork: this.props.studioCanWork
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

  componentWillReceiveProps(nextProps) {
    if(nextProps.loading == false) {
      this.state.search = false;
    }
    if(nextProps.typeStaff != this.props.typeStaff) {
      this.state.typeStaff = nextProps.typeStaff;
    }
    if(nextProps.studioCanWork != this.props.studioCanWork) {
      this.state.studioCanWork = nextProps.studioCanWork;
    }
    if(nextProps.goBack == true) {
      this.state.name = nextProps.dataSearch.name ? nextProps.dataSearch.name : '';
      this.state.name_kana = nextProps.dataSearch.name_kana ? nextProps.dataSearch.name_kana : '';
      this.state.email = nextProps.dataSearch.email ? nextProps.dataSearch.email : '';
      this.state.tel = nextProps.dataSearch.tel ? nextProps.dataSearch.tel : '';
      this.state.types = nextProps.dataSearch.types ? nextProps.dataSearch.types : '';
      this.state.studios_can_work = nextProps.dataSearch.studios_can_work ? nextProps.dataSearch.studios_can_work : [];
      this.state.schedule_booking_from = nextProps.dataSearch.schedule_booking_from ? nextProps.dataSearch.schedule_booking_from : '';
      this.state.schedule_booking_to = nextProps.dataSearch.schedule_booking_to ? nextProps.dataSearch.schedule_booking_to : '';
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      name: this.state.name ? this.state.name : '',
      name_kana: this.state.name_kana ? this.state.name_kana : '',
      email: this.state.email ? this.state.email : '',
      tel: this.state.tel ? this.state.tel : '',
      types: this.state.types ? this.state.types : '',
      studios_can_work: this.state.studios_can_work ? this.state.studios_can_work : [],
      schedule_booking_from: this.state.schedule_booking_from ? this.state.schedule_booking_from : '',
      schedule_booking_to: this.state.schedule_booking_to ? this.state.schedule_booking_to : '',
    }
    this.props.search(data);
    return;
  }

  onChangeStartDay(e) {
    this.state.schedule_booking_from = e ? moment(e).format(DateTimeFormat) : '';
    this.setState({...this.state})
  }

  onChangeEndDay(e) {
    this.state.schedule_booking_to = e ? moment(e).format(DateTimeFormat) : '';
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
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='名前' type='text' maxLength='40' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='名前カナ' type='text' maxLength='40' name='name_kana' value={this.state.name_kana} onChange={this.onChange.bind(this, 'name_kana')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='メールアドレス' type='text' maxLength='40' name='email' value={this.state.email} onChange={this.onChange.bind(this, 'email')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='電話番号' type='text' maxLength='40' name='tel' value={this.state.tel} onChange={this.onChange.bind(this, 'tel')}/>
              </div>

              <div className='wrap-list-check-box'>
                <GroupCheckBox name='type' label='職業' data={this.state.typeStaff} name='typeStaff' value={this.state.types} onChange={this.onChange.bind(this, 'types')} keyName='key' valueName='value'/>
              </div>

              <div className='wrap-list-check-box'>
                <GroupCheckBox name='studios_can_work' label='スタジオ' data={this.state.studioCanWork} name='studioCanWork' value={this.state.studios_can_work} onChange={this.onChange.bind(this, 'studios_can_work')} keyName='id' valueName='name'/>
              </div>
              <div className='col-xs-12'>
                <ReactDateTimeRangePicker
                  onChangeStartDay={this.onChangeStartDay.bind(this)}
                  onChangeEndDay={this.onChangeEndDay.bind(this)}
                  startDate={this.state.schedule_booking_from}
                  endDate={this.state.schedule_booking_to}
                  update={this.props.goBack}
                  label='直近予約スケジュール'
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
  studioCanWork: [],
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    typeStaff: state.systemData.typeStaff,
    studioCanWork: state.systemData.studioCanWork,
    dataSearch: state.listStaff.dataSearch,
    goBack: state.listStaff.goBack,
  }
}

export default connect(bindStateToProps)(Search)

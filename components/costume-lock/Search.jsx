import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, CoupleInput, ReactDateTimeRangePicker, DropDown} from 'components/inputform';
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
      costume_code: '',
      costume_name: '',
      types: '',
      studio_code: '',
      studio_name: '',
      type: '',
      schedule_booking_from: '',
      schedule_booking_to: '',
      dataChooseCategory: [
        {id: 1, value: '予約'},
        {id: 2, value: 'クリーニング'},
      ],
      costume_lock_from: moment(new Date().setHours(0,0,0,0))._d,
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
    if(nextProps.goBack == true) {
      this.state.costume_code = nextProps.dataSearch.costume_code ? nextProps.dataSearch.costume_code : '';
      this.state.costume_name = nextProps.dataSearch.costume_name ? nextProps.dataSearch.costume_name : '';
      this.state.types = nextProps.dataSearch.types ? nextProps.dataSearch.types : '';
      this.state.studio_code = nextProps.dataSearch.studio_code ? nextProps.dataSearch.studio_code : '';
      this.state.studio_name = nextProps.dataSearch.studio_name ? nextProps.dataSearch.studio_name : '';
      this.state.type = nextProps.dataSearch.type ? nextProps.dataSearch.type : '';
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
      costume_code: this.state.costume_code ? this.state.costume_code : '',
      costume_name: this.state.costume_name ? this.state.costume_name : '',
      // studio_id: this.state.studio_id ? this.state.studio_id : '',
      types: this.state.types ? this.state.types : '',
      studio_code: this.state.studio_code ? this.state.studio_code : '',
      studio_name: this.state.studio_name ? this.state.studio_name : '',
      type: this.state.type ? this.state.type : '',
      costume_lock_from: this.state.costume_lock_from ? this.state.costume_lock_from : '',
      costume_lock_to: this.state.costume_lock_to ? this.state.costume_lock_to : '',
    }
    this.props.search(data);
    return;
  }

  onChangeStartDay(e) {
    this.state.costume_lock_from = e ? moment(e).format(DateTimeFormat) : '';
    this.setState({...this.state})
  }

  onChangeEndDay(e) {
    this.state.costume_lock_to = e ? moment(e).format(DateTimeFormat) : '';
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
                <Input className=' col-xs-3 mb15' label='衣装コード' type='text' maxLength='40' name='costume_code' value={this.state.costume_code} onChange={this.onChange.bind(this, 'costume_code')}/>
                <Input className=' col-xs-3 mb15' label='衣装名' type='text' maxLength='40' name='costume_name' value={this.state.costume_name} onChange={this.onChange.bind(this, 'costume_name')}/>
              </div>

              <div className='col-xs-12'>
                <Input className=' col-xs-3 mb15' label='スタジオコード' type='text' maxLength='40' name='studio_code' value={this.state.studio_code} onChange={this.onChange.bind(this, 'studio_code')}/>
                <Input className=' col-xs-3 mb15' label='スタジオ名' type='text' maxLength='40' name='studio_name' value={this.state.studio_name} onChange={this.onChange.bind(this, 'studio_name')}/>
                <DropDown className=' col-xs-3 mb15' label='カテゴリ' showPlaceholder={true} placeholder='選択なし' options={this.state.dataChooseCategory} keyName='id' valueName='value' value={this.state.type} onChange={this.onChange.bind(this, 'type')}/>
              </div>
              <ShowIf condition={this.props.typeShow == 1}>
                <div className='col-xs-12'>
                  <ReactDateTimeRangePicker
                    onChangeStartDay={this.onChangeStartDay.bind(this)}
                    onChangeEndDay={this.onChangeEndDay.bind(this)}
                    startDate={this.state.costume_lock_from}
                    endDate={this.state.schedule_booking_to}
                    update={this.props.goBack}
                    label='時間帯'
                    className='col-xs-12 col-sm-6 mb20'/>
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
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    dataSearch: state.listStaff.dataSearch,
    goBack: state.listStaff.goBack,
  }
}

export default connect(bindStateToProps)(Search)

import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, CoupleInput, ReactDateRangePicker} from 'components/inputform';
import {connect} from 'react-redux';
import {DateFormat} from 'constants/datetime';
import moment from 'moment';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      listStudio: this.props.listStudio,
      typeStaff: this.props.typeStaff,
      listStatus: [{id: 'BOOKING', text: '予約済'},{id: 'NO_BOOKING', text: '未予約'},{id: 'NO_ASSIGNMENT', text: '割当なし'}]
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
      this.state.studio_code = this.props.dataSearch.studio_code ? this.props.dataSearch.studio_code : '';
      this.state.staff_id = this.props.dataSearch.staff_id ? this.props.dataSearch.staff_id : '';
      this.state.staff_name = this.props.dataSearch.staff_name ? this.props.dataSearch.staff_name : '';
      this.state.staff_name_kana = this.props.dataSearch.staff_name_kana ? this.props.dataSearch.staff_name_kana : '';
      this.state.studios_worked = this.props.dataSearch.studios_worked ? this.props.dataSearch.studios_worked : [];
      this.state.staff_types = this.props.dataSearch.staff_types ? this.props.dataSearch.staff_types : [];
      this.state.statuses = this.props.dataSearch.statuses ? this.props.dataSearch.statuses : [];
    }
    this.setState({...this.state});
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.listStudio != nextProps.listStudio) {
      this.state.listStudio = nextProps.listStudio;
    }
    if(this.props.typeStaff != nextProps.typeStaff) {
      this.state.typeStaff = nextProps.typeStaff;
    }
    if(nextProps.goBack == true) {
      this.state.studio_code = nextProps.dataSearch.studio_code ? nextProps.dataSearch.studio_code : '';
      this.state.staff_id = nextProps.dataSearch.staff_id ? nextProps.dataSearch.staff_id : '';
      this.state.staff_name = nextProps.dataSearch.staff_name ? nextProps.dataSearch.staff_name : '';
      this.state.staff_name_kana = nextProps.dataSearch.staff_name_kana ? nextProps.dataSearch.staff_name_kana : '';
      this.state.studios_worked = nextProps.dataSearch.studios_worked ? nextProps.dataSearch.studios_worked : [];
      this.state.staff_types = nextProps.dataSearch.staff_types ? nextProps.dataSearch.staff_types : [];
      this.state.statuses = nextProps.dataSearch.statuses ? nextProps.dataSearch.statuses : [];
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      studio_code: this.state.studio_code ? this.state.studio_code : '',
      staff_id: this.state.staff_id ? this.state.staff_id : '',
      staff_name: this.state.staff_name ? this.state.staff_name : '',
      staff_name_kana: this.state.staff_name_kana ? this.state.staff_name_kana : '',
      studios_worked: this.state.studios_worked ? this.state.studios_worked : [],
      staff_types: this.state.staff_types ? this.state.staff_types : [],
      statuses: this.state.statuses ? this.state.statuses : [],
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
                <Input className=' col-xs-12 col-sm-6 col-lg-4 mb15' label='カメラマン／ヘアメイクID' type='text' maxLength='40' name='staff_id' value={this.state.staff_id} onChange={this.onChange.bind(this, 'staff_id')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-4 mb15' label='カメラマン／ヘアメイク名' type='text' maxLength='40' name='staff_name' value={this.state.staff_name} onChange={this.onChange.bind(this, 'staff_name')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-4 mb15' label='カメラマン／スタイリスト名（カナ）' type='text' maxLength='40' name='staff_name_kana' value={this.state.staff_name_kana} onChange={this.onChange.bind(this, 'staff_name_kana')}/>
                <Input className=' col-xs-4 mb15' label='スタジオコード' type='text' maxLength='40' name='studio_code' value={this.state.studio_code} onChange={this.onChange.bind(this, 'studio_code')}/>
              </div>
              <div className='wrap-list-check-box'>
                <GroupCheckBox label='スタジオ' data={this.state.listStudio} name='studios_worked' value={this.state.studios_worked} onChange={this.onChange.bind(this, 'studios_worked')} keyName='id' valueName='name'/>
              </div>
              <div className='wrap-list-check-box'>
                <GroupCheckBox label='職種' data={this.state.typeStaff} name='staff_types' value={this.state.staff_types} onChange={this.onChange.bind(this, 'staff_types')} keyName='key' valueName='value'/>
              </div>
              <div className='wrap-list-check-box'>
                <GroupCheckBox label='ステータス' data={this.state.listStatus} name='statuses' value={this.state.statuses} onChange={this.onChange.bind(this, 'statuses')} keyName='id' valueName='text'/>
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
  dataSearch: {},
  goBack: false,
  listStudio: [],
  typeStaff: []
}

function bindStateToProps(state) {
  return {
    dataSearch: state.listStaffSchedule.dataSearch,
    goBack: state.listStaffSchedule.goBack,
    listStudio: state.systemData.listStudio,
    typeStaff: state.systemData.typeStaff
  }
}

export default connect(bindStateToProps)(Search)

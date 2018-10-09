import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, CoupleInput, DatePicker} from 'components/inputform';
import {connect} from 'react-redux';
import {DateFormat, DateTimeFormat} from 'constants/datetime';
import moment from 'moment';
import {ShowIf} from 'components/utils';
import * as CONFIG from 'constants/datetime';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      staff_id: '',
      staff_name: '',
      staff_name_kana: '',
      date: '',
      admin_confirms: [],
      data1: [
        {key: 1, value: '確定済み'},
        {key: 0, value: '未確定'}
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
    if(nextProps.sort != 'MONTHLY') {
      this.state.admin_confirms = [];
    }
    if(nextProps.goBack == true) {
      this.state.staff_id = nextProps.dataSearch.staff_id ? nextProps.dataSearch.staff_id : '';
      this.state.staff_name = nextProps.dataSearch.staff_name ? nextProps.dataSearch.staff_name : '';
      this.state.staff_name_kana = nextProps.dataSearch.staff_name_kana ? nextProps.dataSearch.staff_name_kana : '';
      this.state.date = nextProps.dataSearch.date ? nextProps.dataSearch.date : '';
      this.state.admin_confirms = nextProps.dataSearch.admin_confirms ? nextProps.dataSearch.admin_confirms : [];
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      staff_id: this.state.staff_id ? this.state.staff_id : '',
      staff_name: this.state.staff_name ? this.state.staff_name : '',
      staff_name_kana: this.state.staff_name_kana ? this.state.staff_name_kana : '',
      date: this.state.date ? this.state.date : '',
      admin_confirms: this.state.admin_confirms ? this.state.admin_confirms : [],
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
                <Input className='col-xs-12 col-sm-4 mb15'
                  label='カメラマン／ヘアメイクID' type='text' name='staff_id' value={this.state.staff_id} onChange={this.onChange.bind(this, 'staff_id')}/>
                <Input className='col-xs-12 col-sm-4 mb15'
                  label='カメラマン／ヘアメイク名' type='text' name='staff_name' value={this.state.staff_name} onChange={this.onChange.bind(this, 'staff_name')}/>
                <Input className='col-xs-12 col-sm-4 mb15'
                  label='カメラマン／スタイリスト名（カナ)' type='text' name='staff_name_kana' value={this.state.staff_name_kana} onChange={this.onChange.bind(this, 'staff_name_kana')}/>
                <DatePicker className='col-xs-12 col-sm-4 mb15'
                  label='日付' type='text' name='date' value={this.state.date} dateFormat={'YYYY年MM月'} placeholder={'YYYY年MM月'} onChange={this.onChangeDate.bind(this, 'date')}/>
                <ShowIf condition={this.props.sort == 'MONTHLY'}>
                  <div className='col-xs-12 col-sm-8'>
                    <GroupCheckBox name='type'
                      label='確定処理' data={this.state.data1} name='admin_confirms' value={this.state.admin_confirms} onChange={this.onChange.bind(this, 'admin_confirms')} keyName='key' valueName='value'/>
                  </div>
                </ShowIf>
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
  month: false,
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    dataSearch: state.staffPays.dataSearch,
    goBack: state.staffPays.goBack,
  }
}

export default connect(bindStateToProps)(Search)

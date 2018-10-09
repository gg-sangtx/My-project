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
        {id: 1, name: '公開'},
        {id: 2, name: '非公開'}
      ],
      open_time_from: '',
      open_time_to: '',
      close_time_from: '',
      close_time_to: '',
      status: '',
      free_word: '',
    }
  }

  ComponentDidMount() {
    this.getdataNews();
  }

  getdataNews() {
    News.actions.list.request().then(res => {
      if(res.data) {
        this.state.dataNews= res.data.data.news.data;
      } else {
        this.state.dataNews = []
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
    if(nextProps.loading == false) {
      this.state.search = false;
    }
    if(nextProps.goBack == true) {
      this.state.open_time_from = nextProps.dataSearch.open_time_from ;
      this.state.open_time_to = nextProps.dataSearch.open_time_to;
      this.state.close_time_from = nextProps.dataSearch.close_time_from;
      this.state.close_time_to = nextProps.dataSearch.close_time_to;
      this.state.status = nextProps.dataSearch.status;
      this.state.free_word = nextProps.dataSearch.free_word;
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
      open_time_from: this.state.open_time_from ? moment(this.state.open_time_from).format(CONFIG.DateTimeFormat) : '',
      open_time_to: this.state.open_time_to ? moment(this.state.open_time_to).format(CONFIG.DateTimeFormat) : '',
      close_time_from: this.state.close_time_from ? moment(this.state.close_time_from).format(CONFIG.DateTimeFormat) : '',
      close_time_to: this.state.close_time_to ? moment(this.state.close_time_to).format(CONFIG.DateTimeFormat) : '',
      status: this.state.status ? this.state.status : '',
      free_word: this.state.free_word ? this.state.free_word : '',
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
                  onChangeStartDay={this.onChangeStartDay.bind(this, 'open_time_from')}
                  onChangeEndDay={this.onChangeEndDay.bind(this, 'open_time_to')}
                  startDate={this.state.open_time_from}
                  endDate={this.state.open_time_to}
                  update={this.props.goBack}
                  label='公開開始日時'
                  className='col-xs-12 col-sm-6 mb20'/>
                <ReactDateTimeRangePicker
                  onChangeStartDay={this.onChangeStartDay.bind(this, 'close_time_from')}
                  onChangeEndDay={this.onChangeEndDay.bind(this, 'close_time_to')}
                  startDate={this.state.close_time_from}
                  endDate={this.state.close_time_to}
                  update={this.props.goBack}
                  label='公開終了日時'
                  className='col-xs-12 col-sm-6 mb20'/>
              </div>

              <div className = 'col-xs-12 pb15'>
                <DropDown className=' col-xs-12 col-sm-6 col-md-6 mb15' label='ステータス' showPlaceholder={true} placeholder='選択なし' options={this.state.dataStatus} keyName='id' valueName='name' value={this.state.status} onChange={this.onChange.bind(this, 'status')}/>
                <Input className='col-xs-6 mb15' label='フリーワード' type='text' maxLength='40' name='Name' value={this.state.free_word} onChange={this.onChange.bind(this, 'free_word')}/>
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
    dataSearch: state.listUsers.dataSearch,
    goBack: state.listUsers.goBack,
    studioCanWork: state.systemData.studioCanWork,
  }
}

export default connect(bindStateToProps)(Search)
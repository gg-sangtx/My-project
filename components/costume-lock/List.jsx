import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import MyWrapperComponent from './MyWrapperComponent.jsx';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import backgroundSchedule from 'constants/backgroundSchedule';
import * as CONFIG from 'constants/datetime';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import classnames from 'classnames';
import Modal from 'react-modal';
import {DropDown} from 'components/inputform';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import { CostumeLocks } from 'api';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import { withRouter } from 'react-router';
import cookie from 'react-cookie';
import { API_URL } from 'constants/config';

moment.locale('en-GB')

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class List extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageData: {
        number: 0,
        size: 50,
        totalElements: 0
      },
      data: [],
      dataSort: [
        {key: 'DATE', value: '時間帯'},
        {key: 'COSTUME', value: '衣装コード'},
        {key: 'STUDIO', value: 'スタジオコード'},
        {key: 'TYPE', value: 'カテゴリ'},
      ],
      dataSearch: {
        costume_lock_from: moment().startOf('date').format(CONFIG.DateTimeFormat)
      },
      sort: 'DATE',
      messageDelete: '',
      modalIsOpen: false,
      deleteLoading: false,
      loading: false,
      search: false,
      dataListShow: [
        {id: 1, value: '行表示'},
        {id: 2, value: 'カレンダー表示'}
      ],
      typeShow: 1,
      events: [
        {
          start: new Date(),
          end: new Date(),
        }
      ],
      goBack: false,
      views: 'month',
      defaultDate: this.props.goBack == true && this.props.dataSearch.date? new Date((this.props.dataSearch.year + '-' + this.props.dataSearch.month + '-' + this.props.dataSearch.date)) : new Date(),
      dataStudio:[]
    }
  }

  componentDidMount() {
    this.getListData();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.goBack == true) {
      this.state.dataSearch = nextProps.dataSearch;
      this.state.sort = nextProps.dataSearch.sort || '';
      this.setState({...this.state})
    }
  }

  getListData() {
    this.state.loading = true;
    this.setState({...this.state});
    let dataSearch = {};
    let params = {};
    if(this.props.goBack == true) {
      dataSearch = this.props.dataSearch
    } else {
      dataSearch = this.state.dataSearch
    }
    if(this.props.goBack == true) {
      params.page = this.props.pageData + 1
    } else {
      params.page = this.state.pageData.number + 1
    }
    if (dataSearch && dataSearch.costume_code) {
      params.costume_code = dataSearch.costume_code
    }
    if (dataSearch && dataSearch.costume_name) {
      params.costume_name = dataSearch.costume_name
    }
    if (dataSearch && dataSearch.types) {
      params.types = dataSearch.types
    }
    if (dataSearch && dataSearch.studio_code) {
      params.studio_code = dataSearch.studio_code
    }
    if (dataSearch && dataSearch.studio_name) {
      params.studio_name = dataSearch.studio_name
    }
    if (dataSearch && dataSearch.type) {
      params.type = dataSearch.type
    }
    if(this.state.typeShow == 1) {
      if (dataSearch && dataSearch.costume_lock_from) {
        params.costume_lock_from = dataSearch.costume_lock_from
      }
      if (dataSearch && dataSearch.costume_lock_to) {
        params.costume_lock_to = dataSearch.costume_lock_to
      }
    }
    if (dataSearch && dataSearch.sort) {
      params.sort = dataSearch.sort
    } else {
      params.sort = 'DATE';
    }
    if (this.state.typeShow == 1) {
      CostumeLocks.actions.list.request(params).then(res => {
        if(res && res.data) {
          let Data = res.data.data.costume_locks;
          this.state.data = Data.data;
          this.state.pageData.number = Data.current_page - 1;
          this.state.pageData.size = Data.per_page;
          this.state.pageData.totalElements = Data.total;
          this.state.loading = false;
          this.setState({
            ...this.state
          })
          this.props.dispatch({type: 'COSTUMELOCK_RESET_GO_BACK'});
        } else {
          this.state.data = [];
          this.state.pageData.number = 1;
          this.state.pageData.size = 50;
          this.state.pageData.totalElements = 0;
          this.state.loading = false;
          this.setState({
            ...this.state
          })
          this.props.dispatch({type: 'COSTUMELOCK_RESET_GO_BACK'});
        }
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.props.dispatch({type: 'COSTUMELOCK_RESET_GO_BACK'});
      })
    } else {
      let paramsOne = {...params, month: moment(this.state.defaultDate).add(-1, 'months').format('MM'), year: moment(this.state.defaultDate).add(-1, 'months').format('YYYY')};
      let paramsTwo = {...params, month: moment(this.state.defaultDate).format('MM'), year: moment(this.state.defaultDate).format('YYYY')};
      let paramsThree = {...params, month: moment(this.state.defaultDate).add(1, 'months').format('MM'), year: moment(this.state.defaultDate).add(1, 'months').format('YYYY')};
      this.getMultipleData(paramsOne, this.getMultipleData(paramsTwo, this.getMultipleData(paramsThree)));
    }
  }

  getMultipleData(params, callBack) {
    CostumeLocks.actions.list.request(params).then(res => {
      if(res && res.data) {
        let Data = res.data.data.costume_locks;
        this.state.data = Data.data;
        this.convertData(Data.data);
      }
      if (callBack) {
        callBack();
      } else {
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'COSTUMELOCK_RESET_GO_BACK'});
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.props.dispatch({type: 'COSTUMELOCK_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    let Search = {...this.state.dataSearch, ...dataSearch};
    this.state.dataSearch = Search;
    this.props.dispatch({type: 'UPDATE_COSTUMELOCK_SEARCH', dataSearch: Search});
    this.props.dispatch({type: 'UPDATE_COSTUMELOCK_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_COSTUMELOCK_PAGE', pageData: page.selected});
    this.getListData();
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  openModal(id) {
    let data = [...this.state.data];
    let dataFilter = data.filter(state => {
      return state.id == id
    })
    if (dataFilter.length > 0) {
      this.state.messageDelete = msg.costumeLocksDeleteMessage;
    }
    this.state.deleteId = id;
    this.state.modalIsOpen = true;
    this.setState({
      ...this.state
    })
  }

  deleteItem() {
    this.state.deleteLoading = true;
    this.setState({...this.state});
    let data = [...this.state.data];
    let dataFilter = data.filter(state => {
      return state.id == this.state.deleteId
    })
    CostumeLocks.actions.deleteCostumeLocks.request({id: this.state.deleteId}).then(res => {
      Toastr(msg.studioDeleteSuccess, 'success');
      this.closeModal();
      this.getListData();
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.closeModal()
    })
  }

  closeModal() {
    this.state.deleteId = '';
    this.state.modalIsOpen = false;
    this.state.deleteLoading = false;
    this.setState({
      ...this.state
    })
  }

  downloadCSV() {
    let token = cookie.load('accessToken');
    let URL = String(API_URL) + "/costume-locks/download-csv?token=" + token + '&limit=0';
    let dataSearch = {...this.state.dataSearch};
    if (dataSearch && dataSearch.costume_code) {
      URL = URL + "&costume_code=" + dataSearch.costume_code;
    }
    if (dataSearch && dataSearch.costume_name) {
      URL = URL + "&costume_name=" + dataSearch.costume_name;
    }
    if (dataSearch && dataSearch.types) {
      URL = URL + "&types=" + dataSearch.types;
    }
    if (dataSearch && dataSearch.costume_lock_from) {
      URL = URL + "&costume_lock_from=" + moment(dataSearch.costume_lock_from).format(CONFIG.DateFormat);
    }
    if (dataSearch && dataSearch.costume_lock_to) {
      URL = URL + "&costume_lock_to=" + moment(dataSearch.costume_lock_to).format(CONFIG.DateFormat);
    }
    if (dataSearch && dataSearch.studio_code) {
      URL = URL + "&studio_code=" + dataSearch.studio_code;
    }
    if (dataSearch && dataSearch.studio_name) {
      URL = URL + "&studio_name=" + dataSearch.studio_name;
    }
    if (dataSearch && dataSearch.type) {
      URL = URL + "&type=" + dataSearch.type;
    }
    if (dataSearch && dataSearch.sort) {
      URL = URL + "&sort=" + dataSearch.sort;
    } else {
      URL = URL + "&sort=" + 'DATE';
    }
    let fileName = "my-csv.csv";
    this.saveData(URL, fileName);
  }

  saveData(url, fileName) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.target = '_blank';
    a.download = fileName;
    a.click();
  };

  onChange(e) {
    let Search = {...this.state.dataSearch, sort: e.target.value};
    this.state.dataSearch = Search;
    this.state.sort = e.target.value;
    this.setState({...this.state});
    this.props.dispatch({type: 'UPDATE_COSTUMELOCK_SEARCH', dataSearch: Search});
    this.getListData();
  }

  onChangeType(name, e) {
    this.setState({
      [name]: e.target.value
    }, () => {
      this.getListData();
    })
  }

  convertData(data) {
    if(data.length > 0) {
      data.map(item => {
        let newItem = {
          id: item.id,
          costume_name: item.costume_name,
          costume_size_value: item.costume_size_value,
          type: item.type,
          studio_name: item.studio_name,
          color: this.getColor(item.studio_code),
        }
        if (item.start_time != null || item.end_time != null) {
          newItem.start = new Date(String(item.date + " " +item.start_time));
          newItem.end = new Date(String(item.date + " " +item.end_time));
        } else {
          newItem.start = new Date(item.date);
          newItem.end = new Date(item.date);
          newItem.allDay = true;
        }
        this.state.events.push(newItem)
      })
    }
    this.setState({...this.state})
  }


  onChangeCalendar(e) {
    this.state.views = e;
    this.state.dataSearch.views = e;
    this.props.dispatch({type: 'UPDATE_COSTUMELOCK_SEARCH', dataSearch: this.state.dataSearch});
    this.setState({...this.state});
  }
  onNavigate(e) {
    this.state.defaultDate = e;
    this.setState({...this.state})
    let month = moment(e).format('MM');
    let year = moment(e).format('YYYY');
    let date = moment(e).format('DD');
    if(this.state.dataSearch && this.state.dataSearch.month && this.state.dataSearch.month == month && this.state.dataSearch.year && this.state.dataSearch.year == year) {
      this.state.dataSearch.date = date;
      this.props.dispatch({type: 'UPDATE_COSTUMELOCK_SEARCH', dataSearch: this.state.dataSearch});
      return;
    } else {
      this.state.events = [];
      this.setState({...this.state})
      this.state.dataSearch.month = month;
      this.state.dataSearch.year = year;
      this.state.dataSearch.date = date;
      this.props.dispatch({type: 'UPDATE_COSTUMELOCK_SEARCH', dataSearch: this.state.dataSearch});
      this.getListData();
    }
  }

  getColor(idStudio) {
    if (idStudio) {
      let index = this.state.dataStudio.indexOf(idStudio);

      if (index != -1) {
        return backgroundSchedule[index];
      } else {
        this.state.dataStudio.push(idStudio);
        return backgroundSchedule[this.state.dataStudio.length - 1]
      }
    } else {
      return 'color-schedule-all'
    }
  }

  convert(date) {
    let weekday = moment(date).format('ddd');
    let result = '';
    switch(weekday) {
      case 'Sun':
        return '日'
      case 'Mon':
        return '月'
      case 'Tue':
        return '火'
      case 'Wed':
        return '水'
      case 'Thu':
        return '木'
      case 'Fri':
        return '金'
      default:
        return '土'
    }
  }

  convertDay(date) {
    return moment(date).format('M月D日')
  }

  render() {
    let messages = {
      previous: '＜',
      next: '＞',
      today: '本日',
      month: '月',
      week: '週',
      day: '日',
      showMore: total => `他${total}件`
    }
    let Element = document.getElementById('content-list-manager');
    let Event = ({ event }) => (
      event.allDay != true ? (
          event.type == 1 ? (
            <span className={`events-content`}>
                {moment(event.start).format('HH:mm')}&nbsp;~&nbsp;
                {moment(event.end).format('HH:mm')}&nbsp;
                {event.studio_name}&nbsp;
                {event.costume_name}&nbsp;
                {event.costume_size_value}
            </span>
          ) : (
            <Link className={`events-content`} to={`/costumeLocks/${event.id}`}>
                {moment(event.start).format('HH:mm')}&nbsp;~&nbsp;
                {moment(event.end).format('HH:mm')}&nbsp;
                {event.studio_name}&nbsp;
                {event.costume_name}&nbsp;
                {event.costume_size_value}
            </Link>
          )
        ) : (
          event.type == 1 ? (
            <span className={`events-content render-green`}>
              終日&nbsp;
              {event.costume_name}&nbsp;
              {event.costume_size_value}
            </span>
          ) : (
          <Link className={`events-content render-green`} to={`/costumeLocks/${event.id}`}>
              終日&nbsp;
              {event.costume_name}&nbsp;
              {event.costume_size_value}
          </Link>
          )
        )
      )
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>衣装ロック情報 <small>一覧</small></h2>
          <Link className='btn-addnew' to='/costumeLocks/create'>新規登録</Link>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading} typeShow={this.state.typeShow}/>
        <div className = {
                classnames('choose-calendar', {
                  'choose-calendar-fix': this.state.typeShow != 1
                })
              }>
          <ShowIf condition={this.state.loading == false}>
            <DropDown
              className={
                classnames('col-xs-2 mb15 select-category', {
                  'select-category-fix': this.state.typeShow != 1
                })
              }
              label='' options={this.state.dataListShow} keyName='id' valueName='value' value={this.state.typeShow} onChange={this.onChangeType.bind(this, 'typeShow')} />
          </ShowIf>
          <ShowIf condition={this.state.typeShow == 1}>
            <Datatable
              title={`検索結果 ${this.state.pageData.totalElements}件`}
              header={header.CostumeLocks}
              pageData={this.state.pageData}
              handlePageClick = {this.handlePageClick.bind(this)}
              dataList={this.state.data}
              loading={this.state.loading}
              numberColumnHeader ={7}
              download={true}
              dataSort={this.state.dataSort}
              keyName='key'
              valueName='value'
              sort={this.state.sort}
              hasSort={true}
              downloadCSV={this.downloadCSV.bind(this)}
              onChange={this.onChange.bind(this)}
            >
              <ListItem deleteItem={this.openModal.bind(this)}/>
            </Datatable>
          </ShowIf>
          <ShowIf condition={this.state.typeShow == 2}>
            <BigCalendar
              events={this.state.events}
              formats={{
                timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'H:mm', culture),
                monthHeaderFormat: (date, culture, localizer) => localizer.format(date, 'YYYY年M月', culture),
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
                  let s = localizer.format(start, 'YYYY年M月D日', culture);
                  let e = localizer.format(end, 'M月D日', culture);
                  return `${s} 〜 ${e}`;
                },
                dayHeaderFormat: (date, culture, localizer) => localizer.format(date, 'YYYY年M月D日', culture),
                dayFormat: (date, culture, localizer) => localizer.format(date, (this.convert(date) + ' ' + this.convertDay(date)), culture),
                weekdayFormat: (date, culture, localizer) => localizer.format(date, this.convert(date), culture),
              }}
              views={["month", "week", "day"]}
              view={this.state.views}
              step={30}
              min={moment().minute(0).hour(8).toDate()}
              max={moment().minute(0).hour(23).toDate()}
              showMultiDayTimes
              culture="en-GB"
              messages={messages}
              date={this.state.defaultDate}
              components={{event: Event, eventWrapper: MyWrapperComponent}}
              onView={this.onChangeCalendar.bind(this)}
              onNavigate={this.onNavigate.bind(this)}
            />
          </ShowIf>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>確認</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this)}></button>
          </div>
          <div className='wrap-content-modal'>
            <p className='p-14'>{this.state.messageDelete}</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.deleteItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' disabled={this.state.deleteLoading ? true : false} onClick={this.closeModal.bind(this)}>閉じる</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

List.defaultProps = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0,
  listStudio: [],
}

function bindStateToProps(state) {
  return {
    data: state.listCostumeLocks.data,
    dataSearch: state.listCostumeLocks.dataSearch,
    goBack: state.listCostumeLocks.goBack,
    pageData: state.listCostumeLocks.pageData,
    listStudio: state.systemData.listStudio,
  }
}

export default connect(bindStateToProps)(withRouter(List))
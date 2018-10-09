import React from 'react';
import {Link} from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {Input, DropDown, MyWrapperComponent} from 'components/inputform';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import ListItem from './ListItem.jsx';
import Modal from 'react-modal';
import * as CONFIG from 'constants/datetime';
import Search from './Search.jsx';
import backgroundSchedule from 'constants/backgroundSchedule';
import {msg} from "constants/message";
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import {Toastr} from 'components/modules/toastr';
import {StaffBooking} from 'api';

moment.locale('en-GB')

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class List extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageData: {
        number: 0,
        size: 50,
        totalElements: 0
      },
      dataSort: [{key: 'ASC', value: '予約日時昇順'},{key: 'DESC', value: '予約日時降順'}],
      dataStatus: [{key: 1, value: '撮影前'},{key: 2, value: 'キャンセル済み'},{key: 3, value: '撮影後'},{key: 4, value: '写真公開済み'}],
      viewList: 'table',
      data: [],
      dataSearch: {
        booking_date_from: moment().startOf('day')
      },
      sort: 'ASC',
      dataViewList: [{type: 'table', value: '行表示'},{type: 'calendar', value: 'カレンダー表示'}],
      events: [],
      dataStudio: [],
      loading: false,
      idCancel: '',
      views: 'month',
      modalIsOpen: false,
      defaultDate: new Date(),
      header: [
      { name: '予約日時', minWidth: 200 },
      { name: '予約コード', minWidth: 200 },
      { name: 'ステータス', minWidth: 150 },
      { name: 'スタジオ名', minWidth: 120 },
      { name: '会員名', minWidth: 120 },
      { name: '衣装', minWidth: 200 },
      { name: '操作', width: 120, minWidth: 120 }
      ]
    }
  }

  componentDidMount() {
    if(this.props.goBack == true) {
      this.state.dataSearch = this.props.dataSearch;
      this.state.viewList = this.props.dataSearch.viewList || 'table';
      this.state.views = this.props.dataSearch.views || 'month';
      if(this.props.dataSearch.date) {
        this.state.defaultDate = this.props.dataSearch.year ? new Date((this.props.dataSearch.year + '-' + this.props.dataSearch.month + '-' + this.props.dataSearch.date)) : new Date();
      } else {
        this.state.defaultDate = this.props.dataSearch.year ? new Date((this.props.dataSearch.year + '-' + this.props.dataSearch.month)) : new Date();
      }
      this.setState({...this.state});
      this.getListData();
    } else {
      this.getListData('init');
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.goBack == true) {
      this.state.dataSearch = nextProps.dataSearch;
      this.state.views = nextProps.dataSearch.views || 'month';
      this.state.viewList = nextProps.dataSearch.viewList || 'table';
      if(nextProps.dataSearch.date) {
        this.state.defaultDate = nextProps.dataSearch.year ? new Date((nextProps.dataSearch.year + '-' + nextProps.dataSearch.month + '-' + nextProps.dataSearch.date)) : new Date();
      } else {
        this.state.defaultDate = nextProps.dataSearch.year ? new Date((nextProps.dataSearch.year + '-' + nextProps.dataSearch.month)) : new Date();
      }
      this.setState({...this.state})
    }
    if(this.props.listStudio != nextProps.listStudio) {
      this.convertData(this.state.events, nextProps.listStudio);
    }
    if(this.props.listStudio != nextProps.listStudio && nextProps.listStudio.length > 0 && nextProps.typeStaff.length > 0) {
      let self = this;
      setTimeout(function(){self.getListData()}, 500);
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
    if (this.state.viewList == 'calendar') {
      if(dataSearch && dataSearch.year) {
        params.year = dataSearch.year
      } else {
        params.year = moment(new Date()).format('YYYY');
        this.state.dataSearch.year = moment(new Date()).format('YYYY');
      }
      if(dataSearch && dataSearch.month) {
        params.month = dataSearch.month
      } else {
        params.month = moment(new Date()).format('MM');
        this.state.dataSearch.month = moment(new Date()).format('MM');
      }
      params.limit = 0;
    } else {
      if(this.props.goBack == true) {
        params.page = this.props.pageData + 1
      } else {
        params.page = this.state.pageData.number + 1
      }

      if(dataSearch && dataSearch.sort) {
        params.sort_type = dataSearch.sort
      } else {
        params.sort_type = 'ASC';
        this.state.dataSearch.sort = 'ASC';
      }
      if(dataSearch && dataSearch.booking_date_from) {
        params.booking_date_from = moment(dataSearch.booking_date_from).format(CONFIG.DateTimeFormat)
      }
      if(dataSearch && dataSearch.booking_date_to) {
        params.booking_date_to = dataSearch.booking_date_to
      }
      if(dataSearch && dataSearch.studio_code) {
        params.studio_code = dataSearch.studio_code
      }
      params.sort_field = 'DATE';
      params.limit = 50;
    }
    if(dataSearch && dataSearch.booking_code) {
      params.booking_code = dataSearch.booking_code
    }
    if(dataSearch && dataSearch.booking_statuses) {
      params.booking_statuses = dataSearch.booking_statuses
    }
    if(dataSearch && dataSearch.customer_name) {
      params.customer_name = dataSearch.customer_name
    }
    if(dataSearch && dataSearch.studio_ids) {
      params.studio_ids = dataSearch.studio_ids
    }
    let paramsOne = {...params};
    let paramsTwo = {...params};
    let paramsThree = {...params};

    if (this.state.viewList == 'calendar') {
      this.state.events = [];
      this.setState({...this.state});
      if(dataSearch && dataSearch.month) {
        paramsOne.month = moment(String(dataSearch.year + '/' + dataSearch.month)).add(-1, 'months').format('MM');
        paramsOne.year = moment(String(dataSearch.year + '/' + dataSearch.month)).add(-1, 'months').format('YYYY');
        paramsTwo.month = dataSearch.month
        paramsThree.month = moment(String(dataSearch.year + '/' + dataSearch.month)).add(1, 'months').format('MM');
        paramsThree.year = moment(String(dataSearch.year + '/' + dataSearch.month)).add(1, 'months').format('YYYY');
      } else {
        paramsOne.month = moment(new Date()).add(-1, 'months').format('MM');
        paramsTwo.month = moment(new Date()).format('MM')
        paramsThree.month = moment(new Date()).add(1, 'months').format('MM');

        paramsOne.year = moment(new Date()).add(-1, 'months').format('YYYY');
        paramsThree.year = moment(new Date()).add(1, 'months').format('YYYY');
        this.state.dataSearch.month = moment(new Date()).format('MM');
      }
      this.getData(paramsOne, this.getData(paramsTwo, this.getData(paramsThree)));
    } else {
      StaffBooking.actions.list.request(params).then(res => {
        if(res.data) {
          let Data = res.data.data.bookings;
          this.state.data = Data.data;
          this.state.pageData.number = Data.current_page - 1;
          this.state.pageData.size = Data.per_page;
          this.state.pageData.totalElements = Data.total;
          this.state.loading = false;
          this.setState({
            ...this.state
          })
        }
        this.props.dispatch({type: 'STAFF_BOOKING_RESET_GO_BACK'});
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.props.dispatch({type: 'STAFF_BOOKING_RESET_GO_BACK'});
      })
    }

  }

  getData(params, callBack) {
    StaffBooking.actions.listCalendar.request(params).then(res => {
      if(res.data) {
        let Data = res.data.data.staff_schedules;
        this.convertData(Data);
      }
      if(callBack) {
        callBack();
      } else {
        this.state.loading = false;
        this.setState({...this.state});
      }
      this.props.dispatch({type: 'STAFF_BOOKING_RESET_GO_BACK'});
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.loading = false;
      this.setState({...this.state});
      this.props.dispatch({type: 'STAFF_BOOKING_RESET_GO_BACK'});
    })
  }

  convertData(data) {
    data.map(item => {
      let NewItem = {
        id: item.id,
        studio_name: item.studio_name,
        customer_name: item.customer_name,
        date: item.date,
        time: item.time,
        booking_minutes: item.minutes,
        booking_id: item.booking_id,
        booking_status_id: item.booking_status_id,
        start: new Date(String(item.date + ' ' + item.time)),
        color: item.booking_status_id != 2 && item.customer_name ? '' : 'color-schedule',
        end: this.getTime(String(item.date + ' ' + item.time), item.minutes)
      }
      this.state.events.push(NewItem);
    })
  }

  getColor(studioId) {
    if(this.state.dataStudio.indexOf(studioId) != -1) {
      return backgroundSchedule[this.state.dataStudio.indexOf(studioId)]
    } else {
      this.state.dataStudio.push(studioId);
      return backgroundSchedule[this.state.dataStudio.length - 1]
    }
  }

  getTime(date, minutes) {
    let newDate = new Date(date);
    let hours = (minutes / 60);
    let newMoment = moment(date).add(hours, 'hours');
    return newMoment._d;
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    let Search = {...this.state.dataSearch, ...dataSearch};
    this.state.dataSearch = Search;
    this.props.dispatch({type: 'UPDATE_STAFF_BOOKING_SEARCH', dataSearch: this.state.dataSearch});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  onChangeCalendar(e) {
    this.state.views = e;
    this.state.dataSearch.views = e;
    this.props.dispatch({type: 'UPDATE_STAFF_BOOKING_SEARCH', dataSearch: this.state.dataSearch});
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
      this.props.dispatch({type: 'UPDATE_STAFF_BOOKING_SEARCH', dataSearch: this.state.dataSearch});
      return;
    } else {
      this.state.events = [];
      this.setState({...this.state})
      this.state.dataSearch.month = month;
      this.state.dataSearch.year = year;
      this.state.dataSearch.date = date;
      this.props.dispatch({type: 'UPDATE_STAFF_BOOKING_SEARCH', dataSearch: this.state.dataSearch});
      this.getListData();
    }
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({...this.state})
    if(name =='viewList') {
      this.state.dataSearch.viewList = e.target.value;
      this.props.dispatch({type: 'UPDATE_STAFF_BOOKING_SEARCH', dataSearch: this.state.dataSearch});
      this.getListData();
    }
    if(name == 'sort') {
      let Search = {...this.state.dataSearch, sort: e.target.value};
      this.state.dataSearch = Search;
      this.props.dispatch({type: 'UPDATE_STAFF_BOOKING_SEARCH', dataSearch: Search});
      this.state.sort = e.target.value;
      this.setState({...this.state});
      this.getListData();
    }
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_STAFF_BOOKING_PAGE', pageData: page.selected});
    this.getListData();
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

    let Event = ({ event }) => (
      <div>
        {
          event.customer_name && event.booking_status_id != 2 ?
          (
            <Link className={`events-content`}
              title={moment(new Date(event.start)).format('HH:mm') +
              ((this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(new Date(event.end)).format('HH:mm')) : '') + ' ' +
              event.studio_name + (event.customer_name && event.booking_status_id != 2 ? (' '+ event.customer_name) : ' 未定')}
              to={`/staff/bookings/${event.booking_id}`}>
              {moment(event.start).format('HH:mm')}
              {(this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(event.end).format('HH:mm')) : null}&nbsp;
              {event.studio_name + (event.customer_name && event.booking_status_id != 2 ? (' '+ event.customer_name) : ' 未定')}
            </Link>
          ) : (
            <span className={`events-content`}
              title={moment(new Date(event.start)).format('HH:mm') +
              ((this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(new Date(event.end)).format('HH:mm')) : '') + ' ' +
              event.studio_name + ' 未定'}>
              {moment(event.start).format('HH:mm')}
              {(this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(event.end).format('HH:mm')) : null}&nbsp;
              {event.studio_name + ' 未定'}
            </span>
          )
        }
      </div>
      )
    return (
      <div>
        <div className='title-block'>
          <h2 className='heading-2'>予約情報 <small>一覧</small></h2>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading} typeView={this.state.viewList}/>
        <div className={`wrap-choose-viewList ${this.state.viewList == 'calendar' ? 'view-calendar' : ''}`}>
          <ShowIf condition={!this.state.loading || this.state.viewList == 'calendar'}>
            <DropDown className='choose-viewList' label='' value={this.state.viewList} onChange={this.onChange.bind(this, 'viewList')} options={this.state.dataViewList} keyName='type' valueName='value'/>
          </ShowIf>
          <ShowIf condition={this.state.viewList == 'table'}>
            <Datatable
              title={`検索結果 ${this.state.pageData.totalElements}件`}
              header={this.state.header}
              pageData={this.state.pageData}
              handlePageClick = {this.handlePageClick.bind(this)}
              dataList={this.state.data}
              loading={this.state.loading}
              numberColumnHeader={6}
              dataSort={this.state.dataSort}
              keyName='key'
              valueName='value'
              sort={this.state.sort}
              hasSort={true}
              onChange={this.onChange.bind(this, 'sort')}
            >
              <ListItem/>
            </Datatable>
          </ShowIf>
          <ShowIf condition={this.state.viewList == 'calendar'}>
            <div className={`calendar-wrap text-colorful ${this.state.loading ? 'loading' : ''}`} id='content-list-manager'>
              <ShowIf condition={this.state.loading}>
                <div className='icon-loading'></div>
              </ShowIf>
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
                  weekdayFormat: (date, culture, localizer) => localizer.format(date, this.convert(date), culture)
                }}
                views={["month", "week", "day"]}
                view={this.state.views}
                culture="en-GB"
                step={30}
                min={moment().minute(0).hour(8).toDate()}
                max={moment().minute(0).hour(23).toDate()}
                showMultiDayTimes
                messages={messages}
                date={this.state.defaultDate}
                components={{event: Event, eventWrapper: MyWrapperComponent}}
                onView={this.onChangeCalendar.bind(this)}
                onNavigate={this.onNavigate.bind(this)}
              />
            </div>
          </ShowIf>
        </div>
      </div>
    )
  }
}

List.defaultProps = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function bindStateToProps(state) {
  return {
    data: state.staffBooking.data,
    dataSearch: state.staffBooking.dataSearch,
    goBack: state.staffBooking.goBack,
    pageData: state.staffBooking.pageData
  }
}

export default connect(bindStateToProps)(List);

import React from 'react';
import {Link} from 'react-router-dom';
import Search from './Search.jsx';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {Input} from 'components/inputform';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import * as CONFIG from 'constants/datetime';
import backgroundSchedule from 'constants/backgroundSchedule';
import MyWrapperComponent from './MyWrapperComponent.jsx';
import {StaffSchedule} from 'api';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';

moment.locale('en-GB')

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class List extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      events: [],
      views: 'month',
      data: [],
      dataSearch: {},
      loading: false,
      goBack: false,
      defaultDate: this.props.goBack == true && this.props.dataSearch.date? new Date((this.props.dataSearch.year + '-' + this.props.dataSearch.month + '-' + this.props.dataSearch.date)) : new Date()
    }
  }

  componentDidMount() {
    if(this.props.goBack == true) {
      this.state.dataSearch = this.props.dataSearch;
      this.state.views = this.props.dataSearch.views || 'month';
      if(this.props.dataSearch.date) {
        this.state.defaultDate = this.props.dataSearch.year ? new Date((this.props.dataSearch.year + '-' + this.props.dataSearch.month + '-' + this.props.dataSearch.date)) : new Date();
      } else {
        this.state.defaultDate = this.props.dataSearch.year ? new Date((this.props.dataSearch.year + '-' + this.props.dataSearch.month)) : new Date();
      }
      this.setState({...this.state})
      if(this.props.listStudio.length > 0 && this.props.typeStaff.length > 0) {
        let self = this;
        setTimeout(function(){self.getListData()}, 500);
      }
    } else {
      if(this.props.listStudio.length > 0 && this.props.typeStaff.length > 0) {
        let self = this;
        setTimeout(function(){self.getListData()}, 500);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.goBack == true) {
      this.state.dataSearch = nextProps.dataSearch;
      this.state.views = nextProps.dataSearch.views || 'month';
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

  getTime(date, minutes) {
    let newDate = new Date(date);
    let hours = (minutes / 60);
    let newMoment = moment(date).add(hours, 'hours');
    return newMoment._d;
  }

  getListData() {
    this.state.loading = true;
    this.setState({...this.state});
    let dataSearch = {};
    let params = {
      is_except_canceled_status: 1
    };
    if(this.props.goBack == true) {
      dataSearch = this.props.dataSearch
    } else {
      dataSearch = this.state.dataSearch
    }
    if(dataSearch && dataSearch.year) {
      params.year = dataSearch.year
    } else {
      params.year = moment(new Date()).format('YYYY');
      this.state.dataSearch.year = moment(new Date()).format('YYYY');
    }

    if(dataSearch && !dataSearch.date) {
      this.state.dataSearch.date = moment(new Date()).format('DD');
    }
    if(dataSearch && dataSearch.studio_code) {
      params.studio_code = dataSearch.studio_code
    }
    if(dataSearch && dataSearch.staff_id) {
      params.staff_id = dataSearch.staff_id
    }
    if(dataSearch && dataSearch.staff_name) {
      params.staff_name = dataSearch.staff_name
    }
    if(dataSearch && dataSearch.staff_name_kana) {
      params.staff_name_kana = dataSearch.staff_name_kana
    }
    if(dataSearch && dataSearch.studios_worked) {
      params.studios_worked = dataSearch.studios_worked
    }
    if(dataSearch && dataSearch.staff_types) {
      params.staff_types = dataSearch.staff_types
    }
    if(dataSearch && dataSearch.statuses) {
      params.statuses = dataSearch.statuses
    }
    let paramsOne = {...params};
    let paramsTwo = {...params};
    let paramsThree = {...params};
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
  }

  getData(params, callBack) {
    StaffSchedule.actions.list.request(params).then(res => {
      if(res.data) {
        let Data = res.data.data.staff_schedules;
        this.convertData(Data, this.props.listStudio);
      }
      if(callBack) {
        callBack();
      } else {
        this.state.loading = false;
        this.setState({...this.state});
      }
      this.props.dispatch({type: 'STAFF_SCHEDULE_RESET_GO_BACK'});
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
      this.props.dispatch({type: 'STAFF_SCHEDULE_RESET_GO_BACK'});
    })
  }

  convertData(data, listStudio) {
    if(data.length > 0) {
      data.map(item => {
        let newItem = {
          id: item.id,
          staff_name: item.staff_name,
          studio_name: item.studio_name,
          studio_id: item.studio_id,
          staff_id: item.staff_id,
          status: item.status,
          staff_type_in_schedule: item.staff_type_in_schedule,
          color: this.getColor(item.studio_id, item.status, listStudio),
          start: new Date((item.date + " " +item.time)),
          end: this.getTime((item.date + " " +item.time), item.minutes)
        }
        this.state.events.push(newItem)
      })
    }
    this.setState({...this.state})
  }

  onChangeCalendar(e) {
    this.state.views = e;
    this.state.dataSearch.views = e;
    this.props.dispatch({type: 'UPDATE_STAFF_SCHEDULE_SEARCH', dataSearch: this.state.dataSearch});
    this.setState({...this.state});
  }

  getColor(idStudio, status, listStudio) {
    if (listStudio) {
      let index = listStudio.findIndex(x => x.id == idStudio);

      if (index != -1 && status != 'NO_ASSIGNMENT') {
        return backgroundSchedule[index];
      } else {
        return 'color-schedule'
      }
    } else {
      return 'color-schedule'
    }
  }

  search(dataSearch) {
    let Search = {...this.state.dataSearch, ...dataSearch};
    this.state.dataSearch = Search;
    this.props.dispatch({type: 'UPDATE_STAFF_SCHEDULE_SEARCH', dataSearch: Search});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  onNavigate(e) {
    this.state.defaultDate = e;
    this.setState({...this.state})
    let month = moment(e).format('MM');
    let year = moment(e).format('YYYY');
    let date = moment(e).format('DD');
    if(this.state.dataSearch && this.state.dataSearch.month && this.state.dataSearch.month == month && this.state.dataSearch.year && this.state.dataSearch.year == year) {
      this.state.dataSearch.date = date;
      this.props.dispatch({type: 'UPDATE_STAFF_SCHEDULE_SEARCH', dataSearch: this.state.dataSearch});
      return;
    } else {
      this.state.events = [];
      this.setState({...this.state})
      this.state.dataSearch.month = month;
      this.state.dataSearch.year = year;
      this.state.dataSearch.date = date;
      this.props.dispatch({type: 'UPDATE_STAFF_SCHEDULE_SEARCH', dataSearch: this.state.dataSearch});
      this.getListData();
    }
  }

  getStatusClass(status) {
    switch(status) {
      case 'BOOKING':
        return 'booking';
      case 'NO_BOOKING':
        return 'no-booking';
      default:
      return 'no-charge';
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

    let Event = ({ event }) => (
      <Link className={`events-content ${this.getStatusClass(event.status)}`}
        title={moment(new Date(event.start)).format('HH:mm') +
        ((this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(new Date(event.end)).format('HH:mm')) : '') + ' ' +
        event.studio_name + (event.staff_name ? (' '+ event.staff_name) : '')}
        to={`/staff-schedules/${event.studio_id}/${event.staff_id}/${event.staff_type_in_schedule}/${moment(event.start).format(CONFIG.DateFormat)}`}>
        {moment(event.start).format('HH:mm')}
        {(this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(event.end).format('HH:mm')) : null}&nbsp;
        {event.studio_name + (event.staff_name ? (' '+ event.staff_name) : '')}
      </Link>)

    return (
      <div>
        <div className='title-block'>
          <h2 className='heading-2'>カメラマン／ヘアメイクスケジュール情報 <small>一覧</small></h2>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading}/>
        <div className='mb15 pb15'>
          <Link className='btn-addnew mr20' to={`staff-schedules/studioId/staffId/1/${moment().format(CONFIG.DateFormat)}`}>カメラマンスケジュール情報新規登録</Link>
          <Link className='btn-addnew' to={`staff-schedules/studioId/staffId/2/${moment().format(CONFIG.DateFormat)}`}>ヘアメイクスケジュール情報新規登録</Link>
        </div>
        <div className={`calendar-wrap ${this.state.loading ? 'loading' : ''}`} id='content-list-manager'>
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
        </div>
      </div>
    )
  }
}

List.defaultProps = {
  data: [],
  typeStaff: [],
  listStudio: [],
  dataSearch: {},
  goBack: false
}

function BindStateToProps(state) {
  return {
    data: state.listStaffSchedule.data,
    dataSearch: state.listStaffSchedule.dataSearch,
    goBack: state.listStaffSchedule.goBack,
    listStudio: state.systemData.listStudio,
    typeStaff: state.systemData.typeStaff
  }
}

export default connect(BindStateToProps)(List);

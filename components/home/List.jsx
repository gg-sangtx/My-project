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
import backgroundSchedule from 'constants/backgroundSchedule';
import {msg} from "constants/message";
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import {Toastr} from 'components/modules/toastr';
import {Booking} from 'api';
import cookie from 'react-cookie';

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
      data: [],
      dataSearch: {
        booking_date_from: moment().startOf('day')
      },
      sort: 'ASC',
      events: [],
      dataStudio: [],
      loading: false,
      idCancel: '',
      views: 'month',
      modalIsOpen: false,
      defaultDate: new Date(),
      header: [
        { name: '予約日時', width: 130, minWidth: 130 },
        { name: '予約コード', width: 150 },
        { name: 'ステータス', width: 150 },
        { name: '会員名', width: 150 },
        { name: '会員電話番号', width: 150 },
        { name: 'スタジオ名', width: 150 },
        { name: 'カメラマン/ ヘアメイク', width: 200 },
        { name: '衣装', width: 200 },
        { name: '操作', width: 130, minWidth: 130 }
      ]
    }
  }

  componentDidMount() {
    if (typeof cookie.load('accessToken') != 'undefined') {
      this.getListData();
      this.getListDataSchedule('init');
    }
  }

  getListData() {
    this.state.loading = true;
    this.setState({...this.state});
    let dataSearch = {};
    let params = {
      page: this.state.pageData.number + 1,
      sort_field: 'DATE',
      limit: 50,
      booking_date_from: moment().startOf('day').format(CONFIG.DateTimeFormat),
      booking_date_to: moment().endOf('day').format(CONFIG.DateTimeFormat)
    };
    Booking.actions.list.request(params).then(res => {
      if(res.data) {
        let Data = res.data.data.bookings;
        let DataBooking = res.data.data.bookings
        this.state.data = Data.data;
        this.state.pageData.number = Data.current_page - 1;
        this.state.pageData.size = Data.per_page;
        this.state.pageData.totalElements = Data.total;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
      }
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

  getListDataSchedule(type) {
    let dataSearch = {};
    let params = {
      year: moment(new Date()).format('YYYY'),
      month: moment(new Date()).format('MM'),
      limit: 0,
      is_except_canceled_status: 1
    };
    if (type == 'init') {
      params.year = moment(new Date()).format('YYYY');
      params.month = moment(new Date()).format('MM');
    } else {
      params.year = moment(this.state.dataSearch.year).format('YYYY');
      params.month = moment(this.state.dataSearch.month).format('MM');
    }

    Booking.actions.list.request(params).then(res => {
      if(res.data) {
        let dataSchedule = res.data.data.bookings
        this.convertData(dataSchedule);
      }
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

  convertData(data) {
    this.state.events = [],
    data.map(item => {
      let NewItem = {
        id: item.id,
        studio_name: item.studio_name,
        customer_name: item.customer_name,
        date: item.date,
        time: item.time,
        booking_minutes: item.booking_minutes,
        start: new Date(item.booking_date_time),
        color: this.getColor(item.studio_id),
        end: this.getTime(item.booking_date_time, item.booking_minutes)
      }
      this.state.events.push(NewItem);
    })
    this.setState({...this.state})
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
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  onChangeCalendar(e) {
    this.state.views = e;
    this.state.dataSearch.views = e;
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
      return;
    } else {
      this.state.events = [];
      this.setState({...this.state})
      this.state.dataSearch.month = month;
      this.state.dataSearch.year = year;
      this.state.dataSearch.date = date;
      this.getListDataSchedule();
    }
  }

  cancelBooking() {
    if(this.state.idCancel) {
      this.state.deleteLoading = true;
      this.setState({...this.state});
      Booking.actions.cancelBooking.request('',{id: this.state.idCancel}).then(res => {
        Toastr(msg.editBooking, 'success');
        this.state.modalIsOpen = false;
        this.state.deleteLoading = false;
        this.setState({...this.state});
        this.getListData();
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.state.modalIsOpen = false;
        this.state.deleteLoading = false;
        this.setState({...this.state});
      })
    }
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({...this.state})
    if(name =='viewList') {
      if (e.target.value == 'calendar' && this.state.dataSearch && this.state.dataSearch.booking_statuses && this.state.dataSearch.booking_statuses.indexOf(2) != -1) {
        this.state.dataSearch.booking_statuses.splice(this.state.dataSearch.booking_statuses.indexOf(2), 1);
      }
      this.state.dataSearch.viewList = e.target.value;
      this.getListData();
    }
    if(name == 'sort') {
      let Search = {...this.state.dataSearch, sort: e.target.value};
      this.state.dataSearch = Search;
      this.state.sort = e.target.value;
      this.setState({...this.state});
      this.getListData();
    }
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.getListData();
  }

  openModal(id) {
    this.state.idCancel = id;
    this.state.modalIsOpen = true;
    this.setState({
      ...this.state
    })
  }

  closeModal() {
    this.state.idCancel = '';
    this.state.modalIsOpen = false;
    this.setState({
      ...this.state
    })
  }

  componentWillMount() {
    Modal.setAppElement('body');
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
      <Link className={`events-content`}
        title={moment(new Date(event.start)).format('HH:mm') +
        ((this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(new Date(event.end)).format('HH:mm')) : '') + ' ' +
        event.studio_name + (event.customer_name ? (' '+ event.customer_name) : '')}
        to={`/bookings/${event.id}`}>
        {moment(event.start).format('HH:mm')}
        {(this.state.views == 'week' || this.state.views == 'day') ? (' ~ ' + moment(event.end).format('HH:mm')) : null}&nbsp;
        {event.studio_name + (event.customer_name ? (' '+ event.customer_name) : '')}
      </Link>)
    return (
      <div>
        <div className='title-block'>
          <h2 className='heading-2 mb20'>ダッシュボード</h2>
        </div>
        <div>
          <div className={`calendar-wrap text-colorful mb20 ${this.state.loading ? 'loading' : ''}`} id='content-list-manager'>
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
              views={["week"]}
              view={'week'}
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
        </div>
        <div className={`wrap-choose-viewList`}>
          <Datatable
            title={`本日の予約情報`}
            header={this.state.header}
            pageData={this.state.pageData}
            handlePageClick = {this.handlePageClick.bind(this)}
            dataList={this.state.data}
            loading={this.state.loading}
            numberColumnHeader={9}
            keyName='key'
            valueName='value'
            onChange={this.onChange.bind(this, 'sort')}
          >
            <ListItem deleteItem={this.openModal.bind(this)}/>
          </Datatable>
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
            <p className='p-14'>キャンセルしてもよろしいですか?</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.cancelBooking.bind(this)}>OK</button>
              <button className='btn-close-confirm' disabled={this.state.deleteLoading ? true : false} onClick={this.closeModal.bind(this)}>閉じる</button>
            </div>
          </div>
        </Modal>
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
    data: state.booking.data,
    dataSearch: state.booking.dataSearch,
    goBack: state.booking.goBack,
    pageData: state.booking.pageData
  }
}

export default connect(bindStateToProps)(List);

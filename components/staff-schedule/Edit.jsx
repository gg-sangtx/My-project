import React from 'react';
import {Link} from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {Input, DropDown, MonthPicker} from 'components/inputform';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {ShowIf} from 'components/utils';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';
import * as CONFIG from 'constants/datetime';
import MyWrapperComponent from './MyWrapperComponent.jsx';
import {StaffSchedule, System} from 'api';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';

moment.locale('en-GB')

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

class Edit extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      events: [],
      views: 'month',
      path: {
        idStudio: '',
        idStaff: '',
        date: ''
      },
      dataInit: [],
      dataPatch:[],
      listStaff: [],
      listStudio: this.props.listStudio,
      countBookingHours: 0,
      defaultDate: new Date(this.props.params.date),
      date: '',
      loading: false,
      loadingSubmit: false
    }
  }

  componentDidMount() {
    this.state.path = this.props.params;
    this.state.staffId = this.props.params.staffId || '';
    this.state.studioId = this.props.params.studioId || '';
    this.state.staffType = this.props.params.staffType || '';
    this.state.date = moment(new Date(this.props.params.date)).format('YYYY-MM')
    this.setState({...this.state});
    if (this.props.params.studioId != 'studioId') {
      this.getStaff();
    } else if (this.props.listStudio.length > 0) {
      this.state.studioId = this.props.listStudio[0].id;
      this.setState({...this.state}, ()=> {this.getStaff();})
    }
  }

  getStaff() {
    this.state.loading = true;
    this.setState({...this.state});
    let params = {
      is_sub_list: 1,
      limit: 0,
      studio_worked_id: this.state.studioId,
      sort: 'ID'
    }
    if(this.props.params.staffType == 1) {
      params.types = [1];
      params.type_staff_in_schedule = 1;
    } else {
      params.types = [2];
      params.type_staff_in_schedule = 2;
    }
    StaffSchedule.actions.getStaff.request(params).then(res => {
      if(res.data) {
        this.state.listStaff = [];
        let Data = res.data.data.staffs
        if(!this.state.staffId) {
          this.state.staffId = Data[0].id
        }
        this.state.listStaff = Data;
        this.setState({...this.state})
        this.getListData()
      }
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
    })
  }

  onChangeCalendar(e) {
    this.state.views = e;
    this.setState({...this.state});
  }

  onChangeCheckBox(date, studio_booking_hour_id) {
    if(!this.state.staffId || this.state.staffId == 'staffId' || this.state.staffId == 'null') {
      if(this.props.params.staffType == 1) {
        Toastr(msg.warningPhotographer, 'warning')
      } else {
        Toastr(msg.warningHairmake, 'warning')
      }
    } else {
      let index = this.state.events.findIndex(state => state.date == date && state.studio_booking_hour_id == studio_booking_hour_id);
      if(index != -1 && this.state.events[index].staff_id == this.state.staffId) {
        if(this.state.dataPatch.findIndex(state => state.date == date && state.studio_booking_hour_id == studio_booking_hour_id) == -1) {
          let ItemPatch = {
            id: this.state.events[index].id,
            studio_booking_hour_id: this.state.events[index].studio_booking_hour_id,
            date: this.state.events[index].date,
            staff_type_in_schedule: this.props.params.staffType,
            staff_id: null
          }
          this.state.dataPatch.push(ItemPatch);
        } else {
          let newDatPatch = this.state.dataPatch.filter(item => {
            return (item.date != date || item.studio_booking_hour_id != studio_booking_hour_id)
          })
          this.state.dataPatch = newDatPatch;
        }
        this.state.events[index].staff_id = null;
        this.setState({...this.state});
      } else if (index != -1) {
        if(this.state.dataPatch.findIndex(state => state.date == date && state.studio_booking_hour_id == studio_booking_hour_id) == -1) {
          let ItemPatch = {
            id: this.state.events[index].id,
            studio_booking_hour_id: this.state.events[index].studio_booking_hour_id,
            date: this.state.events[index].date,
            staff_type_in_schedule: this.props.params.staffType,
            staff_id: this.state.staffId
          }
          this.state.dataPatch.push(ItemPatch);
        } else {
          let newDatPatch = this.state.dataPatch.filter(state => {
            return (state.date != date || state.studio_booking_hour_id != studio_booking_hour_id)
          })
          this.state.dataPatch = newDatPatch;
        }
        this.state.events[index].staff_id = this.state.staffId;
        this.setState({...this.state});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.listStudio != this.props.listStudio) {
      this.state.listStudio = nextProps.listStudio;
      if (nextProps.listStudio.length > 0 && this.props.params.studioId == 'studioId') {
        this.state.studioId = nextProps.listStudio[0].id;
        this.setState({...this.state}, ()=> {this.getStaff();})
      }
    }
  }

  getListData() {
    this.state.loading = true;
    this.setState({...this.state});
    let params = {
      limit: 0,
      studio_id: this.state.studioId
    }
    let date = new Date(this.state.defaultDate);
    let month = moment(date).format('MM');
    let year = moment(date).format('YYYY');
    params.year = year;
    params.month = month;

    StaffSchedule.actions.list.request(params).then(res => {
      if(res.data) {
        this.state.countBookingHours = res.data.data.count_booking_hours;
        this.setState({...this.state})
        this.filterData(res.data.data.staff_schedules)
      }
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
    })
  }

  filterData(data, callBack) {
    let dataFilter = [];
    data.map(item => {
      let newData = [...data];
      let dataCheck = newData.filter(itemFilter => {
        return itemFilter.id === item.id
      })
      if (dataFilter.findIndex(x => x.id == dataCheck[0].id) == -1) {
        if (dataCheck.length === 1) {
          dataFilter.push(item);
        } else {
          let itemChecked = dataCheck[0];
          dataCheck.map(itemCheck => {
            if (itemCheck.booking_status_id != 2) {
              itemChecked = itemCheck;
            }
          })
          dataFilter.push(itemChecked)
        }
      }
    })
    this.state.dataInit = dataFilter;
    this.setState({...this.state});
    this.getBookingHours();
  }

  getBookingHours() {
    System.actions.bookingHours.request({studio_id: this.state.studioId}).then(res => {
      if ( res.data ) {
        let data = res.data.data.bookingHours;
        this.getSchedule(data);
      }
    })
  }

  getSchedule(data) {
    if (data.length > 0) {
      let endDate = moment(this.state.defaultDate).endOf('months').format('DD');
      let dataCreate = [];
      for (let count = 0; count < endDate; count++) {
        let dateCheck = moment(new Date(moment(this.state.defaultDate).format('YYYY-MM-DD')).setDate(count + 1)).format('YYYY-MM-DD');
        data.map(item => {
          let indexItemCheck = this.state.dataInit.findIndex(x => x.studio_booking_hour_id == item.studio_booking_hour_id && x.date == dateCheck && x.staff_type_in_schedule == this.props.params.staffType);
          if (indexItemCheck == -1) {
            let newItem = {
              id: null,
              date: dateCheck,
              studio_booking_hour_id: item.studio_booking_hour_id,
              staff_id: null,
              time: item.time,
              staff_name: item.staff_name,
              staff_type_in_schedule: this.props.params.staffType
            }
            dataCreate.push(newItem);
          }
        })

        let itemCheckAll = {
          id: null,
          date: dateCheck,
          studio_booking_hour_id: 'studio_booking_hour_id',
          staff_id: null,
          time: '0:00',
          staff_type_in_schedule: this.props.params.staffType,
          type: 'all'
        }
        dataCreate.push(itemCheckAll);
      }
      let dataEvent = [...this.state.dataInit,...dataCreate];
      this.state.dataEvent = dataEvent;
      this.setState({...this.state}, () => {
        this.getEvent();
      })
    }
  }

  onChange(name, e) {
    this.state.events = [];
    this.state.dataPatch = [];
    this.state[name] = e.target.value;
    this.setState({...this.state});
    if (name == 'studioId') {
      this.state.staffId = '';
      this.getStaff()
    } else if (name == 'staffId') {
      this.getEvent()
    } else if (name == 'date') {
      this.state.defaultDate = moment(e.target.value).format('YYYY-MM-DD')
      this.setState({...this.state});
      this.getListData();
    }
  }

  onChangeCheckBoxAll( date ) {
    if(!this.state.staffId || this.state.staffId == 'staffId' || this.state.staffId == 'null') {
      if(this.props.params.staffType == 1) {
        Toastr(msg.warningPhotographer, 'warning')
      } else {
        Toastr(msg.warningHairmake, 'warning')
      }
    } else {
      let events = [...this.state.events];
      if (this.checkAll(date)) {
        let dataCheck = events.filter(state => {return state.date == date && state.staff_id == this.state.staffId && state.type != 'all'});
        dataCheck.map(item => {
          let indexItemCheck = this.state.dataPatch.findIndex(itemPatch => itemPatch.date == item.date && itemPatch.studio_booking_hour_id == item.studio_booking_hour_id);
          let indexItem = this.state.events.findIndex(event => event.date == item.date && event.studio_booking_hour_id == item.studio_booking_hour_id);

          if (indexItemCheck != -1) {
            this.state.dataPatch.splice(indexItemCheck, 1);
            this.state.events[indexItem].staff_id = null;
          } else {
            let newItem = {
              id: this.state.events[indexItem].id,
              studio_booking_hour_id: this.state.events[indexItem].studio_booking_hour_id,
              date: this.state.events[indexItem].date,
              staff_type_in_schedule: this.props.params.staffType,
              staff_id: null
            }
            this.state.dataPatch.push(newItem);
            this.state.events[indexItem].staff_id = null;
          }
        })
        this.setState({...this.state})
      } else {
        let dataCheck = events.filter(state => {return state.date == date && state.staff_id != this.state.staffId && state.type != 'all'});
        dataCheck.map(item => {
          let indexItemCheck = this.state.dataPatch.findIndex(itemPatch => itemPatch.date == item.date && itemPatch.studio_booking_hour_id == item.studio_booking_hour_id);
          let indexItem = this.state.events.findIndex(event => event.date == item.date && event.studio_booking_hour_id == item.studio_booking_hour_id);

          if (indexItemCheck != -1) {
            this.state.dataPatch.splice(indexItemCheck, 1);
            this.state.events[indexItem].staff_id = this.state.staffId;
          } else {
            let newItem = {
              id: this.state.events[indexItem].id,
              studio_booking_hour_id: this.state.events[indexItem].studio_booking_hour_id,
              date: this.state.events[indexItem].date,
              staff_type_in_schedule: this.props.params.staffType,
              staff_id: this.state.staffId
            }
            this.state.dataPatch.push(newItem);
            this.state.events[indexItem].staff_id = this.state.staffId;
          }
        })
        this.setState({...this.state})
      }
    }
  }

  checkAll(date) {
    let events = [...this.state.events];
    let dataCheck = events.filter(state => {return state.date == date && state.staff_id == this.state.staffId});
    if (dataCheck.length == this.state.countBookingHours) {
      return true
    } else {
      return false
    }
  }

  getEvent() {
    let data = this.state.dataEvent;
    this.state.loading = true;
    this.setState({...this.state});
    this.state.events = [];
    data.map(item => {
      if (item && item.staff_type_in_schedule == this.props.params.staffType) {
        let newItem = {
          id: item.id,
          staff_id: item.staff_id,
          date: item.date,
          type: item.type,
          staff_name: item.staff_name,
          studio_booking_hour_id: item.studio_booking_hour_id,
          start: new Date((item.date + " " +item.time)),
          end: new Date((item.date + " " +item.time)),
        }
        this.state.events.push(newItem);
      }
    })
    this.state.loading = false;
    this.setState({...this.state});
  }

  editSchedule() {
    if (this.state.dataPatch.length > 0) {
      this.state.loadingSubmit = true;
      this.setState({...this.state});
      let params = this.getParams();
      if (this.state.dataPatch.length > 0) {
        StaffSchedule.actions.edit.request('', params).then(res => {
          Toastr(msg.staffScheduleUdateSuccess, 'success');
          this.goBack();
          this.state.loadingSubmit = false;
          this.setState({...this.state});
        }).catch(err => {
          if(err.response && err.response.data.errors.length > 0) {
            err.response.data.errors.map((errors, i) => {
              Toastr(errors, 'error');
            })
          } else {
            Toastr(msg.systemFail, 'error');
          }
          this.state.loadingSubmit = false;
          this.setState({...this.state});
        })
      } else {
        Toastr(msg.staffScheduleUdateSuccess, 'success');
        this.goBack();
        this.state.loadingSubmit = false;
        this.setState({...this.state});
      }
    } else {
      Toastr(msg.staffScheduleUdateSuccess, 'success');
      this.goBack();
    }
  }

  getParams() {
    let params = {
      studio_id: this.state.studioId,
      type: this.props.params.staffType,
    }
    let old_staff_schedules = [];
    let new_staff_schedules = [];
    this.state.dataPatch.map(item => {
      if (item.id) {
        let newItem = {
          id: item.id,
          staff_id: item.staff_id
        }
        old_staff_schedules.push(newItem)
      } else {
        let newItem = {
          staff_id: item.staff_id,
          studio_booking_hour_id: item.studio_booking_hour_id,
          date: item.date
        }
        new_staff_schedules.push(newItem)
      }
    })
    if (old_staff_schedules.length > 0) {
      params.old_staff_schedules = old_staff_schedules;
    }
    if (new_staff_schedules.length > 0) {
      params.new_staff_schedules = new_staff_schedules;
    }
    return params;
  }

  goBack() {
    this.props.dispatch({type: 'STAFF_SCHEDULE_GO_BACK'});
    this.props.history.push('/staff-schedules');
  }

  onNavigate(e) {
    let newDate = moment(e).format(CONFIG.DateFormat);
    this.state.path.date = newDate;
    this.changePath();
  }

  changePath() {
    let newPath = '/staff-schedules' + '/' + this.state.path.studioId + '/' + this.state.path.staffId + '/' + this.state.path.date
    window.history.pushState("", "", newPath);
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
    let countRow = document.getElementsByClassName('rbc-month-row').length;
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
      <div className="item-check-box mb0 mt0 pl0">
        {event.type == 'all' ? (
          <input type="checkbox" className="form-checkbox" onChange={this.onChangeCheckBoxAll.bind(this, event.date)} id={event.date + event.studio_booking_hour_id } checked={this.checkAll(event.date)}/>
          ) : (
          <input type="checkbox" className="form-checkbox" onChange={this.onChangeCheckBox.bind(this, event.date, event.studio_booking_hour_id)} id={event.date + event.studio_booking_hour_id } checked={event.staff_id == this.state.staffId ? true : false}/>
        )}
        <label className="checkmark"></label>
        {event.type == 'all' ? (
          <label className="check-box-label" htmlFor={event.date + event.studio_booking_hour_id}>終日</label>
          ) : (
          <label className="check-box-label" title={`${moment(event.start).format('HH:mm')}${event.staff_name ? '(' + event.staff_name + ')' : ''}`} htmlFor={event.date + event.studio_booking_hour_id}>{moment(event.start).format('HH:mm')}{event.staff_name ? '(' + event.staff_name + ')' : ''}</label>
        )}
      </div>)
    let height = this.state.countBookingHours ? (((this.state.countBookingHours + 1) * 29 * countRow) + 315 + 53) : 0;
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>カメラマン／ヘアメイクスケジュール情報 <small>編集</small></h2>
        </div>
        <div className='wrap-edit-schedule mt25 pt25'>
          <div className='row pl30 pr30 mt5'>
            <DropDown className='col-xs-4' label='スタジオを選択' onChange={this.onChange.bind(this, 'studioId')} name='studioId' value={this.state.studioId} options={this.state.listStudio} keyName='id' valueName='name'/>
            <DropDown className='col-xs-4' label={this.props.params.staffType == 1 ? 'カメラマンを選択' : 'ヘアメイクを選択'} showPlaceholder={true} placeholder={this.props.params.staffType == 1 ? 'カメラマンを選択' : 'ヘアメイクを選択'} onChange={this.onChange.bind(this, 'staffId')} name='staffId' value={this.state.staffId} options={this.state.listStaff} keyName='id' valueName='name'/>

            <MonthPicker className='col-xs-4' label='年月を選択' onChange={this.onChange.bind(this, 'date')} name='date' value={this.state.date}/>
          </div>
          <div className={`calendar-wrap calendar-flex-wrap ${this.state.loading ? 'loading' : ''}`} id='content-list-manager' style={{minHeight: height, height: height || 1238}}>
            <ShowIf condition={this.state.loading}>
              <div className='icon-loading'></div>
            </ShowIf>
            <BigCalendar
              events={this.state.events}
              views={["month"]}
              showMultiDayTimes
              messages={messages}
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
              defaultDate={this.state.defaultDate}
              date={new Date(this.state.defaultDate)}
              components={{event: Event, eventWrapper: MyWrapperComponent}}
              onView={this.onChangeCalendar.bind(this)}
              culture="en-GB"
              onNavigate={this.onNavigate.bind(this)}
            />
            <div className='pt30'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loadingSubmit} onClick={this.editSchedule.bind(this)}>保存</button>
              <button className='btn-close-confirm' disabled={this.state.loadingSubmit} onClick={this.goBack.bind(this)}>キャンセル</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Edit.defaultProps = {
  listStudio: []
}

function BindStateToProps(state) {
  return {
    listStudio: state.systemData.listStudio
  }
}

export default connect(BindStateToProps)(withRouter(Edit));

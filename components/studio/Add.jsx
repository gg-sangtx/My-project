import React, { Component } from 'react';
import { Input, DropDown, GroupCheckBox, CoupleInput, TextArea, UploadImage, GroupDatePicker, CoupleTime, ListStaff } from 'components/inputform';
import { connect } from 'react-redux';
import { Studios, System } from 'api';
import {ShowIf} from 'components/utils';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import * as CONFIG from 'constants/datetime';
import moment from 'moment';
import {updateSystemData} from 'base/actions/systemData';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      address1: '',
      address2: '',
      business_hours: '',
      holidays_text: '',
      code: '',
      created_at: '',
      detail_image_text: '',
      detail_image_url: '',
      id: '',
      main_image_text: '',
      main_image_url: '',
      map_url: '',
      dataParking: [
        {
          key: 0,
          name: 'なし'
        },
        {
          key: 1,
          name: 'あり'
        }
      ],
      parking_flag: 1,
      name: '',
      alphabet_name: '',
      postal_code1: '',
      postal_code2: '',
      prefecture: '東京都',
      saturday_end_time: '',
      saturday_start_time: '',
      sunday_end_time: '',
      sunday_start_time: '',
      tel: '',
      updated_at: '',
      weekday_end_time: '',
      weekday_start_time: '',

      fixed_holidays: [],
      holidays: [],
      booking_hours: [],
      staffs: [],
      dataStaffOne: [],
      dataStaffTwo: [],
      listStaffOneData: [],
      listStaffTwoData: [],
      mainFile: '',
      detailFile: '',
      url: '',
      h1: '',
      meta_title: '',
      meta_keywords: '',
      meta_description: '',
      ogp_title: '',
      ogp_description: '',
      ogp_image: '',

      dataLocation: this.props.dataLocation,
      dataCheckbox: this.props.fixedHolidays,
      bookingHours: this.props.bookingHours
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataLocation != this.props.dataLocation) {
      this.state.dataLocation = nextProps.dataLocation;
    }
    if (nextProps.fixedHolidays != this.props.fixedHolidays) {
      this.state.dataCheckbox = nextProps.fixedHolidays;
    }
    if (nextProps.bookingHours != this.props.bookingHours) {
      this.state.bookingHours = nextProps.bookingHours;
    }
    this.setState({...this.state});
  }

  componentDidMount() {
    if (this.props.edit == true) {
      let data = [...this.props.dataList];
      let dataFilter = data.filter(state => {
        return state.id == this.props.params.id;
      })
      if (dataFilter.length > 0) {
        this.getData(dataFilter[0])
        this.getDetail(this.props.params.id, 'OnlyOtherData');
      } else {
        this.getDetail(this.props.params.id, 'All');
      }
      this.getStaffOne();
      this.getStaffTwo();
    }
  }

  getStaffOne() {
    let params = {
      types: [1],
      limit: 0,
      studios_can_work: [this.props.params.id],
      is_sub_list: 1
    }
    System.actions.staffs.request(params).then(res => {
      if (res && res.data) {
        this.state.dataStaffOne = res.data.data.staffs;
        this.setState({...this.state});
      }
    }).catch(err => {
      if (err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getStaffTwo() {
    let params = {
      types: [2],
      limit: 0,
      studios_can_work: [this.props.params.id],
      is_sub_list: 1
    }
    System.actions.staffs.request(params).then(res => {
      if (res && res.data) {
        this.state.dataStaffTwo = res.data.data.staffs;
        this.setState({...this.state});
      }
    }).catch(err => {
      if (err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getDetail(id, type) {
    Studios.actions.getStudio.request({id: id}).then(res => {
      if (res && res.data) {
        if (type == 'OnlyOtherData') {
          this.getDataOther(res.data.data)
        } else {
          this.getData(res.data.data.studio)
          this.getDataOther(res.data.data)
        }
      }
    }).catch(err => {
      if (err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getData(data) {
    this.state.address1 = data.address1 ? data.address1 : '';
    this.state.address2 = data.address2 ? data.address2 : '';
    this.state.business_hours = data.business_hours ? data.business_hours : '';
    this.state.holidays_text = data.holidays_text ? data.holidays_text : '';
    this.state.code = data.code ? data.code : '';
    this.state.created_at = data.created_at ? data.created_at : '';
    this.state.detail_image_text = data.detail_image_text ? data.detail_image_text : '';
    this.state.detail_image_url = data.detail_image_url ? data.detail_image_url : '';
    this.state.id = data.id ? data.id : '';
    this.state.main_image_text = data.main_image_text ? data.main_image_text : '';
    this.state.main_image_url = data.main_image_url ? data.main_image_url : '';
    this.state.map_url = data.map_url ? data.map_url : '';
    this.state.parking_flag = data.parking_flag == 1 ? 1 : 0;
    this.state.name = data.name ? data.name : '';
    this.state.alphabet_name = data.alphabet_name ? data.alphabet_name : '';
    this.state.postal_code1 = data.postal_code1 ? data.postal_code1 : '';
    this.state.postal_code2 = data.postal_code2 ? data.postal_code2 : '';
    this.state.prefecture = data.prefecture ? data.prefecture : '';
    this.state.saturday_end_time = data.saturday_end_time ? data.saturday_end_time : '';
    this.state.saturday_start_time = data.saturday_start_time ? data.saturday_start_time : '';
    this.state.sunday_end_time = data.sunday_end_time ? data.sunday_end_time : '';
    this.state.sunday_start_time = data.sunday_start_time ? data.sunday_start_time : '';
    this.state.tel = data.tel ? data.tel : '';
    this.state.updated_at = data.updated_at ? data.updated_at : '';
    this.state.weekday_end_time = data.weekday_end_time ? data.weekday_end_time : '';
    this.state.weekday_start_time = data.weekday_start_time ? data.weekday_start_time : '';
    this.setState({...this.state})
  }

  getDataOther(data) {
    let dataSeo = data.seo;
    if (data.booking_hours.length > 0) {
      this.state.booking_hours = data.booking_hours
    }
    if (data.fixed_holidays.length > 0) {
      data.fixed_holidays.map(item => {
        this.state.fixed_holidays.push(item.day)
      })
    }
    if (data.staffs.length > 0) {
      let dataOne = [...data.staffs];
      let dataTwo = [...data.staffs];
      let dataOneFilter = dataOne.filter(state => {return state.type == 1});
      let dataTwoFilter = dataTwo.filter(state => {return state.type == 2});
      this.state.listStaffOneData = dataOneFilter;
      this.state.listStaffTwoData = dataTwoFilter;
      this.state.listStaffOne = dataOneFilter;
      this.state.listStaffTwo = dataTwoFilter;
    }

    this.state.url = dataSeo.url ? dataSeo.url : '';
    this.state.h1 = dataSeo.h1 ? dataSeo.h1 : '';
    this.state.meta_title = dataSeo.meta_title ? dataSeo.meta_title : '';
    this.state.meta_keywords = dataSeo.meta_keywords ? dataSeo.meta_keywords : '';
    this.state.meta_description = dataSeo.meta_description ? dataSeo.meta_description : '';
    this.state.ogp_title = dataSeo.ogp_title ? dataSeo.ogp_title : '';
    this.state.ogp_description = dataSeo.ogp_description ? dataSeo.ogp_description : '';
    this.state.ogp_image = dataSeo.ogp_image ? dataSeo.ogp_image : '';

    if (data.holidays.length > 0) {
      data.holidays.map(item => {
        this.state.holidays.push(item.date)
      })
    }
    this.setState({...this.state})
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  removeImage(name) {
    this.state[name] = '';
    if (name == 'detailFile') {
      this.state.detail_image_url = '';
    }
    if (name == 'mainFile') {
      this.state.main_image_url = '';
    }
    this.setState({
      ...this.state
    })
  }

  getParams() {
    let params = {};
    params.address1 = this.state.address1 ? this.state.address1 : '';
    params.address2 = this.state.address2 ? this.state.address2 : '';
    params.business_hours = this.state.business_hours ? this.state.business_hours : '';
    params.holidays_text = this.state.holidays_text ? this.state.holidays_text : '';
    params.code = this.state.code ? this.state.code : '';
    params.created_at = this.state.created_at ? this.state.created_at : '';
    params.detail_image_text = this.state.detail_image_text ? this.state.detail_image_text : '';
    params.main_image_text = this.state.main_image_text ? this.state.main_image_text : '';
    params.map_url = this.state.map_url ? this.state.map_url : '';
    params.parking_flag = this.state.parking_flag == 1 ? 1 : 0;
    params.name = this.state.name ? this.state.name : '';
    params.alphabet_name = this.state.alphabet_name ? this.state.alphabet_name : '';
    params.postal_code1 = this.state.postal_code1 ? this.state.postal_code1 : '';
    params.postal_code2 = this.state.postal_code2 ? this.state.postal_code2 : '';
    params.prefecture = this.state.prefecture ? this.state.prefecture : '';
    params.saturday_end_time = (this.state.saturday_end_time && typeof this.state.saturday_end_time != 'string') ? moment(this.state.saturday_end_time).format(CONFIG.TimeFormat) : (this.state.saturday_end_time ? this.state.saturday_end_time : '');
    params.saturday_start_time = (this.state.saturday_start_time && typeof this.state.saturday_start_time != 'string') ? moment(this.state.saturday_start_time).format(CONFIG.TimeFormat) : (this.state.saturday_start_time ? this.state.saturday_start_time : '');
    params.sunday_end_time = (this.state.sunday_end_time && typeof this.state.sunday_end_time != 'string') ? moment(this.state.sunday_end_time).format(CONFIG.TimeFormat) : (this.state.sunday_end_time ? this.state.sunday_end_time : '');
    params.sunday_start_time = (this.state.sunday_start_time && typeof this.state.sunday_start_time != 'string') ? moment(this.state.sunday_start_time).format(CONFIG.TimeFormat) : (this.state.sunday_start_time ? this.state.sunday_start_time : '');
    params.tel = this.state.tel ? this.state.tel : '';
    params.updated_at = this.state.updated_at ? this.state.updated_at : '';
    params.weekday_end_time = (this.state.weekday_end_time && typeof this.state.weekday_end_time != 'string') ? moment(this.state.weekday_end_time).format(CONFIG.TimeFormat) : (this.state.weekday_end_time ? this.state.weekday_end_time : '');
    params.weekday_start_time = (this.state.weekday_start_time && typeof this.state.weekday_start_time != 'string') ? moment(this.state.weekday_start_time).format(CONFIG.TimeFormat) : (this.state.weekday_start_time ? this.state.weekday_start_time : '');
    params.seo = {
      url: this.state.url ? this.state.url : '',
      h1: this.state.h1 ? this.state.h1 : '',
      meta_title: this.state.meta_title ? this.state.meta_title : '',
      meta_keywords: this.state.meta_keywords ? this.state.meta_keywords : '',
      meta_description: this.state.meta_description ? this.state.meta_description : '',
      ogp_title: this.state.ogp_title ? this.state.ogp_title : '',
      ogp_description: this.state.ogp_description ? this.state.ogp_description : '',
      ogp_image: this.state.ogp_image ? this.state.ogp_image : ''
    }
    params.booking_hours = [];
    if (this.state.booking_hours.length > 0) {
      this.state.booking_hours.map(item => {
        let newItem = {
          id: item.id,
          minutes: item.minutes || ''
        }
        params.booking_hours.push(newItem);
      })
    }
    params.fixed_holidays = this.state.fixed_holidays.length > 0 ? this.state.fixed_holidays : [];
    params.holidays = [];
    if ( this.state.holidays.length > 0 ) {
      this.state.holidays.map(item => {
        params.holidays.push(moment(item).format(CONFIG.DateFormat))
      })
    }

    if (this.props.edit == true) {
      params.staffs = [];
      if (this.state.listStaffOneData.length > 0) {
        this.state.listStaffOneData.map(item => {
          if (item.id) {
            let paramItem = {
              id: Number(item.id),
              sort_value: item.sort_value,
              type: item.type
            }
            params.staffs.push(paramItem)
          }
        })
      }
      if (this.state.listStaffTwoData.length > 0) {
        this.state.listStaffTwoData.map(item => {
          if (item.id) {
            let paramItem = {
              id: Number(item.id),
              sort_value: item.sort_value,
              type: item.type
            }
            params.staffs.push(paramItem)
          }
        })
      }
    }

    return params
  }

  createStudio(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({...this.state});
      let params = this.getParams();
      if (this.state.detailFile && this.state.mainFile) {
        Promise.all([
          this.upload(this.state.mainFile, 'mainFile'),
          this.upload(this.state.detailFile, 'detailFile'),
        ]).then(responses => {
          params.main_image_url = responses[0].url ? responses[0].url : null;
          params.detail_image_url = responses[1].url ? responses[1].url : null;
          if (this.props.edit == true) {
            this.patchProcess(params)
          } else {
            this.postProcess(params);
          }
        });
      } else if (this.state.mainFile) {
        Promise.all([
          this.upload(this.state.mainFile, 'mainFile'),
        ]).then(responses => {
          params.main_image_url = responses[0].url ? responses[0].url : null;
          params.detail_image_url = this.state.detail_image_url ? this.state.detail_image_url : null;
          if (this.props.edit == true) {
            this.patchProcess(params)
          } else {
            this.postProcess(params);
          }
        })
      } else if (this.state.detailFile) {
        Promise.all([
          this.upload(this.state.detailFile, 'detailFile'),
        ]).then(responses => {
          params.detail_image_url = responses[0].url ? responses[0].url : null;
          params.main_image_url = this.state.main_image_url ? this.state.main_image_url : null;
          if (this.props.edit == true) {
            this.patchProcess(params)
          } else {
            this.postProcess(params);
          }
        })
      } else {
        params.main_image_url = this.state.main_image_url ? this.state.main_image_url : null;
        params.detail_image_url = this.state.detail_image_url ? this.state.detail_image_url : null;
        if (this.props.edit == true) {
          this.patchProcess(params)
        } else {
          this.postProcess(params);
        }
      }
    }
    return
  }

  postProcess(params) {
    Studios.actions.postStudio.request('',params).then(res => {
      Toastr(params.name + msg.studioCreateSuccess, 'success');
      this.props.dispatch({type: 'STUDIO_GO_BACK'});
      this.updateSystemData();
      this.props.history.push('/studios');
      this.state.loading = false;
      this.setState({...this.state});
    }).catch(err => {
      if (err.response && err.response.data && err.response.data.errors.length > 0) {
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

  patchProcess(params) {
    Studios.actions.updateStudio.request({id: this.props.params.id},params).then(res => {
      Toastr(params.name + msg.studioEditSuccess, 'success');
      this.props.dispatch({type: 'STUDIO_GO_BACK'});
      this.updateSystemData();
      this.props.history.push('/studios');
      this.state.loading = false;
      this.setState({...this.state});
      return;
    }).catch(err => {
      if (err.response && err.response.data && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.loading = false;
      this.setState({...this.state});
      return;
    })
  }

  upload(file, type) {
    return System.actions.uploadFile.request('',{field: 'filename', file: file}).then(res => {
      if (res && res.data) {
        let dataResuilt = {
          type: type,
          url: res.data.data.fileUrl
        }
        return dataResuilt
      }
    }).catch(err => {
      this.state.loading = false;
      this.setState({...this.state});
    })
  }

  validateSubmitForm() {
    let pass = true;
    this.props.validators['form'].map(validator => {
      if (pass) {
        pass = validator.validate();
      } else {
        validator.validate();
      }
    })
    return pass;
  }

  componentWillUnmount() {
    this.props.validators['form'] = [];
  }

  checkAll() {
    this.checkBox.checkAll();
  }

  unCheckAll() {
    this.checkBox.unCheckAll();
  }

  updateSystemData() {
    this.props.dispatch(updateSystemData('listStudio')).then(res => {
      if (res.data) {
        this.props.dispatch({type: 'UPDATE_SYSTEM_SUB_DATA', data: res.data, key: 'listStudio'})
      }
    })

    this.props.dispatch(updateSystemData('studioCanWork')).then(res => {
      if (res.data) {
        this.props.dispatch({type: 'UPDATE_SYSTEM_SUB_DATA', data: res.data, key: 'studioCanWork'})
      }
    })

  }

  goBack() {
    this.props.dispatch({type: 'STUDIO_GO_BACK'});
    this.props.history.push('/studios');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>スタジオ情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>スタジオ情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>
            <Input className='col-xs-6 mb15 clear-left' label='スタジオコード' require bindValidator={this} channel='form' type='text' maxLength='40' name='code' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
            <Input className='col-xs-6 mb15' label='スタジオ名' require bindValidator={this} channel='form' type='text' maxLength='40' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
            <Input className='col-xs-6 mb15' label='スタジオ名（ローマ字）' require bindValidator={this} channel='form' type='text' maxLength='40' name='alphabet_name' value={this.state.alphabet_name} onChange={this.onChange.bind(this, 'alphabet_name')}/>
            <DropDown className='col-xs-6 mb15 clear-left' label='都道府県' require bindValidator={this} channel='form' options={this.state.dataLocation} keyName='value' valueName='value' value={this.state.prefecture} onChange={this.onChange.bind(this, 'prefecture')}/>
            <CoupleInput className='col-xs-6 mb15' label='郵便番号' require bindValidator={this} channel='form' valueMin={this.state.postal_code1} onChangeMin={this.onChange.bind(this, 'postal_code1')} valueMax={this.state.postal_code2} onChangeMax={this.onChange.bind(this, 'postal_code2')}/>

            <Input className='col-xs-6 mb15 clear-left' label='住所1' require bindValidator={this} channel='form' type='text' maxLength='40' name='address1' value={this.state.address1} onChange={this.onChange.bind(this, 'address1')}/>
            <Input className='col-xs-6 mb15' label='住所2' type='text' maxLength='40' name='address2' value={this.state.address2} onChange={this.onChange.bind(this, 'address2')}/>
            <Input className='col-xs-6 mb15 clear-left' label='電話番号' require bindValidator={this} channel='form' type='text' maxLength='40' name='tel' value={this.state.tel} onChange={this.onChange.bind(this, 'tel')}/>

            <CoupleTime className='col-xs-6 mb15' label='営業時間（平日）' require bindValidator={this} channel='form' valueMin={this.state.weekday_start_time} onChangeMin={this.onChange.bind(this, 'weekday_start_time')} valueMax={this.state.weekday_end_time} onChangeMax={this.onChange.bind(this, 'weekday_end_time')} name='weekday_end_time'/>

            <CoupleTime className='col-xs-6 mb15 clear-left' label='営業時間（土曜日）' require bindValidator={this} channel='form' valueMin={this.state.saturday_start_time} onChangeMin={this.onChange.bind(this, 'saturday_start_time')} valueMax={this.state.saturday_end_time} onChangeMax={this.onChange.bind(this, 'saturday_end_time')} name='saturday_end_time'/>

            <CoupleTime className='col-xs-6 mb15' label='営業時間（日曜日・祝日）' require bindValidator={this} channel='form' valueMin={this.state.sunday_start_time} onChangeMin={this.onChange.bind(this, 'sunday_start_time')} valueMax={this.state.sunday_end_time} onChangeMax={this.onChange.bind(this, 'sunday_end_time')} name='sunday_end_time'/>

            <div className='wrap-list-check-box'>
              <GroupCheckBox label='定休日' ref={(checkBox) => {this.checkBox = checkBox}} name='fixed_holidays' data={this.state.dataCheckbox} value={this.state.fixed_holidays} onChange={this.onChange.bind(this, 'fixed_holidays')} keyName='key' valueName='value'/>
            </div>
            <div className='col-sm-12 mb15'>
              <GroupDatePicker label='休日' value={this.state.holidays} onChange={this.onChange.bind(this, 'holidays')}/>
            </div>
            <div className='wrap-list-check-box'>
              <GroupCheckBox label='予約可能時間' require bindValidator={this} valueInput='minutes' hasInput={true} channel='form' ref={(checkBox) => {this.checkBox = checkBox}} name='booking_hours' data={this.state.bookingHours} value={this.state.booking_hours} onChange={this.onChange.bind(this, 'booking_hours')} keyName='id' valueName='time'/>
            </div>
            <TextArea className='col-sm-12 mb15' label='営業時間表記' require bindValidator={this} channel='form' maxLength='255' name='business_hours' value={this.state.business_hours} onChange={this.onChange.bind(this, 'business_hours')}/>

            <TextArea className='col-sm-12 mb15' label='定休日表記' require bindValidator={this} channel='form' maxLength='255' name='holidays_text' value={this.state.holidays_text} onChange={this.onChange.bind(this, 'holidays_text')}/>

            <Input label='Google Map URL' require bindValidator={this} channel='form' type='text' maxLength='40' name='map_url' value={this.state.map_url} onChange={this.onChange.bind(this, 'map_url')}/>

            <DropDown className='col-xs-6 mb15 clear-left' label='駐車場フラグ' bindValidator={this} channel='form' options={this.state.dataParking} keyName='key' valueName='name' value={this.state.parking_flag} onChange={this.onChange.bind(this, 'parking_flag')}/>

            <div className='col-sm-12'>
              <UploadImage label='メイン画像' require bindValidator={this} channel='form' name='main_image_url' value={this.state.main_image_url} removeImage={this.removeImage.bind(this, 'mainFile')} onChange={this.onChange.bind(this, 'mainFile')}/>
            </div>
            <Input label='メイン画像 alt' require bindValidator={this} channel='form' type='text' maxLength='40' name='main_image_text' value={this.state.main_image_text} onChange={this.onChange.bind(this, 'main_image_text')}/>

            <div className='col-sm-12'>
              <UploadImage label='詳細画像' name='detail_image_url' value={this.state.detail_image_url} removeImage={this.removeImage.bind(this, 'detailFile')} onChange={this.onChange.bind(this, 'detailFile')}/>
            </div>
            <Input label='詳細画像 alt' type='text' maxLength='40' name='detail_image_text' value={this.state.detail_image_text} onChange={this.onChange.bind(this, 'detail_image_text')}/>

            <ShowIf condition={this.props.edit == true}>
              <div>
                <ListStaff keyName='id' valueName='name' className='col-xs-12 no-gutter mb15' label='メインカメラマン' labelShowOnNull='選択できるメインカメラマンがいません' labelAddnew='＋メインカメラマンを追加' type={1} dataStaff= {this.state.dataStaffOne} value={this.state.listStaffOne} onChange={this.onChange.bind(this, 'listStaffOneData')}/>
                <ListStaff keyName='id' valueName='name' className='col-xs-12 no-gutter mb15' label='メインスタイリスト' labelShowOnNull='選択できるメインヘアメイクがいません' labelAddnew='＋メインヘアメイクを追加' type={2} dataStaff= {this.state.dataStaffTwo} value={this.state.listStaffTwo} onChange={this.onChange.bind(this, 'listStaffTwoData')}/>
              </div>
            </ShowIf>
            <div className='col-xs-12 no-gutter mb15'>
              <Input label='h1' className='col-xs-12 mb15' name='h1' value={this.state.h1} onChange={this.onChange.bind(this, 'h1')} require bindValidator={this} channel='form'/>
              <Input label='title' className='col-xs-12 mb15' name='meta_title' value={this.state.meta_title} onChange={this.onChange.bind(this, 'meta_title')} require bindValidator={this} channel='form'/>
              <Input label='meta:keywords' className='col-xs-12 mb15' name='meta_keywords' value={this.state.meta_keywords} onChange={this.onChange.bind(this, 'meta_keywords')} require bindValidator={this} channel='form'/>
              <TextArea label='meta:description' maxLength={1023} className='col-xs-12' name='meta_description' value={this.state.meta_description} onChange={this.onChange.bind(this, 'meta_description')} require bindValidator={this} channel='form'/>
            </div>
            <div className='col-xs-12 no-gutter mb15'>
              <Input label='og:title' className='col-xs-12 mb15' name='ogp_title' value={this.state.ogp_title} onChange={this.onChange.bind(this, 'ogp_title')} require bindValidator={this} channel='form'/>
              <TextArea label='og:description' maxLength={1023} className='col-xs-12' name='ogp_description' value={this.state.ogp_description} onChange={this.onChange.bind(this, 'ogp_description')} require bindValidator={this} channel='form'/>
            </div>

            <div className='col-xs-12 pt15'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.createStudio.bind(this)}>保存</button>
              <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Add.defaultProps={
  validators: {
    form: []
  },
  dataList: [],
  dataLocation: [],
  fixedHolidays: [],
  bookingHours: [],
}

function bindStateToProps(state) {
  return {
    dataLocation: state.systemData.prefectures,
    fixedHolidays: state.systemData.fixedHolidays,
    bookingHours: state.systemData.bookingHours,
    dataList: state.listStudios.data
  }
}

export default connect(bindStateToProps)(withRouter(Add))

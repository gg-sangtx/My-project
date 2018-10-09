import React, { Component } from 'react';
import {Input, DropDown, GroupCheckBox, UploadImage, ReactDateTimeRangePicker} from 'components/inputform';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import {Coupons, System} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import {option} from "constants/option";
import { withRouter } from 'react-router';
import moment from 'moment';
import * as CONFIG from 'constants/datetime';
import {DateTimeSecondFormat} from 'constants/datetime';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      code: '',
      name: '',
      type: 1,
      status: 1,
      value: '',
      detailFile: '',
      image_alt: '',
      start_time: '',
      end_time: '',
      studios: [],
      dataTypes: option.couponsType ? option.couponsType : [],
      dataStatus: option.couponsStatus ? option.couponsStatus : [],
      loading: false,
      resetLoading: false,
      dataStudioCheckbox: this.props.dataStudioCheckbox || [],
      dataUpdateStudio: [],
    }
  }

  componentDidMount() {
    if(this.props.params && this.props.params.id) {
      this.getInfo(this.props.params.id);
    }
    this.getDataStudioCheckbox();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.dataStudioCheckbox != nextProps.dataStudioCheckbox) {
      this.state.dataStudioCheckbox = nextProps.dataStudioCheckbox;
    }
    this.setState({...this.state})
  }

  getInfo(id) {
    let dataFilter = [];
    if(dataFilter.length > 0) {
      this.state.code = dataFilter[0].code ? dataFilter[0].code : '';
      this.state.name = dataFilter[0].name ? dataFilter[0].name : '';
      this.state.type = dataFilter[0].type ? dataFilter[0].type : '';
      this.state.status = dataFilter[0].status ? dataFilter[0].status : 1;
      this.state.value = dataFilter[0].value ? dataFilter[0].value : '';
      this.state.start_time = dataFilter[0].start_time ? dataFilter[0].start_time : '';
      this.state.end_time = dataFilter[0].end_time ? dataFilter[0].end_time : '';
      this.state.image_alt = dataFilter[0].image_alt ? dataFilter[0].image_alt : '';
      this.state.detail_image_url = dataFilter[0].image_url ? dataFilter[0].image_url : '';
      if(dataFilter[0].studios && dataFilter[0].studios.length > 0) {
        dataFilter[0].studios.map(item => {
          this.state.dataUpdateStudio.push(item.id)
        })
      }
      this.setState({
        ...this.state
      })
    } else {
      Coupons.actions.getCoupons.request({id: id}).then(res => {
        if(res && res.data) {
          let data = res.data.data.coupon;
          this.state.code = data.code ? data.code : '';
          this.state.name = data.name ? data.name : '';
          this.state.type = data.type ? data.type : '';
          this.state.status = data.status ? data.status : 1;
          this.state.value = data.value || "";
          this.state.start_time = data.start_time ? new Date(data.start_time) : '';
          this.state.end_time = data.end_time ? new Date(data.end_time) : '';
          this.state.image_alt = data.image_alt ?  data.image_alt : '';
          this.state.detail_image_url = data.image_url;
          let newStudio = res.data.data.studios.map(item => {
            this.state.dataUpdateStudio.push(item.id)
          });
          this.state.studios = this.state.dataUpdateStudio;
          this.setState({
            ...this.state
          })
        }
      }).catch(err => {
        if(err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
      })
    }
  }

  getDataStudioCheckbox() {
    Coupons.actions.listStudio.request().then(res => {
      if(res.data) {
        this.state.dataStudioCheckbox= res.data.data.studios.data;
      } else {
        this.state.dataStudioCheckbox = []
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
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  upload(file, type) {
    return System.actions.uploadFile.request('',{field: 'filename', file: file}).then(res => {
      if(res && res.data) {
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

  removeImage(name) {
    this.state[name] = '';
    this.setState({
      ...this.state
    })
  }

  createCoupon(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = this.getParams();
      if(this.state.detailFile) {
        Promise.all([
          this.upload(this.state.detailFile, 'detailFile'),
        ]).then(responses => {
          params.image_url = responses[0].url ? responses[0].url : null;
          if (this.props.edit == true) {
            this.patchProcess(params)
          } else {
            this.postProcess(params);
          }
        });
      } else {
        if (this.props.edit == true) {
          this.patchProcess(params)
        } else {
          this.postProcess(params);
        }
      }
    }
    return
  }

  getParams() {
    let params = {};
    params.code = this.state.code ? this.state.code : '';
    params.name = this.state.name ? this.state.name : '';
    params.type = this.state.type ? this.state.type : '';
    if(this.state.type == 3) {
      params.value = '';
    } else {
      params.value = this.state.value ? this.state.value : '';
    }
    params.status = this.state.status ? this.state.status : '';
    params.start_time = (this.state.start_time && typeof this.state.start_time != 'string') ? moment(this.state.start_time).format(CONFIG.DateTimeSecondFormat) : (this.state.start_time ? this.state.start_time : '');
    params.end_time = (this.state.end_time && typeof this.state.end_time != 'string') ? moment(this.state.end_time).format(CONFIG.DateTimeSecondFormat) : (this.state.end_time ? this.state.end_time : '');
    params.image_alt = this.state.image_alt ? this.state.image_alt : '';
    params.image_url = this.state.detail_image_url ? this.state.detail_image_url : '';
    params.studio_id = this.state.studios ? this.state.studios : []
    return params
  }

  patchProcess(params) {
    Coupons.actions.updateCoupons.request({id: this.props.params.id},params).then(res => {
      Toastr(this.state.name + ' ' + msg.updateCoupon, 'success');
      this.props.dispatch({type: 'COUPON_GO_BACK'});
      this.props.history.push('/coupons');
      this.state.loading = false;
      this.setState({...this.state});
    }).catch(err => {
      if(err.response && err.response.data && err.response.data.errors.length > 0) {
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

  postProcess (params){
    Coupons.actions.postCoupons.request('', params).then(res => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(this.state.name + ' ' + msg.createCoupon, 'success');
      this.props.dispatch({type: 'COUPON_GO_BACK'});
      this.props.history.push('/coupons');
    }).catch(err => {
      if(err && err.response) {
        let message = err.response.data.errors;
        if(typeof message == String) {
          Toastr(message, 'error');
        } else if (message.length > 0) {
          message.map(error => {
            Toastr(error, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error')
        }
      } else {
        Toastr(msg.systemFail, 'error')
      }
      this.state.loading = false;
      this.setState({...this.state});
    })
  }

  validateSubmitForm() {
    let pass = true;
    this.props.validators['form'].map(validator => {
      if(pass) {
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
    this.checkBox.refs.wrappedComponent.checkAll();
  }

  unCheckAll() {
    this.checkBox.refs.wrappedComponent.unCheckAll();
  }

  onChangeStartDay(e) {
    this.state.start_time = e ? moment(e).format(DateTimeSecondFormat) : '';
    this.setState({...this.state})
  }

  onChangeEndDay(e) {
    this.state.end_time = e ? moment(e).format(DateTimeSecondFormat) : '';
    this.setState({...this.state})
  }

  checkAll() {
    this.checkBox.refs.wrappedComponent.checkAll();
  }

  goBack() {
    this.props.dispatch({type: 'COUPON_GO_BACK'});
    this.props.history.push('/coupons');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>クーポン情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>クーポン情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container'>
          <form className='search-form' method='javascript:voild(0)'>
            <div className='col-sm-12'>
              <Input className='col-sm-6 mb15' label='クーポンコード' require={true} bindValidator={this} type='text' channel='form' maxLength='40' name='code' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
              <Input className='col-sm-6 mb15' label='クーポン名' disabled={false} require={true} bindValidator={this} type='name' channel='form' maxLength='40' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
              <DropDown className='col-sm-6 mb15 clear-left' label='種類' placeholder='' require={true} bindValidator={this} type='text' channel='form' options={this.state.dataTypes} keyName='key' valueName='name' value={this.state.type} onChange={this.onChange.bind(this, 'type')}/>
              <ShowIf condition={this.state.type == 1 || this.state.type == 2}>
                <Input className='col-sm-6 mb15' label="値" disabled={false} require={false} hasUnit={true} perLabel={this.state.type == 1 ? '%' : '円'} bindValidator={this} type='number' channel='form' maxLength='40' name='value' value={this.state.value} onChange={this.onChange.bind(this, 'value')}/>
              </ShowIf>
              <div className='col-sm-12 mb15'>
                <UploadImage label='メイン画像' require={false} bindValidator={this} channel='form' name='detail_image_url' value={this.state.detail_image_url} removeImage={this.removeImage.bind(this, 'detailFile')} onChange={this.onChange.bind(this, 'detailFile')}/>
              </div>
              <div className="col-sm-3 clear-left mb15">
                <Input className="pl0 pr0" label='alt' type='text' maxLength='40' name='img_alt' value={this.state.image_alt} onChange={this.onChange.bind(this, 'image_alt')}/>
              </div>
              <DropDown className='col-sm-6 mb15 clear-left' label='ステータス' placeholder='' require={true} bindValidator={this} type='text' channel='form' options={this.state.dataStatus} keyName='key' valueName='name' value={this.state.status} onChange={this.onChange.bind(this, 'status')}/>
              <ReactDateTimeRangePicker
                onChangeStartDay={this.onChangeStartDay.bind(this)}
                onChangeEndDay={this.onChangeEndDay.bind(this)}
                startDate={this.state.start_time}
                alwayUpdate={true}
                endDate={this.state.end_time}
                update={this.props.goBack}
                timeFormat='HH:mm:ss'
                label='使用日時'
                className='col-xs-12 col-sm-6 mb15 clear-left'
              />
              <div className="col-xs-12 mb15">
                <label className='form-label'>スタジオ</label>
                <div className='wrap-button-block mb15'>
                  <span className='btn-close-confirm mr20' onClick={this.checkAll.bind(this)}>すべて選択</span>
                  <span className='btn-close-confirm' onClick={this.unCheckAll.bind(this)}>すべて解除</span>
                </div>
                <GroupCheckBox label='' ref={(checkBox) => {this.checkBox = checkBox}} name='studios' data={this.state.dataStudioCheckbox} value={this.state.studios} onChange={this.onChange.bind(this, 'studios')} keyName='id' valueName='name'/>
              </div>

            </div>
            <div className='form-group mb0'>
              <button disabled={this.state.loading} className='btn-confirm mr20 has-loading' onClick={this.createCoupon.bind(this)}>保存</button>
              <button disabled={this.state.loading} className='btn-close-confirm' onClick={this.goBack.bind(this)}>キャンセル</button>
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
  dataStudioCheckbox: [],
  listStudio: []
}

function bindStateToProps(state) {
  return {
    dataStudioCheckbox: state.systemData.studioCanWork,
    listStudio: state.systemData.listStudio
  }
}

export default connect(bindStateToProps)(withRouter(Add));

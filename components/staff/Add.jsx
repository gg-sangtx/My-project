import React, { Component } from 'react';
import { Input, DropDown, GroupCheckBox, CoupleInput, TextArea, UploadImage, GroupDatePicker, UploadMultipleImage } from 'components/inputform';
import { connect } from 'react-redux';
import { Staff } from 'api';
import {ShowIf} from 'components/utils';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import * as CONFIG from 'constants/datetime';
import moment from 'moment';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      name: '',
      name_kana: '',
      name_alphabet: '',
      email: '',
      tel: '',
      wage_type: 1,
      wage: 0,
      type: '1',
      face_image_text: '',
      face_image_url: '',
      studios_can_work: [],
      staff_portfolios: [{}],
      face_image: [{}],
      prefecture: '北海道',
      postal_code1: '',
      postal_code2: '',
      address1: '',
      address2: '',

      dataTypeWage: this.props.dataTypeWage || [],
      dataTypeStaff: this.props.dataTypeStaff || [],
      dataStudioCanWork: this.props.dataStudioCanWork || [],
      dataLocation: this.props.dataLocation || []
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataTypeWage != this.props.dataTypeWage) {
      this.state.dataTypeWage = nextProps.dataTypeWage;
    }
    if(nextProps.dataTypeStaff != this.props.dataTypeStaff) {
      this.state.dataTypeStaff = nextProps.dataTypeStaff;
    }
    if(nextProps.dataStudioCanWork != this.props.dataStudioCanWork) {
      this.state.dataStudioCanWork = nextProps.dataStudioCanWork;
    }
    if (nextProps.dataLocation != this.props.dataLocation) {
      this.state.dataLocation = nextProps.dataLocation;
    }
    this.setState({...this.state});
  }

  componentDidMount() {
    if(this.props.edit == true) {
      let data = [...this.props.dataList];
      let dataFilter = data.filter(state => {
        return state.id == this.props.params.id
      });
      if (dataFilter.length > 0) {
        this.getDetail(dataFilter[0], 'other');
      } else {
        this.getDetail();
      }
    }
  }

  getDetail(data, type) {
    if (type == 'other') {
      this.getData(data);
      Staff.actions.get.request({id: this.props.params.id}).then(res => {
        if(res.data) {
          let dataOther = res.data.data;
          this.getDataOther(dataOther);
        }
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
      })
    } else {
      Staff.actions.get.request({id: this.props.params.id}).then(res => {
        if(res.data) {
          let dataDetail = res.data.data.staff;
          this.getData(dataDetail);
          let dataOther = res.data.data;
          this.getDataOther(dataOther);
        }
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
      })
    }
  }

  getData(data) {
    this.state.email = data.email || '';
    this.state.face_image_url = data.face_image_url || '';
    this.state.face_image_text = data.face_image_text || '';
    this.state.name = data.name || '';
    this.state.name_alphabet = data.name_alphabet || '';
    this.state.name_kana = data.name_kana || '';
    this.state.past_works = data.past_works || '';
    this.state.profile = data.profile || '';
    this.state.tel = data.tel || '';
    this.state.type = data.type || '1';
    this.state.wage = data.wage || 0;
    this.state.wage_type = data.wage_type || '';
    this.state.prefecture = data.prefecture || '',
    this.state.postal_code1 = data.postal_code1 || '',
    this.state.postal_code2 = data.postal_code2 || '',
    this.state.address1 = data.address1 || '',
    this.state.address2 = data.address2 || '',
    this.state.face_image = [];
    let face_image = {
      imagePreviewUrl: data.face_image_url || '',
      alt: data.face_image_text || ''
    }
    this.state.face_image.push(face_image);
    this.setState({...this.state});
  }

  getDataOther(data) {
    if(data.studios_can_work.length > 0) {
      data.studios_can_work.map(item => {
        this.state.studios_can_work.push(item.id);
      })
    }
    this.state.staff_portfolios = [];
    if(data.portfolios.length > 0) {
      data.portfolios.map(item => {
        let newItem = {
          id: item.id,
          imagePreviewUrl: item.image_url || '',
          sort: item.sort_value || '',
          alt: item.text || ''
        }
        this.state.staff_portfolios.push(newItem);
      })
    } else {
      this.state.staff_portfolios.push({})
    }
    this.setState({...this.state});
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  removeImage(name) {
    this.state[name] = '';
    this.setState({
      ...this.state
    })
  }

  getParams() {
    let params = {};
    params.email = this.state.email ? this.state.email : null;
    params.name = this.state.name ? this.state.name : null;
    params.type = this.state.type ? this.state.type : null;
    params.name_kana = this.state.name_kana ? this.state.name_kana : null;
    params.name_alphabet = this.state.name_alphabet ? this.state.name_alphabet : null;
    params.tel = this.state.tel ? this.state.tel : null;
    params.profile = this.state.profile ? this.state.profile : null;
    params.past_works = this.state.past_works ? this.state.past_works : null;
    params.wage_type = this.state.wage_type ? this.state.wage_type : null;
    params.wage = this.state.wage ? this.state.wage : 0;
    params.face_image_url = this.state.face_image_url ? this.state.face_image_url : '';
    params.face_image_text = this.state.face_image_text ? this.state.face_image_text : '';
    params.studios_can_work = this.state.studios_can_work ? this.state.studios_can_work : [];
    params.prefecture = this.state.prefecture || null;
    params.postal_code1 = this.state.postal_code1 || null;
    params.postal_code2 = this.state.postal_code2 || null;
    params.address1 = this.state.address1 || null;
    params.address2 = this.state.address2 || null;
    params.staff_portfolios = [];
    if (this.state.staff_portfolios.length > 0) {
      this.state.staff_portfolios.map(item => {
        if(item.imagePreviewUrl && item.sort) {
          let newItem = {
            image_url: item.imagePreviewUrl ? item.imagePreviewUrl : null,
            text: item.alt ? item.alt : '',
            sort_value: item.sort ? item.sort : ''
          }
          if (item.id) {
            newItem.id = item.id
          }
          params.staff_portfolios.push(newItem);
        }
      })
    }
    return params
  }

  createStaff(e) {
    e.preventDefault();
    if(this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({...this.state});
      let params = this.getParams();
      if(this.props.edit == true) {
        this.patchProcess(params);
      } else {
        this.postProcess(params);
      }
    }
    return
  }

  postProcess(params) {
    Staff.actions.create.request('', params).then(res => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(this.state.name + msg.staffCreateSuccess, 'success');
      this.props.history.push('/staffs');
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

  patchProcess(params) {
    Staff.actions.update.request({id: this.props.params.id}, params).then(res => {
      Toastr(this.state.name + msg.staffEditSuccess, 'success');
      this.props.history.push('/staffs');
      this.state.loading = false;
      this.setState({...this.state});
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

  goBack() {
    this.props.dispatch({type: 'STAFF_GO_BACK'});
    this.props.history.push('/staffs');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>カメラマン／ヘアメイク情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>カメラマン／ヘアメイク情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>

            <Input className='col-xs-6 mb15 clear-left' label='名前' require bindValidator={this} channel='form' type='text' maxLength='40' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
            <Input className='col-xs-6 mb15' label='名前カナ' require bindValidator={this} channel='form' type='text' maxLength='40' name='name_kana' value={this.state.name_kana} onChange={this.onChange.bind(this, 'name_kana')}/>
            <Input className='col-xs-6 mb15 clear-left' label='名前ローマ字' require bindValidator={this} channel='form' type='text' maxLength='40' name='name_alphabet' value={this.state.name_alphabet} onChange={this.onChange.bind(this, 'name_alphabet')}/>
            <Input className='col-xs-6 mb15' label='メールアドレス' require bindValidator={this} channel='form' type='email' maxLength='40' name='email' value={this.state.email} onChange={this.onChange.bind(this, 'email')}/>
            <Input className='col-xs-6 mb15 clear-left' label='電話番号' require bindValidator={this} channel='form' type='text' maxLength='40' name='tel' value={this.state.tel} onChange={this.onChange.bind(this, 'tel')}/>
            <DropDown className='col-xs-6 mb15' label='都道府県' require bindValidator={this} channel='form' options={this.state.dataLocation} keyName='value' valueName='value' value={this.state.prefecture} onChange={this.onChange.bind(this, 'prefecture')}/>
            <CoupleInput className='col-xs-12 mb15' label='' labelMin='郵便番号１' labelMax='郵便番号2' require bindValidator={this} channel='form' valueMin={this.state.postal_code1} onChangeMin={this.onChange.bind(this, 'postal_code1')} valueMax={this.state.postal_code2} onChangeMax={this.onChange.bind(this, 'postal_code2')}/>
            <Input className='col-xs-6 mb15 clear-left' label='住所1' require bindValidator={this} channel='form' type='text' maxLength='40' name='address1' value={this.state.address1} onChange={this.onChange.bind(this, 'address1')}/>
            <Input className='col-xs-6 mb15' label='住所2' type='text' maxLength='40' name='address2' value={this.state.address2} onChange={this.onChange.bind(this, 'address2')}/>

            <DropDown className='col-xs-6 mb15 clear-left' label='給与' require bindValidator={this} channel='form' options={this.state.dataTypeWage} keyName='key' valueName='value' value={this.state.wage_type} onChange={this.onChange.bind(this, 'wage_type')}/>
            <Input className='col-xs-6 mb15 mt25' label='' hasUnit={true} unitLabel="¥" perLabel={this.state.wage_type == 1 ? "/h" : "/d"} require bindValidator={this} channel='form' type='text' maxLength='40' name='wage' value={this.state.wage} onChange={this.onChange.bind(this, 'wage')}/>

            <div className='wrap-list-check-box'>
              <label className='form-label'>出勤可能スタジオ</label>
              <div className='wrap-button-block mb15'>
                <span className='btn-close-confirm mr20' onClick={this.checkAll.bind(this)}>すべて選択する</span>
                <span className='btn-close-confirm' onClick={this.unCheckAll.bind(this)}>すべて解除</span>
              </div>
              <GroupCheckBox label='' ref={(checkBox) => {this.checkBox = checkBox}} bindValidator={this} name='studios_can_work' data={this.state.dataStudioCanWork} value={this.state.studios_can_work} onChange={this.onChange.bind(this, 'studios_can_work')} keyName='id' valueName='name'/>
            </div>

            <DropDown className='col-xs-6 mb15 clear-left' label='業種' require bindValidator={this} channel='form' options={this.state.dataTypeStaff} keyName='key' valueName='value' value={this.state.type} onChange={this.onChange.bind(this, 'type')}/>

            <div className='col-sm-12'>
              <UploadMultipleImage altLabel='alt' label='顔写真' hasAlt={true} multi={false} bindValidator={this} require onChangeFile={this.onChange.bind(this, 'face_image_url')} onChangeAlt={this.onChange.bind(this, 'face_image_text')} name='face_image_url' data={this.state.face_image}/>
            </div>

            <div className='col-sm-12'>
              <UploadMultipleImage altLabel='alt' bindValidator={this} label='ポートフォリオ写真' hasAlt={true} hasSort={true} sortLabel='優先度' name='staff_portfolios' data={this.state.staff_portfolios} onChange={this.onChange.bind(this, 'staff_portfolios')}/>
            </div>

            <TextArea className='col-sm-12 mb15' label='プロフィール' maxLength='255' name='profile' value={this.state.profile} onChange={this.onChange.bind(this, 'profile')}/>

            <div className='col-xs-12 pt15'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.createStaff.bind(this)}>保存</button>
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
  dataTypeWage: [],
  dataTypeStaff: [],
  dataStudioCanWork: [],
  dataLocation: []
}

function bindStateToProps(state) {
  return {
    dataTypeWage: state.systemData.typeWage,
    dataTypeStaff: state.systemData.typeStaff,
    dataStudioCanWork: state.systemData.studioCanWork,
    dataList: state.listStaff.data,
    dataLocation: state.systemData.prefectures,
  }
}

export default connect(bindStateToProps)(withRouter(Add))

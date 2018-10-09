import React, { Component } from 'react';
import { Input, DropDown, GroupCheckBox, CoupleInput, TextArea, UploadImage, DatePicker, UploadMultipleImage, CoupleTime, GroupDatePicker } from 'components/inputform';
import { connect } from 'react-redux';
import { CostumeLocks, System } from 'api';
import {ShowIf} from 'components/utils';
import classnames from 'classnames';
import {Toastr} from 'components/modules/toastr';
import Modal from 'react-modal';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import * as CONFIG from 'constants/datetime';
import moment from 'moment';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      costume_size_id: '',
      costume_id: '',
      listDataCostume: [],
      dates: [],
      listSize: [],
      deleteLoading: false,
      modalIsOpen: false,
    }
  }

  componentDidMount() {
    if(this.props.edit == true) {
      this.getDetail();
      this.getAllCostume();
    } else {
      this.getAllCostume('create');
    }
  }

  getAllCostume(type) {
    CostumeLocks.actions.allDataCostume.request().then(res => {
       if(res.data) {
        let Data = res.data.data ? res.data.data.costumes.data : [];
        let newData = [];
        Data.map(item => {
          let newItem = {
            id: item.id,
            name: item.name,
            value: item.code + ' ' + item.name
          }
          newData.push(newItem);
        })
        if(type == 'create') {
          this.state.costume_id = newData[0].id;
          this.getSize(newData[0].id, 'init');
        }
        this.state.listDataCostume = newData;
        this.setState({...this.state});
      }
    })
  }

  getSize(id, type) {
    System.actions.listSize.request({costume_id: id}).then(res => {
      if(res.data) {
        let Data = res.data.data.sizes;
        this.state.listSize = Data;
        if(type == 'init') {
          this.state.costume_size_id = Data[0].id
        }
        this.setState({...this.state});
      }
    })
  }

  getDetail() {
    CostumeLocks.actions.getCostumeLocks.request({id: this.props.params.id}).then(res => {
      if(res.data) {
        let dataDetail = res.data.data.costume_lock;
        this.state.costume_id = dataDetail.costume_id ? dataDetail.costume_id : '';
        this.state.costume_size_id = dataDetail.costume_size_id ? dataDetail.costume_size_id : '';
        this.state.dates = dataDetail.dates ? dataDetail.dates : '';
        this.state.type = dataDetail.type ? dataDetail.type : '';
        this.setState({...this.state});
        this.getSize(dataDetail.costume_size_id);
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

  onChange(name, e) {
    this.state[name] = e.target.value;
    if(name == 'costume_id') {
      this.getSize(e.target.value, 'init');
    }
    this.setState({
      ...this.state
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = this.getParams();
      if (this.props.edit === true) {
        this.patchProcess(params);
      } else {
        this.postProcess(params);
      }
    }
    return;
  }

  getParams() {
    let params = {
      costume_size_id: this.state.costume_size_id,
      costume_id: this.state.costume_id,
      dates: this.state.dates,
    }
    return params
  }

  postProcess(params) {
    let name = this.state.listDataCostume[this.state.listDataCostume.findIndex(x => x.id == this.state.costume_id)].name;
    CostumeLocks.actions.postCostumeLocks.request('', params).then(res => {
      Toastr(name + ' ' + msg.createCostumeLocks, 'success');
      this.goBack();
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
    let name = this.state.listDataCostume[this.state.listDataCostume.findIndex(x => x.id == this.state.costume_id)].name;
    CostumeLocks.actions.updateCostumeLocks.request({id: this.props.params.id}, params).then(res => {
      Toastr(name + ' ' + msg.createCostumeLocks, 'success');
      this.goBack();
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

  goBack() {
    this.props.dispatch({type: 'COSTUMELOCK_GO_BACK'});
    this.props.history.push('/costumeLocks');
  }

  openModal() {
    this.state.messageDelete = msg.costumeLocksDeleteMessage;
    this.state.modalIsOpen = true;
    this.setState({
      ...this.state
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

  deleteItem() {
    this.state.deleteLoading = true;
    this.setState({...this.state});
    this.openModal();
    CostumeLocks.actions.deleteCostumeLocks.request({id: this.props.params.id}).then(res => {
      Toastr(msg.deleteCostumeLocks, 'success');
      this.goBack();
      return;
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.closeModal();
    })
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>衣装ロック情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>衣装ロック情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>
            <div className="mb15 col-xs-12 no-gutter clear-left">
              <DropDown className=' col-xs-6 mb15 clear-left' label='衣装情報を選択' require={true} bindValidator={this} channel='form' options={this.state.listDataCostume} keyName='id' valueName='value' value={this.state.costume_id} onChange={this.onChange.bind(this, 'costume_id')}/>
              <DropDown className=' col-xs-6 mb15 clear-left' label='衣装サイズを選択' require={true} bindValidator={this} channel='form' options={this.state.listSize} keyName='id' valueName='value' value={this.state.costume_size_id} onChange={this.onChange.bind(this, 'costume_size_id')}/>
              <div className ='box-datePicker col-xs-12 clear-left mb15'>
                <GroupDatePicker label='時間帯' className="mb15" value={this.state.dates} require={true} bindValidator={this} channel='form' onChange={this.onChange.bind(this, 'dates')}/>
              </div>
            </div>

            <div className='mb0 clear-left col-md-12'>
              <button disabled={this.state.loading} className='btn-confirm mr20 has-loading' onClick={this.handleSubmit.bind(this)}>保存</button>
              <button disabled={this.state.loading} className='btn-close-confirm mr20' onClick={this.goBack.bind(this)}>キャンセル</button>
              <ShowIf condition={this.props.edit == true}>
                <button type="button" className='btn-confirm btn-danger' disabled={this.state.deleteLoading ? true : false} onClick={this.openModal.bind(this)}>削除</button>
              </ShowIf>
            </div>
          </form>
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

Add.defaultProps={
  validators: {
    form: []
  },
  dataList: [],
  dataStudioCanWork: [],
}

function bindStateToProps(state) {
  return {
    dataStudioCanWork: state.systemData.studioCanWork,
    dataList: state.listCostumeLocks.data
  }
}

export default connect(bindStateToProps)(withRouter(Add))
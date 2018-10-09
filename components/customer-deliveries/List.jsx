import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import { withRouter } from 'react-router';
import { API_URL } from 'constants/config';
import { Input, DropDown, Text, CoupleInput, DatePicker, InputTel} from 'components/inputform';
import {CustomerDelivery} from 'api';

class ListDelivery extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageData: {
        number: 0,
        size: 50,
        totalElements: 0
      },
      data: [],
      firstName: '',
      lastName: '',
      header: [
        { name: '名前', width: 170 },
        { name: '住所', minWidth: 300 },
        { name: '電話番号', width: 200 },
        { name: '操作', width: 110, minWidth: 110 }
      ],
      modalIsOpen: false,
      deleteLoading: false,
      loading: false,
      itemEdit: {},
      modalEditIsOpen: false,
      editLoading: false,
      id: '',
      last_name: '',
      first_name: '',
      prefecture: 1,
      postal_code1: '',
      postal_code2: '',
      address1: '',
      address2: '',
      tel1: '',
      tel2: '',
      tel3: '',
      addNew: false,
      dataLocation: this.props.dataLocation
    }
  }

  componentDidMount() {
    this.getListData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataLocation != this.props.dataLocation) {
      this.state.dataLocation = nextProps.dataLocation;
    }
    this.setState({...this.state});
  }

  getListData() {
    this.state.loading = true;
    this.setState({...this.state});
    let dataSearch = {};
    let params = {limit: 0, customer_id: this.props.id};

    CustomerDelivery.actions.list.request(params).then(res => {
      if(res && res.data) {
        let Data = res.data.data.customer_deliveries;
        this.state.data = Data;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
      } else {
        this.state.data = [];
        this.state.loading = false;
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

  componentWillMount() {
    Modal.setAppElement('body');
  }

  openModal(id) {
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
    CustomerDelivery.actions.delete.request({id: this.state.deleteId}).then(res => {
      Toastr(msg.deleteCustomerDelivery, 'success');
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

  openModalEdit(item) {
    if (item == 'create') {
      this.state.addNew = true;
    } else {
      this.state.id = item.id;
      this.state.last_name = item.last_name;
      this.state.first_name = item.first_name;
      this.state.prefecture = item.prefecture;
      this.state.postal_code1 = item.postal_code1;
      this.state.postal_code2 = item.postal_code2;
      this.state.address1 = item.address1;
      this.state.address2 = item.address2;
      this.state.tel1 = item.tel1;
      this.state.tel2 = item.tel2;
      this.state.tel3 = item.tel3;
    }
    this.state.modalEditIsOpen = true;
    this.setState({...this.state});
  }

  closeModalEdit() {
    this.state.id = '';
    this.state.last_name = '';
    this.state.first_name = '';
    this.state.prefecture = 1;
    this.state.postal_code1 = '';
    this.state.postal_code2 = '';
    this.state.address1 = '';
    this.state.address2 = '';
    this.state.tel1 = '';
    this.state.tel2 = '';
    this.state.tel3 = '';
    this.state.modalEditIsOpen = false;
    this.state.editLoading = false;
    this.state.addNew = false;
    this.setState({...this.state});
    this.props.validators['form'] = [];
  }

  editItem() {
    if (this.validateSubmitForm()) {
      let params = {
        customer_id: this.props.id,
        last_name: this.state.last_name ? this.state.last_name : '',
        first_name: this.state.first_name ? this.state.first_name : '',
        prefecture: this.state.prefecture ? this.state.prefecture : '',
        postal_code1: this.state.postal_code1 ? this.state.postal_code1 : '',
        postal_code2: this.state.postal_code2 ? this.state.postal_code2 : '',
        address1: this.state.address1 ? this.state.address1 : '',
        address2: this.state.address2 ? this.state.address2 : '',
        tel1: this.state.tel1 ? this.state.tel1 : '',
        tel2: this.state.tel2 ? this.state.tel2 : '',
        tel3: this.state.tel3 ? this.state.tel3 : ''
      }
      if (this.state.addNew) {
        this.postProcess(params);
      } else {
        this.patchProcess(params)
      }

    }
  }

  postProcess(params) {
    CustomerDelivery.actions.create.request('',params).then(res => {
      Toastr(msg.createCustomerDelivery, 'success');
      this.closeModalEdit();
      this.getListData();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.closeModalEdit();
    })
  }

  patchProcess(params) {
    CustomerDelivery.actions.update.request({id: this.state.id},params).then(res => {
      Toastr(msg.editCustomerDelivery, 'success');
      this.closeModalEdit();
      this.getListData();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.closeModalEdit();
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

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({...this.state})
  }

  render() {
    let Element = document.getElementById('content-list-manager');
    return (
      <div id='content-list-manager'>
        <Datatable
          title={`配送先情報`}
          header={this.state.header}
          pageData={this.state.pageData}
          dataList={this.state.data}
          loading={this.state.loading}
          numberColumnHeader={4}
          hidePagination={true}
        >
          <ListItem deleteItem={this.openModal.bind(this)} editItem={this.openModalEdit.bind(this)}/>
        </Datatable>
        <div className='text-right'>
          <span className='btn-addnew' onClick={this.openModalEdit.bind(this, 'create')}>+ 配送情報追加</span>
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
            <p className='p-14'>{msg.confirmDeleteCustomerDelivery}</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.deleteItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' disabled={this.state.deleteLoading ? true : false} onClick={this.closeModal.bind(this)}>閉じる</button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalEditIsOpen}
          onRequestClose={this.closeModalEdit.bind(this)}
          className="model-confirm-delete model-edit-delivery"
        >
          <div className='title-block'>
            <h3 className='heading-3'>{this.state.addNew == true ? '配送情報追加' : '配送先情報編集'}</h3>
            <button className='btn-close' onClick={this.closeModalEdit.bind(this)}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className='row'>
              <Input className='col-xs-4 mb15' label='姓' require bindValidator={this} channel='form' type='text' name='last_name' value={this.state.last_name} onChange={this.onChange.bind(this, 'last_name')}/>
              <Input className='col-xs-4 mb15' label='名' require bindValidator={this} channel='form' type='text' name='first_name' value={this.state.first_name} onChange={this.onChange.bind(this, 'first_name')}/>
              <DropDown className='col-xs-4 mb15' label='都道府県' require bindValidator={this} channel='form' options={this.state.dataLocation} keyName='key' valueName='value' value={this.state.prefecture} onChange={this.onChange.bind(this, 'prefecture')}/>
              <CoupleInput className='col-xs-12 mb15' label='' labelMin='郵便番号1' labelMax='郵便番号2' require bindValidator={this} channel='form' valueMin={this.state.postal_code1} onChangeMin={this.onChange.bind(this, 'postal_code1')} valueMax={this.state.postal_code2} onChangeMax={this.onChange.bind(this, 'postal_code2')}/>
              <Input className='col-xs-6 mb15' label='住所1' require bindValidator={this} channel='form' type='text' name='address1' value={this.state.address1} onChange={this.onChange.bind(this, 'address1')}/>
              <Input className='col-xs-6 mb15' label='住所2' type='text' name='address2' value={this.state.address2} onChange={this.onChange.bind(this, 'address2')}/>
              <InputTel className='col-xs-12 mb15' require bindValidator={this} channel='form' labelTel1='電話番号1' labelTel2='電話番号2' labelTel3='電話番号3' tel1={this.state.tel1} tel2={this.state.tel2} tel3={this.state.tel3} onChangeTel1={this.onChange.bind(this, 'tel1')} onChangeTel2={this.onChange.bind(this, 'tel2')} onChangeTel3={this.onChange.bind(this, 'tel3')} type='text' name='address_2' value={this.state.address_2} onChange={this.onChange.bind(this, 'address_2')}/>
            </div>
            <div className='pt10 pb25'>
              <div className='line-border'/>
            </div>
            <div className='wrap-button mb5'>
              <button className='btn-confirm has-loading' disabled={this.state.editLoading ? true : false} onClick={this.editItem.bind(this)}>保存</button>
              <button className='btn-close-confirm' disabled={this.state.editLoading ? true : false} onClick={this.closeModalEdit.bind(this)}>キャンセル</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ListDelivery.defaultProps = {
  dataLocation: [],
  validators: {
    form: []
  },
}

function bindStateToProps(state) {
  return {
    dataLocation: state.systemData.prefectures,
  }
}

export default connect(bindStateToProps)(withRouter(ListDelivery))
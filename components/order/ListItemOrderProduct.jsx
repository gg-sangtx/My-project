import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Input, DropDown, Text, ReactUploadMultipleImage} from 'components/inputform';
import {ShowIf} from 'components/utils';
import Modal from 'react-modal';
import {Order} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";

let findProduct;

export default class ListItemOrderProduct extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      modalDeleteIsOpen: false,
      modalCancelIsOpen: false,
      modalChooseImageIsOpen: false,
      product_id: this.props.item && this.props.item.product_id ? this.props.item.product_id : '',
      product_code: this.props.item && this.props.item.product_code ? this.props.item.product_code : '',
      product_name: this.props.item && this.props.item.product_name ? this.props.item.product_name : '',
      status: this.props.item && this.props.item.status ? this.props.item.status : '',
      productCode: this.props.item && this.props.item.productCode ? this.props.item.productCode : '',
      number: this.props.item && this.props.item.number ? this.props.item.number : '',
      product_sku_id: this.props.item && this.props.item.product_sku_id ? this.props.item.product_sku_id : '',
      safeItem: this.props.item && this.props.item.safeItem ? this.props.item.safeItem : '',
      cancelItem: this.props.item && this.props.item.cancelItem ? this.props.item.cancelItem : '',
      returnItem: this.props.item && this.props.item.returnItem ? this.props.item.returnItem : '',
      booking_product_id: this.props.item && this.props.item.booking_product_id ? this.props.item.booking_product_id : '',
      numberCancel: 1,
      numberReturn: 1,
      numberEnable: 1,
      dataOrderStatus: [
        {value: 1, name: '新規受付'},
        {value: 2, name: 'キャンセル'},
        {value: 3, name: '返品'}
      ],
      dataCount: [
        {id: 1, value: '1'},
        {id: 2, value: '2'},
        {id: 3, value: '3'},
        {id: 4, value: '4'},
        {id: 5, value: '5'},
        {id: 6, value: '6'},
        {id: 7, value: '7'},
        {id: 8, value: '8'},
        {id: 9, value: '9'},
        {id: 10, value: '10'},
      ],
      dataProduct: this.props.dataProduct || [],
      dataList: this.props.dataList || []
    }
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentDidMount() {
    if(this.state.product_code) {
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataProduct != this.props.dataProduct) {
      this.state.dataProduct = nextProps.dataProduct;
      this.setState({...this.state});
    }
    this.state.dataList = nextProps.dataList;
    this.setState({...this.state});

    if(nextProps.item != this.props.item) {
      this.state.product_id = nextProps.item.product_id;
      this.state.product_code = nextProps.item.product_code;
      this.state.status = nextProps.item.status;
      this.state.number = nextProps.item.number;
      this.state.productCode = nextProps.item.productCode;
      this.state.product_sku_id = nextProps.item.product_sku_id;
      this.state.booking_product_id = nextProps.item.booking_product_id;
      this.state.safeItem = nextProps.item.safeItem ? nextProps.item.safeItem : 0;
      this.state.cancelItem = nextProps.item.cancelItem ? nextProps.item.cancelItem : 0;
      this.state.returnItem = nextProps.item.returnItem ? nextProps.item.returnItem : 0;
      this.setState({...this.state})
    }
  }

  openModal(name) {
    this.state[name] = true;
    this.setState({...this.state});
  }

  closeModal(name) {
    this.state.numberCancel = 1;
    this.state.numberReturn = 1;
    this.state.numberEnable = 1;
    this.state[name] = false;
    this.setState({...this.state});
  }

  onChange(name, e) {
    if(name == 'status') {
      this.state.status = this.state.status;
      this.setState({...this.state});
      let value = e.target.value;
      if (value == 1) {
        this.openModal('modalEnableIsOpen');
      } else if (value == 2) {
        this.openModal('modalCancelIsOpen');
      } else {
        this.openModal('modalReturnIsOpen');
      }
    } else if(name == 'number' && Number(e.target.value) < (Number(this.state.returnItem) + Number(this.state.cancelItem))) {
      let number = Number(e.target.value);
      let safeItem = Number(this.state.safeItem);
      let cancelItem = Number(this.state.cancelItem);
      let returnItem = Number(this.state.returnItem);
      let realItem = number;
      if(returnItem >= number) {
        this.state.returnItem = number;
        this.state.safeItem = 0;
        this.state.cancelItem = 0;
      } else if ((returnItem + cancelItem )>= number) {
        this.state.cancelItem = number - returnItem;
        this.state.safeItem = 0;
      }
      this.state[name] = number;
      this.setState({...this.state}, () => {
        this.checkStatus();
      });
    } else {
      this.state[name] = e.target.value;
      if (name == 'number') {
        this.state.safeItem = Number(Number(e.target.value) - (Number(this.state.returnItem) + Number(this.state.cancelItem)))
        this.checkStatus()
      }
      if(name == 'productCode' ) {
        if (e.target.value) {
          this.state.product_id = this.props.dataProduct[this.state.dataProduct.findIndex(item => item.productCode == e.target.value)].product_id;
          this.state.product_sku_id = this.props.dataProduct[this.state.dataProduct.findIndex(item => item.productCode == e.target.value)].product_sku_id;
          this.state.booking_product_id = this.props.dataProduct[this.state.dataProduct.findIndex(item => item.productCode == e.target.value)].id;
        } else {
          this.state.product_id = '';
          this.state.product_sku_id = '';
          this.state.booking_product_id = '';
        }
      }
      this.setState({...this.state}, () => {
        if (name != 'numberReturn' && name != 'numberCancel') {
          let data = {
            product_id : this.state.product_id ? this.state.product_id : '',
            product_code : this.state.product_code ? this.state.product_code : '',
            status : this.state.status ? this.state.status : '',
            number : this.state.number ? this.state.number : '',
            productCode : this.state.productCode ? this.state.productCode : '',
            product_sku_id : this.state.product_sku_id ? this.state.product_sku_id : '',
            safeItem: this.state.safeItem ? this.state.safeItem : 0,
            booking_product_id: this.state.booking_product_id ? this.state.booking_product_id : null,
            cancelItem: this.state.cancelItem ? this.state.cancelItem : 0,
            returnItem: this.state.returnItem ? this.state.returnItem : 0,
          }
          this.props.onChange(data, this.props.count - 1, this.props.indexItem);
        }
      });
    }
  }

  onDeleteItem(id) {}

  deleteItem() {
    this.props.onDeleteItem(this.props.count - 1, this.props.indexItem);
  }

  calcelItem() {
    let numberCancel = Number(this.state.numberCancel);
    let safeItem = Number(this.state.safeItem);
    let cancelItem = Number(this.state.cancelItem);
    let returnItem = Number(this.state.returnItem);
    this.state.cancelItem = numberCancel;
    let realItem = numberCancel - cancelItem;
    if ((safeItem - realItem) < 0) {
      this.state.safeItem = 0;
      realItem = realItem - safeItem;
      this.state.returnItem = this.state.returnItem - realItem;
    } else {
      this.state.safeItem = safeItem - realItem;
    }
    this.setState({...this.state});
    this.closeModal('modalCancelIsOpen');
    this.checkStatus();
  }

  returnItem() {
    let numberReturn = Number(this.state.numberReturn);
    let safeItem = Number(this.state.safeItem);
    let cancelItem = Number(this.state.cancelItem);
    let returnItem = Number(this.state.returnItem);
    this.state.returnItem = numberReturn;
    let realItem = numberReturn - returnItem;
    if ((safeItem - realItem) < 0) {
      this.state.safeItem = 0;
      realItem = realItem - safeItem;
      this.state.cancelItem = this.state.cancelItem - realItem;
    } else {
      this.state.safeItem = safeItem - realItem;
    }
    this.setState({...this.state});
    this.closeModal('modalReturnIsOpen');
    this.checkStatus();
  }

  enableItem() {
    let numberEnable = Number(this.state.numberEnable);
    let safeItem = Number(this.state.safeItem);
    let cancelItem = Number(this.state.cancelItem);
    let returnItem = Number(this.state.returnItem);
    this.state.safeItem = numberEnable;
    let realItem = numberEnable;
    if ((cancelItem - realItem) < 0) {
      this.state.cancelItem = 0;
      realItem = realItem - cancelItem;
      this.state.returnItem = this.state.returnItem - realItem;
    } else {
      this.state.cancelItem = cancelItem - realItem;
    }
    this.setState({...this.state});
    this.closeModal('modalEnableIsOpen');
    this.checkStatus();
  }

  checkStatus(conditionSubmit) {
    if (this.state.safeItem > 0) {
      this.state.status = 1;
    } else if (this.state.cancelItem > 0) {
      this.state.status = 2;
    } else {
      this.state.status = 3;
    }
    this.setState({...this.state}, () => {
      if (conditionSubmit != false) {
        let data = {
          product_id : this.state.product_id ? this.state.product_id : '',
          product_code : this.state.product_code ? this.state.product_code : '',
          status : this.state.status ? this.state.status : '',
          number : this.state.number ? this.state.number : '',
          productCode : this.state.productCode ? this.state.productCode : '',
          product_sku_id : this.state.product_sku_id ? this.state.product_sku_id : '',
          safeItem: this.state.safeItem ? this.state.safeItem : 0,
          booking_product_id: this.state.booking_product_id ? this.state.booking_product_id : null,
          cancelItem: this.state.cancelItem ? this.state.cancelItem : 0,
          returnItem: this.state.returnItem ? this.state.returnItem : 0,
        }
        this.props.onChange(data, this.props.count - 1, this.props.indexItem);
      }
    });
  }

  render() {
    let photos = [];
    if (this.props.dataProduct.length > 0) {
      let index = this.props.dataProduct.findIndex(x => x.productCode == this.state.productCode);
      if (index != -1) {
        photos = this.state.dataProduct[index].photos
      }
    }
    let dataProduct = [...this.state.dataProduct];
    let dataProductFilter = dataProduct.filter(item => {
      return (this.state.dataList.findIndex(x => x.productCode == item.productCode) == -1 || item.productCode == this.state.productCode)
    })
    let dataCount = [...this.state.dataCount];
    let DataOption = dataCount.filter(item => {
      return item.id <= this.state.number;
    })
    return (
      <tr>
        <td><DropDown label='' className='col-xs-12 no-gutter' value={this.state.productCode} placeholder='商品名' showPlaceholder={true} onChange={this.onChange.bind(this, 'productCode')} options={dataProductFilter} keyName='productCode' valueName='productName'/></td>
        <td><DropDown label='' className='col-xs-12 no-gutter' value={this.state.status} onChange={this.onChange.bind(this, 'status')} options={this.state.dataOrderStatus} keyName='value' valueName='name'/></td>
        <td><DropDown label='' className='col-xs-12 no-gutter' value={this.state.number} onChange={this.onChange.bind(this, 'number')} options={this.state.dataCount} keyName='id' valueName='value'/></td>
        <td>
          {
            photos.map((item, index) => {
              if(index < 3) {
                return(
                  <span className='item-image'>
                    <img src={item.URL}/>
                  </span>
                )
              }
            })
          }
        </td>
        <td>
          <div className='wrap-button-action'>
            <ShowIf condition={this.state.safeItem > 0}>
              <span className='item-link-action btn-danger' onClick={this.openModal.bind(this, 'modalCancelIsOpen')}>キャンセル</span>
            </ShowIf>
            <ShowIf condition={this.state.safeItem > 0}>
              <span className='item-link-action btn-danger' onClick={this.openModal.bind(this, 'modalReturnIsOpen')}>返品</span>
            </ShowIf>
            <span className='item-link-action btn-danger' onClick={this.openModal.bind(this, 'modalDeleteIsOpen')}>削除</span>
          </div>
        </td>
        <Modal
          isOpen={this.state.modalDeleteIsOpen}
          onRequestClose={this.closeModal.bind(this, 'modalDeleteIsOpen')}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>削除</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalDeleteIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className='mb15 text-center'>{msg.confirmDeleteOrderDeliveryBookingProducts}</div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.deleteItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalDeleteIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalCancelIsOpen}
          onRequestClose={this.closeModal.bind(this, 'modalCancelIsOpen')}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>キャンセル</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalCancelIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <p className='mb15 text-center'>{msg.confirmCancelOrderDeliveryBookingProducts}</p>
            <div className='mb15'><DropDown label='' className='col-xs-12 mb15' value={this.state.numberCancel} onChange={this.onChange.bind(this, 'numberCancel')} options={DataOption} keyName='id' valueName='value'/></div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.calcelItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalCancelIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalReturnIsOpen}
          onRequestClose={this.closeModal.bind(this, 'modalReturnIsOpen')}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>返品</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalReturnIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <p className='mb15 text-center'>{msg.confirmReturnOrderDeliveryBookingProducts}</p>
            <div className='mb15'><DropDown label='' className='col-xs-12 mb15' value={this.state.numberReturn} onChange={this.onChange.bind(this, 'numberReturn')} options={DataOption} keyName='id' valueName='value'/></div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.returnItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalReturnIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalEnableIsOpen}
          onRequestClose={this.closeModal.bind(this, 'modalEnableIsOpen')}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>新規受付</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalEnableIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className='mb15'><DropDown label='' className='col-xs-12 mb15' value={this.state.numberEnable} onChange={this.onChange.bind(this, 'numberEnable')} options={DataOption} keyName='id' valueName='value'/></div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.enableItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalEnableIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
      </tr>
    );
  }
}

ListItemOrderProduct.defaultProps = {
  deleteItem: function() {},
  dataImageBooking: [],
  dataProduct: []
}
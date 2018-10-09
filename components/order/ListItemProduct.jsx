import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Input, DropDown, Text, ReactUploadMultipleImage} from 'components/inputform';
import {ShowIf} from 'components/utils';
import Modal from 'react-modal';
import {Order} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";

let findProduct;

export default class ListItemProduct extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      modalDeleteIsOpen: false,
      modalEditIsOpen: false,
      modalChooseImageIsOpen: false,
      product_code_loading: false,
      dataImageBooking: this.props.dataImageBooking,
      dataImageSelect: [],
      dataImage: this.props.item && this.props.item.photos ? this.props.item.photos : [],
      product_id: this.props.item && this.props.item.product_id ? this.props.item.product_id : '',
      product_code: this.props.item && this.props.item.product_code ? this.props.item.product_code : '',
      product_name: this.props.item && this.props.item.product_name ? this.props.item.product_name : '',
      product_sku_id: this.props.item && this.props.item.product_sku_id ? this.props.item.product_sku_id : '',
      dataSkus: []
    }
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentDidMount() {
    if(this.state.product_code) {
      this.findProduct(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataImageBooking != this.props.dataImageBooking) {
      this.state.dataImageBooking = nextProps.dataImageBooking;
      this.setState({...this.state});
    }
    if(nextProps.item != this.props.item) {
      this.state.dataImage = nextProps.item.photos;
      this.state.product_id = nextProps.item.product_id;
      this.state.product_code = nextProps.item.product_code;
      this.state.product_name = nextProps.item.product_name;
      this.state.product_sku_id = nextProps.item.product_sku_id;
      this.setState({...this.state})
      this.findProduct(true);
    }
  }

  openModal(name) {
    this.state[name] = true;
    this.setState({...this.state});
  }

  closeModal(name) {
    this.state[name] = false;
    this.setState({...this.state});
  }

  onChangeData(data) {
    this.state.dataImage = data;
    this.setState({...this.state})
  }

  onChange(name, e) {
    if(name == 'product_code') {
      clearTimeout(findProduct);
    }
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    }, ()=> {
      if(name == 'product_code') {
        this.findProduct();
      }
    })
  }

  onDeleteItem(id) {}

  deleteItem() {
    Order.actions.deleteBookingProduct.request({id: this.props.item.id}).then(res => {
      Toastr(msg.deleteBookingProduct, 'success');
      this.closeModal('modalDeleteIsOpen');
      this.props.getListData();
      this.props.updateOrderItem();
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
      this.closeModal('modalDeleteIsOpen');
    })
  }

  updateItem() {
    if(this.validateSubmitForm()) {
      let params = this.getParams();
      Order.actions.editBookingProduct.request({id: this.props.item.id}, params).then(res => {
        Toastr(msg.updateBookingProduct, 'success');
        this.closeModal('modalEditIsOpen');
        this.props.getListData();
        this.props.updateOrderItem();
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
        this.setState({...this.state})
      })
    }
  }

  getParams() {
    let params = {
      booking_id: this.props.item.booking_id,
      product_id: this.state.product_id,
      product_sku_id: this.state.product_sku_id,
    };
    let photo = [];
    this.state.dataImage.map(item => {
      let newItem = {
        booking_photo_id: item.booking_photo_id
      }
      if (item.id) {
        newItem.id = item.id;
      }
      photo.push(newItem);
    })

    if (photo.length > 0) {
      params.photos = photo;
    }

    return params;
  }

  validateSubmitForm() {
    let pass = true;
    this.props.validators['formEdit'].map(validator => {
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

  checkImageSelect(id) {
    let result = '';
    if(this.state.dataImageSelect.indexOf(id) != -1) {
      result = 'active'
    }
    return result
  }

  checkImage(id) {
    if(this.state.dataImageSelect.indexOf(id) != -1) {
      this.state.dataImageSelect.splice(this.state.dataImageSelect.indexOf(id), 1);
    } else {
      this.state.dataImageSelect.push(id);
    }
    this.setState({...this.state})
  }

  addImage() {
    this.state.dataImageSelect.map(item => {
      let itemIndex = this.state.dataImageBooking.findIndex(image => image.id == item);
      if(itemIndex != -1) {
        let newItem = {
          id: null,
          booking_photo_id: this.state.dataImageBooking[itemIndex].id,
          URL: this.state.dataImageBooking[itemIndex].URL
        }
        this.state.dataImage.push(newItem);
      }
    })
    this.state.modalChooseImageIsOpen = false;
    this.state.dataImageSelect = [];
    this.setState({...this.state});
  }

  findProduct(init) {
    let self = this;
    findProduct = setTimeout(function(){
      self.state.product_code_loading = true;
      self.setState({...self.state})
      Order.actions.getProduct.request({code: self.state.product_code}).then(res => {
        if(res.data) {
          let Data = res.data.data.product;
          self.state.product_name = Data.name ? Data.name : '';
          self.state.product_id = Data.id ? Data.id : '';
          let DataSkus = []
          Data.skus.map(itemSkus => {
            let newItemSkus = {
              id: itemSkus.product_sku.id,
              value: itemSkus.value
            }
            DataSkus.push(newItemSkus);
          })
          self.state.dataSkus = DataSkus || [];
          if(init != true) {
            self.state.product_sku_id = Data.skus[0].product_sku.id;
          }
          self.state.product_code_err = false;
        }
        self.state.product_code_loading = false;
        self.setState({...self.state})
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
        self.state.product_code_loading = false;
        self.state.product_code_err = true;
        self.setState({...self.state})
      })
    }, 1000)
  }

  render() {
    let Item = this.props.item;
    let Data = [...this.state.dataImageBooking];
    let DataImageFilter = Data.filter(item => {
      return (this.state.dataImage.findIndex(image => image.booking_photo_id == item.id) == -1);
    })
    return (
      <tr>
        <td>{Item.product_name}</td>
        <td>{Item.sku_attribute_code_value}</td>
        <td>{Item.product_code}</td>
        <td>{Item.photos.length + '/' + Item.product_photo_num }</td>
        <td>
          {
            Item.photos.map((item, index) => {
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
            <span className='item-link-action btn-main' onClick={this.openModal.bind(this, 'modalEditIsOpen')}>編集</span>
            <span className='item-link-action btn-danger' onClick={this.openModal.bind(this, 'modalDeleteIsOpen')}>削除</span>
          </div>
        </td>
        <Modal
          isOpen={this.state.modalDeleteIsOpen}
          onRequestClose={this.closeModal.bind(this, 'modalDeleteIsOpen')}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>確認</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalDeleteIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className='mb15 text-center'>{msg.confirmDeleteBookingProduct}</div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.deleteItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalDeleteIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalEditIsOpen}
          onRequestClose={this.closeModal.bind(this, 'modalEditIsOpen')}
          className="model-confirm-delete model-order-image modal-edit-booking-product"
        >
          <div className='title-block'>
            <h3 className='heading-3'>商品情報登録</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalEditIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className='row pl10 pr10 pb10 mb15'>
              <div className={`col-xs-4 no-gutter wrap-input-search ${this.state.product_code_loading ? 'disabled' : ''}`}>
                <Input className='col-xs-12' label='商品コード' value={this.state.product_code} onChange={this.onChange.bind(this, 'product_code')} require={true} bindValidator={this} channel='formEdit'/>
              </div>
              <Text className='col-xs-4' label='商品名' value={this.state.product_name}/>
              <DropDown className='col-xs-4' label='サイズ' value={this.state.product_sku_id} onChange={this.onChange.bind(this, 'product_sku_id')} options={this.state.dataSkus} keyName='id' valueName='value' require={true} bindValidator={this} channel='formEdit'/>
            </div>
            <div className="wrap-block-edit block-popup">
              <h2 className="title-block-edit">商品情報</h2>
              <div className="wrap-content-block-edit">
                <div className='mb15'>
                  <div className={`list-booking-photo ${this.state.loading ? 'form-disable' : ''}`} disabled={this.state.loading}>
                    <ShowIf condition={this.state.dataImageBooking.length > 0}>
                      <div>
                        <ShowIf condition={this.state.dataImage.length == 0}>
                          <div className='text-center'>データなし</div>
                        </ShowIf>
                        <ShowIf condition={this.state.dataImage.length > 0}>
                          <ReactUploadMultipleImage classNameCustom='item-image-modal' allowAddNew={false} data={this.state.dataImage} onChange={this.onChangeData.bind(this)} onDeleteItem={this.onDeleteItem.bind(this)}/>
                        </ShowIf>
                        <ShowIf condition={this.state.dataImageBooking.length != this.state.dataImage.length}>
                          <span className='btn-addnew' onClick={this.openModal.bind(this, 'modalChooseImageIsOpen')}>写真情報追加</span>
                        </ShowIf>
                      </div>
                    </ShowIf>
                    <ShowIf condition={this.state.dataImageBooking.length == 0}>
                      <div className='text-center'>データなし</div>
                    </ShowIf>
                  </div>
                </div>
              </div>
            </div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.updateItem.bind(this)}>保存</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalEditIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalChooseImageIsOpen}
          onRequestClose={this.closeModal.bind(this, 'modalChooseImageIsOpen')}
          className="model-confirm-delete model-order-image"
        >
          <div className='title-block'>
            <h3 className='heading-3'>写真追加</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalChooseImageIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className='upload-list-item'>
              {
                DataImageFilter.map((Item, index) => {
                  return(
                    <div className='item-upload-image mb20' style={{position: 'relative'}}>
                      <div className={`wrap wrap-select-image ${this.checkImageSelect(Item.id)}`}>
                          <div className='wrap-input-file' onClick={this.checkImage.bind(this, Item.id)}>
                            <div className='index-item'>{index + 1}</div>
                            <div className='check-mark'></div>
                            <img className='img-result' src={Item.URL}/>
                          </div>
                      </div>
                    </div>
                  )
                })
              }
              <ShowIf condition={this.state.dataImage.length == 0 && this.state.getDetail == true}>
                <span className='col-xs-12 pb15'>データなし</span>
              </ShowIf>
            </div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.addImage.bind(this)}>保存</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalChooseImageIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
      </tr>
    );
  }
}

ListItemProduct.defaultProps = {
  deleteItem: function() {},
  dataImageBooking: [],
  validators: {
    formEdit: []
  }
}
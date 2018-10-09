import React, { Component } from 'react';
import {Input, DropDown, Text, DatePicker, ReactUploadMultipleImage, CoupleInput, InputTel, TextArea} from 'components/inputform';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import {Costumes} from 'api';
import {Datatable} from 'components/datatable';
import {Order, System, BookingPhoto, CustomerDelivery} from 'api';
import {Toastr} from 'components/modules/toastr';
import ListItemProduct from './ListItemProduct.jsx';
import ListItemOrderProduct from './ListItemOrderProduct.jsx';
import ItemDelivery from './ItemDelivery.jsx';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import Modal from 'react-modal';
import moment from 'moment';
import * as CONFIG from 'constants/datetime';
import WrapBlockEdit from './WrapBlockEdit.jsx';

let findBooking;
let findProduct;

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageData: {
        number: 0,
        size: 50,
        totalElements: 0
      },
      listDelivery: [],
      order_number: '',
      booking_code: '',
      customer_id: '',
      customer_name: '',
      order_status_id: 1,
      order_date: '',
      tax_rate: '',
      product_code: '',
      product_id: '',
      product_name: '',
      product_sku_id: '',
      num: 1,

      //update
      discount_type: '',
      discount_price: '',
      discount_code: '',
      memo: '',
      headerListProduct: [
        { name: '商品名', width: 200, minWidth: 200 },
        { name: 'ステータス', width: 200, minWidth: 200 },
        { name: '個数', width: 200, minWidth: 200 },
        { name: '写真', minWidth: 200 },
        { name: '操作', width: 120, minWidth: 120 }
      ],
      data_1: [
        {value: 1, name: '金額値引き'},
        {value: 2, name: 'パーセント値引き'}
      ],
      dataProduct: [],
      headerProduct: [
        { name: '商品名', width: 130 },
        { name: 'サイズ', width: 130 },
        { name: '商品コード', width: 130 },
        { name: '写真枚数', width: 130 },
        { name: '写真', minWidth: 200 },
        { name: '操作', width: 100, minWidth: 100 }
      ],
      //end
      dataImage: [],
      dataImageBooking: [],
      dataOption: [{id: 1, name: 'test1'}],
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
      dataLocation: this.props.dataLocation || [],
      dataDeliveryTime: [
        {value: 'NULL', name: '指定なし'},
        {value: '1', name: '午前中'},
        {value: '2', name: '13:00〜17:00'},
        {value: '3', name: '17:00〜20:00'},
        {value: '4', name: '20:00〜21:00'}
      ],
      dataOrderStatus: [
        {value: 1, name: '新規受付'},
        {value: 2, name: '生産中'},
        {value: 3, name: '配送中'},
        {value: 4, name: '配送完了'},
        {value: 5, name: 'キャンセル'},
        {value: 6, name: '返品'}
      ],
      dataSkus: [],
      dataImageSelect: [],
      dataCustomer: {},
      booking_code_loading: false,
      product_code_loading: false,
      booking_code_err: false,
      product_code_err: false,
      modalEditIsOpen: false,
      modalChooseImageIsOpen: false,
      modalChooseDeliveryIsOpen: false,
      dataDelivery: [],
      idSuggest: null,
      itemSuggest: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataLocation != this.props.dataLocation) {
      this.state.dataLocation = nextProps.dataLocation;
      this.setState({...this.state});
    }
    if(nextProps.goToAddNew == true) {
      this.state.booking_code = nextProps.booking_code;
      this.setState({...this.state})
      this.findBooking();
    }
  }

  componentDidMount() {
    if(this.props.params && this.props.params.id) {
      this.getInfo();
    } else {
      this.addNewDelivery();
      if(this.props.goToAddNew == true) {
        this.state.booking_code = this.props.booking_code;
        this.setState({...this.state})
        this.findBooking();
      }
    }
  }

  addNewDelivery(e) {
    if(e) {
      e.preventDefault();
    }
    let Item = {
      first_name: '',
      last_name: '',
      postal_code1: '',
      postal_code2: '',
      prefecture: 1,
      tel1: '',
      tel2: '',
      tel3: '',
      address1: '',
      address2: '',
      delivery_date: '',
      delivery_time: 'NULL',
      send_date: '',
      voucher_number: '',
      status: 1,
      order_delivery_booking_products: []
    }
    this.state.listDelivery.push(Item)
    this.setState({...this.state})
  }

  getInfo() {
    Order.actions.detail.request({id: this.props.params.id}).then(res => {
      if(res && res.data) {
        let DataOrder = res.data.data.order;
        let DataDelivery = res.data.data.order_deliveries;
        let DataPhoto = res.data.data.order_photos;
        this.getDataOrder(DataOrder);
        this.getDataPhoto(DataPhoto);
        this.getDataDelivery(DataDelivery);
        this.getDataCustomer(DataOrder);
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

  getDataOrder(Data) {
    if(Data) {
      this.state.order_number = Data.order_number ? Data.order_number : '';
      this.state.booking_code = Data.booking_code ? Data.booking_code : '';
      this.state.booking_id = Data.booking_id ? Data.booking_id : '';
      this.state.product_id = Data.product_id ? Data.product_id : '';
      this.state.customer_id = Data.customer_id ? Data.customer_id : '';
      this.state.customer_name = ((Data.customer_last_name ? Data.customer_last_name : '') + ' ' + (Data.customer_first_name ? Data.customer_first_name : ''));
      this.state.order_status_id = Data.order_status_id ? Data.order_status_id : '';
      this.state.order_date = Data.order_date ? new Date(Data.order_date) : '';
      this.state.tax_rate = Data.tax_rate ? Data.tax_rate : '';
      this.state.product_code = Data.product_code ? Data.product_code : '';
      this.state.product_name = Data.product_name ? Data.product_name : '';
      this.state.product_sku_id = Data.product_sku_id ? Data.product_sku_id : '';
      this.state.discount_type = Data.discount_type ? Data.discount_type : '';
      this.state.discount_price = Data.discount_price ? Data.discount_price : '';
      this.state.discount_code = Data.discount_code ? Data.discount_code : '';
      this.state.memo = Data.memo ? Data.memo : '';
      this.setState({...this.state})
      this.loadImage();
      this.getListBookingProduct();
    }
  }

  getDataPhoto(Data) {
    if(Data) {
      Data.map(item => {
        let newItem = {
          URL: item.URL,
          id: item.id,
          booking_photo_id: item.booking_photo_id
        }
        this.state.dataImage.push(newItem);
      })
      this.setState({...this.state})
    }
  }

  getDataDelivery(Data) {
    if(Data.length > 0) {
      Data.map(item => {
        let newItem = {
          id: item.id,
          first_name: item.first_name ? item.first_name : '',
          last_name: item.last_name ? item.last_name : '',
          postal_code1: item.postal_code1 ? item.postal_code1 : '',
          postal_code2: item.postal_code2 ? item.postal_code2 : '',
          prefecture: item.prefecture ? item.prefecture : '',
          tel1: item.tel1 ? item.tel1 : '',
          tel2: item.tel2 ? item.tel2 : '',
          tel3: item.tel3 ? item.tel3 : '',
          address1: item.address1 ? item.address1 : '',
          address2: item.address2 ? item.address2 : '',
          delivery_date: item.delivery_date ? item.delivery_date : '',
          delivery_time: item.delivery_time ? item.delivery_time : '',
          send_date: item.send_date ? item.send_date : '',
          voucher_number: item.voucher_number ? item.voucher_number : '',
          count: item.count ? item.count : 1,
          status: item.status ? item.status : 1,
          order_delivery_booking_products: this.getOrderDelivery(item.order_delivery_booking_products)
        }
        this.state.listDelivery.push(newItem)
      })
      this.setState({...this.state})
    }
  }

  getOrderDelivery(data) {
    if (data.length > 0) {
      let DataResult = [];
      data.map(item => {
        let index = DataResult.findIndex(i => (i.product_id == item.product_id && i.product_sku_id == item.product_sku_id));
        if(index != -1) {
          DataResult[index].number = DataResult[index].number + 1;
          if (item.status == 1) {
            DataResult[index].safeItem = DataResult[index].safeItem + 1;
          } else if (item.status == 2) {
            DataResult[index].cancelItem = DataResult[index].cancelItem + 1;
          } else {
            DataResult[index].returnItem = DataResult[index].returnItem + 1;
          }
          if (item.status == 1) {
            DataResult[index].status = 1;
          } else if (item.status == 2 && DataResult[index].status != 1){
            DataResult[index].status = 2
          }
        } else {
          let newItem = {
            booking_product_id: item.booking_product_id,
            id: item.id,
            order_delivery_id: item.order_delivery_id,
            photos: item.photos,
            price: item.price,
            product_id: item.product_id,
            product_sku_id: item.product_sku_id,
            selling_price: item.selling_price,
            status: item.status,
            productCode: item.product_id + '_' + item.product_sku_id,
            number: 1
          }
          if (item.status == 1) {
            newItem.safeItem = 1;
            newItem.cancelItem = 0;
            newItem.returnItem = 0;
          } else if (item.status == 2) {
            newItem.safeItem = 0;
            newItem.cancelItem = 1;
            newItem.returnItem = 0;
          } else {
            newItem.safeItem = 0;
            newItem.cancelItem = 0;
            newItem.returnItem = 1;
          }
          DataResult.push(newItem);
        }
      })
      return DataResult;
    } else {
      return [];
    }
  }

  onChange(name, e) {
    if(name == 'booking_code') {
      clearTimeout(findBooking);
    }
    if(name == 'product_code') {
      clearTimeout(findProduct);
    }
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    }, ()=> {
      if(name == 'booking_code') {
        this.findBooking();
      }
      if(name == 'product_code') {
        this.findProduct();
      }
    })
  }

  findBooking() {
    this.props.dispatch({type: 'RESET_GO_TO_ADD_NEW_ORDER'})
    let self = this;
    if(this.state.booking_code) {
      findBooking = setTimeout(function(){
        self.state.booking_code_loading = true;
        self.setState({...self.state})
        Order.actions.getBooking.request({code: self.state.booking_code}).then(res => {
          let Data = {};
          if(res.data) {
            Data = res.data.data.booking;
            self.state.customer_id = Data.customer_id ? Data.customer_id : '';
            self.state.booking_id = Data.id ? Data.id : '';
            self.state.customer_name = ((Data.customer_last_name ? Data.customer_last_name : '') + ' ' + (Data.customer_first_name ? Data.customer_first_name : ''));
            self.state.booking_code_err = false;
          }
          self.state.dataImage = [];
          self.state.dataImageBooking = [];
          self.state.booking_code_loading = false;
          self.setState({...self.state})
          self.loadImage();
          self.getDataCustomer(Data);
          self.getListBookingProduct();
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
          self.state.booking_code_err = true;
          self.state.booking_code_loading = false;
          self.setState({...self.state})
        })
      }, 1000)
    }
  }

  getDataCustomer(data) {
    let NewData = {
      first_name: data.customer_first_name ? data.customer_first_name : '',
      last_name: data.customer_last_name ? data.customer_last_name : '',
      postal_code1: data.customer_postal_code1 ? data.customer_postal_code1 : '',
      postal_code2: data.customer_postal_code2 ? data.customer_postal_code2 : '',
      prefecture: data.customer_prefecture ? data.customer_prefecture : 1,
      tel1: data.customer_tel1 ? data.customer_tel1 : '',
      tel2: data.customer_tel2 ? data.customer_tel2 : '',
      tel3: data.customer_tel3 ? data.customer_tel3 : '',
      address1: data.customer_address1 ? data.customer_address1 : '',
      address2: data.customer_address2 ? data.customer_address2 : '',
      customer_id: data.customer_id ? data.customer_id : ''
    }
    this.state.dataCustomer = NewData;
    this.setState({...this.state});
    this.getListDelivery();
  }

  getListDelivery() {
    let params = {limit: 0, customer_id: this.state.dataCustomer.customer_id};

    CustomerDelivery.actions.list.request(params).then(res => {
      if(res && res.data) {
        let Data = res.data.data.customer_deliveries;
        this.state.dataDelivery = Data;
        this.setState({
          ...this.state
        })
      } else {
        this.state.dataDelivery = [];
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

  onChangeDate(name, e) {
    this.state[name] = e;
    this.setState({
      ...this.state
    })
  }

  openModal(name, id) {
    this.state[name] = true;
    if(name == 'modalChooseDeliveryIsOpen') {
      this.state.idSuggest = id;
      this.state.itemSuggest = this.state.dataCustomer;
    }
    this.setState({
      ...this.state
    })
  }

  closeModal(name) {
    this.state.dataImageSelect = [];
    this.state[name] = false;
    this.state.deleteLoading = false;
    this.state.idSuggest = null;
    this.state.product_code = '';
    this.state.dataImage = [];
    this.state.product_sku_id = '';
    this.state.product_name = '';
    this.setState({
      ...this.state
    })
  }

  postProcess(params) {
    Order.actions.create.request('', params).then(res => {
      Toastr(this.state.order_number +  msg.createOrderSuccess, 'success');
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
      this.setState({...this.state})
    })
  }

  patchProcess(params) {
    Order.actions.update.request({id: this.props.params.id}, params).then(res => {
      Toastr(this.state.order_number +  msg.updateOrderSuccess, 'success');
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
      this.setState({...this.state})
    })
  }

  getParams() {
    let params = {};
    params.booking_id = this.state.booking_id;
    params.order_time = moment(this.state.order_date).format(CONFIG.DateTimeSecondFormat) || null;
    params.tax_rate = this.state.tax_rate || null;
    params.discount_type = this.state.discount_type || null;
    params.discount_price = this.state.discount_price || null;
    params.discount_code = this.state.discount_code || null;
    params.memo = this.state.memo || '';
    params.order_deliveries = [];
    this.state.listDelivery.map(item => {
      let newItem = {
        status: item.status || '',
        last_name: item.last_name || '',
        first_name: item.first_name || '',
        postal_code1: item.postal_code1 || '',
        postal_code2: item.postal_code2 || '',
        prefecture: item.prefecture || '',
        address1: item.address1 || '',
        address2: item.address2 || '',
        tel1: item.tel1 || '',
        tel2: item.tel2 || '',
        tel3: item.tel3 || '',
        order_delivery_booking_products: this.getListOrderDelivery(item.order_delivery_booking_products)
      }
      if (item.id) {
        newItem.id = item.id;
      }
      if (item.delivery_date) {
        newItem.delivery_date = moment(item.delivery_date).format(CONFIG.DateFormat);
      }
      if (item.delivery_time) {
        if(item.delivery_time == 'NULL') {
          newItem.delivery_time = null;
        } else {
          newItem.delivery_time = item.delivery_time;
        }
      }
      if (item.send_date) {
        newItem.send_date = moment(item.send_date).format(CONFIG.DateFormat);
      }
      if (item.voucher_number) {
        newItem.voucher_number = item.voucher_number;
      }
      params.order_deliveries.push(newItem);
    })

    return params
  }

  getListOrderDelivery(data) {
    if (data.length > 0) {
      let newData = [];
        data.map(item => {
        for (var i = 0; i < item.safeItem ; i++) {
          if(item.booking_product_id) {
            let newItem = {
              booking_product_id: item.booking_product_id,
              status: 1
            }
            newData.push(newItem);
          }
        }
        for (var i = 0; i < item.cancelItem ; i++) {
          if(item.booking_product_id) {
            let newItem = {
              booking_product_id: item.booking_product_id,
              status: 2
            }
            newData.push(newItem);
          }
        }
        for (var i = 0; i < item.returnItem ; i++) {
          if(item.booking_product_id) {
            let newItem = {
              booking_product_id: item.booking_product_id,
              status: 3
            }
            newData.push(newItem);
          }
        }
      })
      return newData;
    } else {
      return []
    }
  }

  validateSubmitForm() {
    let countItem = 0;
    let pass = true;
    this.state.listDelivery.map(item => {
      countItem = countItem + Number(item.count);
    })
    if (this.state.booking_code_err) {
      Toastr(msg.bookingCodeNotFound, 'error');
      pass = false;
    } else {
      this.props.validators['form'].map(validator => {
        if(pass) {
          pass = validator.validate();
        } else {
          validator.validate();
        }
      })
    }
    return pass;
  }

  componentWillUnmount() {
    this.props.validators['form'] = [];
    this.props.validators['formCreateOrder'] = [];
  }

  goBack() {
    this.props.dispatch({type: 'ORDER_GO_BACK'});
    this.props.history.push('/orders');
  }

  onChangeItem(index, name, e) {
    this.state.listDelivery[index][name] = e.target.value;
    this.setState({...this.state});
  }

  onChangeDateItem(index, name, e) {
    this.state.listDelivery[index][name] = e
    this.setState({...this.state})
  }

  onChangeData(data) {
    this.state.dataImage = data;
    this.setState({...this.state})
  }

  onDeleteItem(id) {}

  removeDelivery(index) {
    this.state.listDelivery.splice(index, 1);
    this.setState({...this.state})
  }

  addDataSuggest() {
    if(this.state.booking_code_err) {
      Toastr(msg.addressDataNotFound, 'error')
    } else if (this.state.itemSuggest){
      let Data = this.state.itemSuggest;
      this.state.listDelivery[this.state.idSuggest].first_name = Data.first_name ? Data.first_name : '';
      this.state.listDelivery[this.state.idSuggest].last_name = Data.last_name ? Data.last_name : '';
      this.state.listDelivery[this.state.idSuggest].postal_code1 = Data.postal_code1 ? Data.postal_code1 : '';
      this.state.listDelivery[this.state.idSuggest].postal_code2 = Data.postal_code2 ? Data.postal_code2 : '';
      this.state.listDelivery[this.state.idSuggest].prefecture = Data.prefecture ? Data.prefecture : 1,
      this.state.listDelivery[this.state.idSuggest].tel1 = Data.tel1 ? Data.tel1 : '';
      this.state.listDelivery[this.state.idSuggest].tel2 = Data.tel2 ? Data.tel2 : '';
      this.state.listDelivery[this.state.idSuggest].tel3 = Data.tel3 ? Data.tel3 : '';
      this.state.listDelivery[this.state.idSuggest].address1 = Data.address1 ? Data.address1 : '';
      this.state.listDelivery[this.state.idSuggest].address2 = Data.address2 ? Data.address2 : '';
      this.setState({...this.state});
      this.closeModal('modalChooseDeliveryIsOpen');
    }
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  loadImage() {
    if(this.state.booking_id) {
      BookingPhoto.actions.get.request({booking_id: this.state.booking_id}).then(res => {
        if(res.data) {
          let Data = res.data.data;
          this.state.dataImageBooking = Data.booking_photos || [];
          this.setState({...this.state})
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

  handlePageClick() {}

  //Booking product
  getListBookingProduct() {
    Order.actions.getListBookingProduct.request({booking_code: this.state.booking_code}).then(res => {
      if(res.data) {
        let Data = res.data.data.bookingProducts;
        let NewData = [];
        Data.map(item => {
          let newItem = { ...item,
            productCode: item.product_id + '_' + item.product_sku_id,
            productName: item.product_name + '/' + item.sku_attribute_code_value,
          }
          NewData.push(newItem);
        })
        this.state.dataProduct = NewData;
        this.setState({...this.state});
      }
    }).catch(err => {
      this.state.dataProduct = [];
      this.setState({...this.state});
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

  createOrder(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = this.getParams();
      if(this.props.edit == true) {
        this.patchProcess(params);
      } else {
        this.postProcess(params);
      }
    }
    return;
  }

  addNewOrder(index) {
    this.state.listDelivery[index].order_delivery_booking_products.push({number: 1, status: 1, safeItem: 1, returnItem: 0, cancelItem: 0, photos: []});
    this.setState({...this.state});
  }

  createProduct() {
    if(this.validateSubmitOrderForm()) {
      let params = this.getParamsProuct();
      Order.actions.createBookingProduct.request(params).then(res => {
        Toastr(msg.createBookingProduct, 'success');
        this.closeModal('modalEditIsOpen');
        this.getListBookingProduct();
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

  updateOrderItem() {
    this.state.listDelivery.map((item, index) => {
      this.state.listDelivery[index].order_delivery_booking_products = [];
    })
    this.setState({...this.state});
  }

  getParamsProuct() {
    let params = {
      booking_id: this.state.booking_id,
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

  validateSubmitOrderForm() {
    let pass = true;
    this.props.validators['formCreateOrder'].map(validator => {
      if(pass) {
        pass = validator.validate();
      } else {
        validator.validate();
      }
    })
    return pass;
  }

  onChangeItemDelivery(data, index, indexItem) {
    this.state.listDelivery[indexItem].order_delivery_booking_products[index] = data;
    this.setState({...this.state})
  }

  onDeleteItem(index, indexItem) {
    this.state.listDelivery[indexItem].order_delivery_booking_products.splice(index, 1);
    this.setState({...this.state})
  }
  //end

  render() {
    let Data = [...this.state.dataImageBooking];
    let DataImageFilter = Data.filter(item => {
      return (this.state.dataImage.findIndex(image => image.booking_photo_id == item.id) == -1);
    })
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>受注情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>受注情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container'>
          <form className='search-form' method='javascript:voild(0)'>
            <div className='row ml15 mr15'>
              <ShowIf condition={this.props.edit == true}>
                <Text label='予約コード' className='col-xs-4 mb15' value={this.state.order_number}/>
              </ShowIf>
            </div>
            <div className='row ml15 mr15'>
              <div className={`col-xs-4 no-gutter wrap-input-search ${this.state.booking_code_loading ? 'disabled' : ''}`}>
                <Input label='予約情報コード' className='col-xs-12 mb15' value={this.state.booking_code} onChange={this.onChange.bind(this, 'booking_code')} require={true} bindValidator={this} channel='form'/>
              </div>
              <Text label='会員ID' className='col-xs-4 mb15' value={this.state.customer_id} className='col-xs-4 mb15'/>
              <Text label='会員名' className='col-xs-4 mb15' value={this.state.customer_name} className='col-xs-4 mb15'/>
              <DatePicker timeFormat={CONFIG.LongTimeFormat} placeholder={CONFIG.DateTimeSecondFormat} label='受注日' className='col-xs-4 mb15 clear-left' value={this.state.order_date} onChange={this.onChangeDate.bind(this, 'order_date')} require={true} bindValidator={this} channel='form'/>
              <Input label='受注時税率' hasUnit={true} perLabel='%' className='col-xs-4 mb15' value={this.state.tax_rate} onChange={this.onChange.bind(this, 'tax_rate')} require={true} bindValidator={this} channel='form'/>
            </div>
            <div className='row ml15 mr15'>
              <DropDown label='割引種別' className='col-xs-4 clear-left' placeholder='割引種別' showPlaceholder={true} value={this.state.discount_type} onChange={this.onChange.bind(this, 'discount_type')} options={this.state.data_1} keyName='value' valueName='name'/>
              <ShowIf condition={this.state.discount_type != ''}>
                <Input label='割引金額' hasUnit={true} perLabel={this.state.discount_type == 1 ? '円' : '%'} className='col-xs-4 mb15' value={this.state.discount_price} onChange={this.onChange.bind(this, 'discount_price')}/>
              </ShowIf>
              <Input label='割引コード' className='col-xs-4 mb15' value={this.state.discount_code} onChange={this.onChange.bind(this, 'discount_code')}/>
            </div>
            <div className='row ml15 mb15 mr15'>
              <TextArea label='メモ' className='col-xs-12 mb15' value={this.state.memo} onChange={this.onChange.bind(this, 'memo')}/>
            </div>
            <WrapBlockEdit title='商品情報'>
              <Datatable
                title={null}
                header={this.state.headerProduct}
                pageData={this.state.pageData}
                handlePageClick = {this.handlePageClick.bind(this)}
                dataList={this.state.dataProduct}
                loading={this.state.loading}
                numberColumnHeader ={6}
              >
                <ListItemProduct updateOrderItem={this.updateOrderItem.bind(this)} getListData={this.getListBookingProduct.bind(this)} dataImageBooking={this.state.dataImageBooking}/>
              </Datatable>
              <div className='row mt25 pl15 pr15'>
                <span className='btn-addnew' onClick={this.openModal.bind(this, 'modalEditIsOpen')}>+ 商品情報追加</span>
              </div>
            </WrapBlockEdit>
            <WrapBlockEdit title='配送情報' hasBottomBorder={true}>
              <div>
                {
                  this.state.listDelivery.map((item, index) => {
                    return(
                      <div className={`row ${index == this.state.listDelivery.length - 1 ? '' : 'mb15'}`} key={index}>
                        <div className='title-block col-xs-12 mb15'>
                          <p className='bold mb0'>
                            配送情報 {this.state.listDelivery.length == 0 ? '' : index + 1}
                            <ShowIf condition={this.state.listDelivery.length > 1}>
                              <span className='btn-addnew btn-red ml15' onClick={this.removeDelivery.bind(this, index)}>削除</span>
                            </ShowIf>
                          </p>
                          <span className='btn-addnew' onClick={this.openModal.bind(this, 'modalChooseDeliveryIsOpen', index)}>住所を会員情報から選択する</span>
                        </div>

                        <div className='col-xs-12 no-gutter'>
                          <DropDown label='ステータス' value={item.status} onChange={this.onChangeItem.bind(this, index, 'status')} require={true} bindValidator={this} channel='form' options={this.state.dataOrderStatus} keyName='value' valueName='name' className='col-xs-3 mb15'/>
                        </div>
                        <div className='col-xs-12 no-gutter'>
                          <Input label='姓' className='col-xs-3 mb15' value={item.last_name} onChange={this.onChangeItem.bind(this, index, 'last_name')} require={true} bindValidator={this} channel='form'/>
                          <Input label='名' className='col-xs-3 mb15' value={item.first_name} onChange={this.onChangeItem.bind(this, index, 'first_name')} require={true} bindValidator={this} channel='form'/>
                          <CoupleInput className='col-xs-6 mb15' require bindValidator={this} channel='form' label='' labelMin='郵便番号１' labelMax='郵便番号2' valueMin={item.postal_code1} valueMax={item.postal_code2} onChangeMin={this.onChangeItem.bind(this, index, 'postal_code1')} onChangeMax={this.onChangeItem.bind(this, index, 'postal_code2')}/>
                        </div>
                        <div className='col-xs-12 no-gutter'>
                          <DropDown label='都道府県' value={item.prefecture} onChange={this.onChangeItem.bind(this, index, 'prefecture')} require={true} bindValidator={this} channel='form' options={this.state.dataLocation} keyName='key' valueName='value' className='col-xs-3 mb15'/>
                          <InputTel className='col-xs-9 mb15' require bindValidator={this} channel='form' labelTel1='電話番号１' labelTel2='電話番号2' labelTel3='電話番号3' tel1={item.tel1} tel2={item.tel2} tel3={item.tel3} onChangeTel1={this.onChangeItem.bind(this, index, 'tel1')} onChangeTel2={this.onChangeItem.bind(this, index, 'tel2')} onChangeTel3={this.onChangeItem.bind(this, index, 'tel3')}/>
                        </div>
                        <div className='col-xs-12 no-gutter'>
                          <Input label='住所1' className='col-xs-3 mb15' value={item.address1} onChange={this.onChangeItem.bind(this, index, 'address1')} require={true} bindValidator={this} channel='form'/>
                          <Input label='住所2' className='col-xs-3 mb15' value={item.address2} onChange={this.onChangeItem.bind(this, index, 'address2')} />
                          <DatePicker label='配送指定日時' className='col-xs-3 mb15' value={item.delivery_date} onChange={this.onChangeDateItem.bind(this, index, 'delivery_date')}/>
                          <DropDown label='配送指定時間' value={item.delivery_time} onChange={this.onChangeItem.bind(this, index, 'delivery_time')} options={this.state.dataDeliveryTime} keyName='value' valueName='name' className='col-xs-3 mb15'/>
                        </div>
                        <div className='col-xs-12 no-gutter'>
                          <DatePicker label='発送日' className='col-xs-4 mb15' value={item.send_date} onChange={this.onChangeDateItem.bind(this, index, 'send_date')}/>
                          <Input label='配送伝達番号' className='col-xs-4 mb15' value={item.voucher_number} onChange={this.onChangeItem.bind(this, index, 'voucher_number')}/>
                        </div>
                        <div className='col-xs-12'>
                          <Datatable
                            title={'商品'}
                            header={this.state.headerListProduct}
                            pageData={this.state.pageData}
                            handlePageClick = {this.handlePageClick.bind(this)}
                            dataList={item.order_delivery_booking_products}
                            loading={this.state.loading}
                            numberColumnHeader={5}
                          >
                            <ListItemOrderProduct dataList={item.order_delivery_booking_products} onDeleteItem={this.onDeleteItem.bind(this)} onChange={this.onChangeItemDelivery.bind(this)} indexItem={index} dataProduct={this.state.dataProduct} dataImageBooking={this.state.dataImageBooking}/>
                          </Datatable>
                          <div className='row mt25 pl15 pr15 '>
                            <ShowIf condition={item.order_delivery_booking_products.length != this.state.dataProduct.length}>
                              <span className='btn-addnew mb15' onClick={this.addNewOrder.bind(this, index)}>+ 商品追加</span>
                            </ShowIf>
                          </div>
                        </div>
                        <div className='col-xs-12'>
                          <span className='line-border'/>
                        </div>
                        <ShowIf condition={index == this.state.listDelivery.length - 1}>
                          <div className='col-xs-12 mt15'>
                            <span className='btn-addnew' onClick={this.addNewDelivery.bind(this)}>+ 配送情報追加</span>
                          </div>
                        </ShowIf>
                      </div>
                    )
                  })
                }
              </div>
            </WrapBlockEdit>
            <div className='col-xs-12 pt15 pl30 pr30 mt15'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.createOrder.bind(this)}>保存</button>
              <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
            </div>
          </form>
        </div>
        <Modal isOpen={this.state.modalEditIsOpen} onRequestClose={this.closeModal.bind(this, 'modalEditIsOpen')} className="model-confirm-delete model-order-image modal-edit-booking-product">
          <div className='title-block'>
            <h3 className='heading-3'>商品情報登録</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalEditIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className='row pl10 pr10 pb10 mb15'>
              <div className={`col-xs-4 no-gutter wrap-input-search ${this.state.product_code_loading ? 'disabled' : ''}`}>
                <Input className='col-xs-12' label='商品コード' value={this.state.product_code} onChange={this.onChange.bind(this, 'product_code')} require={true} bindValidator={this} channel='formCreateOrder'/>
              </div>
              <Text className='col-xs-4' label='商品名' value={this.state.product_name}/>
              <DropDown className='col-xs-4' label='サイズ' value={this.state.product_sku_id} onChange={this.onChange.bind(this, 'product_sku_id')} options={this.state.dataSkus} keyName='id' valueName='value' require={true} bindValidator={this} channel='formCreateOrder'/>
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
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.createProduct.bind(this)}>保存</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalEditIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
        <Modal isOpen={this.state.modalChooseImageIsOpen} onRequestClose={this.closeModal.bind(this, 'modalChooseImageIsOpen')} className="model-confirm-delete model-order-image" >
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
        <Modal isOpen={this.state.modalChooseDeliveryIsOpen} onRequestClose={this.closeModal.bind(this, 'modalChooseDeliveryIsOpen')} className="model-confirm-delete model-order-image" >
          <div className='title-block'>
            <h3 className='heading-3'>住所を会員情報から選択する</h3>
            <button className='btn-close' onClick={this.closeModal.bind(this, 'modalChooseDeliveryIsOpen')}></button>
          </div>
          <div className='wrap-content-modal'>
            <div className=''>
              <ItemDelivery name='itemDelivery' isMember={true} defaultChecked={true} {...this.state.dataCustomer} onChange={this.onChange.bind(this, 'itemSuggest')}/>
              <div>
                {
                  this.state.dataDelivery.map((item, index) => {
                    return(
                      <ItemDelivery index={index} name='itemDelivery' {...item} onChange={this.onChange.bind(this, 'itemSuggest')}/>
                    )
                  })
                }
              </div>
            </div>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.addDataSuggest.bind(this)}>保存</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this, 'modalChooseDeliveryIsOpen')}>キャンセル</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

Add.defaultProps={
  validators: {
    form: [],
    formCreateOrder: []
  },
  dataLocation: [],
  booking_code: null,
  goToAddNew: false
}

function bindStateToProps(state) {
  return {
    listNews: state.listNews.data,
    dataLocation: state.systemData.prefectures,
    booking_code: state.order.booking_code,
    goToAddNew: state.order.goToBooking
  }
}

export default connect(bindStateToProps)(withRouter(Add));
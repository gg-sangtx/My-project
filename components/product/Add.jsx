import React, { Component } from 'react';
import { Input, UploadMultipleImage, ListCoupleInput } from 'components/inputform';
import { connect } from 'react-redux';
import { Product } from 'api';
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
      product_code: '',
      name: '',
      price: '',
      real_price: '',
      photo_num: '',
      skus: [],
      images: []
    }
  }

  componentDidMount() {
    if(this.props.params && this.props.params.id) {
      this.getDetail();
    } else {
      this.state.skus = [{
        value: '',
        product_code: '',
        jan_code: ''
      }];
      this.state.images = [{}];
      this.setState({...this.state})
    }
  }

  getDetail() {
    Product.actions.detail.request({id: this.props.params.id}).then(res => {
      if(res.data) {
        let dataDetail = res.data.data.product;
        this.getData(dataDetail);
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

  getData(data) {
    this.state.product_code = data.product_code || '';
    this.state.name = data.name || '';
    this.state.price = data.price || '';
    this.state.real_price = data.real_price || '';
    this.state.photo_num = data.photo_num || '';
    if (data.skus.length > 0) {
      data.skus.map(item => {
        let newItem = {
          id: item.product_sku.id,
          value: item.value,
          product_code: item.product_sku.product_code,
          jan_code: item.product_sku.jan_code
        }
        this.state.skus.push(newItem)
      })
    } else {
      this.state.skus = [{
        value: '',
        product_code: '',
        jan_code: ''
      }];
    }
    if (data.images.length > 0) {
      data.images.map(item => {
        let newItem = {
          imagePreviewUrl: item.url || '',
          sort: item.sort_value || '',
          alt: item.text || '',
          id: item.id
        }
        this.state.images.push(newItem)
      })
    } else {
      this.state.images = [{}];
    }
    this.setState({...this.state});
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  getParams() {
    let params = {};
    params.product_code = this.state.product_code ? this.state.product_code : null;
    params.name = this.state.name ? this.state.name : null;
    params.price = this.state.price ? Number(this.state.price) : null;
    params.real_price = this.state.real_price ? Number(this.state.real_price) : null;
    params.photo_num = this.state.photo_num ? this.state.photo_num : null;
    params.product_skus = []

    if(this.state.skus.length > 0) {
      this.state.skus.map(item => {
        if(item.value || item.jan_code) {
          let newItem = {
            id: item.id || null,
            value: item.value || '',
            product_code: item.product_code || '',
            jan_code: item.jan_code || ''
          }
          params.product_skus.push(newItem)
        }
      })
    }
    params.product_images = [];
    if (this.state.images.length > 0) {
      this.state.images.map(item => {
        if(item.imagePreviewUrl && item.sort) {
          let newItem = {
            id: item.id || null,
            url: item.imagePreviewUrl || null,
            text: item.alt || '',
            sort_value: item.sort || ''
          }
          params.product_images.push(newItem);
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
    Product.actions.create.request('', params).then(res => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(this.state.name + msg.createProduct, 'success');
      this.props.history.push('/products');
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
    Product.actions.update.request({id: this.props.params.id}, params).then(res => {
      Toastr(this.state.name + msg.editProduct, 'success');
      this.props.history.push('/products');
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
    this.props.dispatch({type: 'PRODUCT_GO_BACK'});
    this.props.history.push('/products');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>物販商品情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>物販商品情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>
            <Input className='col-xs-6 mb15 clear-left' label='物販商品コード' require bindValidator={this} channel='form' type='text' name='product_code' value={this.state.product_code} onChange={this.onChange.bind(this, 'product_code')}/>
            <Input className='col-xs-6 mb15' label='物販商品名' require bindValidator={this} channel='form' type='text' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
            <Input className='col-xs-6 mb15 clear-left' label='定価' require bindValidator={this} channel='form' type='text' name='price' value={this.state.price} onChange={this.onChange.bind(this, 'price')}/>
            <Input className='col-xs-6 mb15' label='販売価格' require bindValidator={this} channel='form' type='text' name='real_price' value={this.state.real_price} onChange={this.onChange.bind(this, 'real_price')}/>
            <Input className='col-xs-6 mb15 clear-left' label='写真枚数' require bindValidator={this} channel='form' type='text' name='photo_num' value={this.state.photo_num} onChange={this.onChange.bind(this, 'photo_num')}/>
            <ListCoupleInput valueNameOne='value' valueNameTwo='product_code' valueNameThree='jan_code' className='col-xs-10 mb15 clear-left' labelOne='サイズ' labelTwo='商品コード' labelThree='JANコード' require bindValidator={this} channel='form' type='text' name='skus' value={this.state.skus} onChange={this.onChange.bind(this, 'skus')}/>
            <div className='col-sm-12'>
              <UploadMultipleImage bindValidator={this} label='写真' hasAlt={true} altLabel='alt' hasSort={true} sortLabel='優先度' name='images' data={this.state.images} onChange={this.onChange.bind(this, 'images')}/>
            </div>
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
    dataList: state.listProduct.data,
    dataLocation: state.systemData.prefectures,
  }
}

export default connect(bindStateToProps)(withRouter(Add))
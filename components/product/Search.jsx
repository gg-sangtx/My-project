import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, CoupleInputHasUnit} from 'components/inputform';
import {connect} from 'react-redux';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      product_code: '',
      jan_code: '',
      name: '',
      price_from: '',
      price_to: '',
      real_price_from: '',
      real_price_to: ''
    }
  }

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  Collapse() {
    this.state.isOpen = !this.state.isOpen;
    this.setState({
      ...this.state
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.loading == false) {
      this.state.search = false;
    }
    if(nextProps.goBack == true) {
      this.state.product_code = nextProps.dataSearch.product_code ? nextProps.dataSearch.product_code : '';
      this.state.product_skus_product_code = nextProps.dataSearch.product_skus_product_code ? nextProps.dataSearch.product_skus_product_code : '';
      this.state.jan_code = nextProps.dataSearch.jan_code ? nextProps.dataSearch.jan_code : '';
      this.state.name = nextProps.dataSearch.name ? nextProps.dataSearch.name : '';
      this.state.price_from = nextProps.dataSearch.price_from ? nextProps.dataSearch.price_from : '';
      this.state.price_to = nextProps.dataSearch.price_to ? nextProps.dataSearch.price_to : '';
      this.state.real_price_from = nextProps.dataSearch.real_price_from ? nextProps.dataSearch.real_price_from : '';
      this.state.real_price_to = nextProps.dataSearch.real_price_to ? nextProps.dataSearch.real_price_to : '';
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      product_code: this.state.product_code ? this.state.product_code : '',
      product_skus_product_code: this.state.product_skus_product_code ? this.state.product_skus_product_code : '',
      jan_code: this.state.jan_code ? this.state.jan_code : '',
      name: this.state.name ? this.state.name : '',
      price_from: this.state.price_from ? this.state.price_from : '',
      price_to: this.state.price_to ? this.state.price_to : '',
      real_price_from: this.state.real_price_from ? this.state.real_price_from : '',
      real_price_to: this.state.real_price_to ? this.state.real_price_to : '',
    }
    this.props.search(data);
    return;
  }

  render() {
    return (
      <div className='search-container'>
        <div className='title-collapse'>
          <h3 className='heading-3 bold'>検索条件</h3>
          <button className={`btn-collapse ${this.state.isOpen ? 'collaped' : ''}`} onClick={this.Collapse.bind(this)}></button>
        </div>
        <Collapse isOpened={this.state.isOpen}>
          <div className='wrap-collapse-content'>
            <form className='search-form'>
              <div className='col-xs-12'>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='物販商品コード' type='text' name='product_code' value={this.state.product_code} onChange={this.onChange.bind(this, 'product_code')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='商品コード' type='text' name='product_skus_product_code' value={this.state.product_skus_product_code} onChange={this.onChange.bind(this, 'product_skus_product_code')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='JANコード' type='text' name='jan_code' value={this.state.jan_code} onChange={this.onChange.bind(this, 'jan_code')}/>
                <Input className=' col-xs-12 col-sm-6 col-lg-3 mb15' label='物販商品名' type='text' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <CoupleInputHasUnit className='col-xs-12 col-sm-6 mb15' label='定価' unitLabel='¥' type='text' name='price_from' valueMax={this.state.price_to} valueMin={this.state.price_from} onChangeMax={this.onChange.bind(this, 'price_to')} onChangeMin={this.onChange.bind(this, 'price_from')}/>
                <CoupleInputHasUnit className='col-xs-12 col-sm-6 mb15' label='販売価格' unitLabel='¥' type='text' name='price_to' valueMax={this.state.real_price_to} valueMin={this.state.real_price_from} onChangeMax={this.onChange.bind(this, 'real_price_to')} onChangeMin={this.onChange.bind(this, 'real_price_from')}/>
              </div>
              <div className='wrap-button text-center mt10 mb15 col-xs-12 no-gutter'>
                <button className={`btn-submit-form${this.state.search == true ? ' has-loading' : ''}`} disabled={this.props.loading ? true : false} onClick={this.search.bind(this)}>検索する</button>
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    );
  }
}

Search.defaultProps = {
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    dataSearch: state.listProduct.dataSearch,
    goBack: state.listProduct.goBack,
  }
}

export default connect(bindStateToProps)(Search)

import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, InputGroupCurrency} from 'components/inputform';
import {connect} from 'react-redux';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      name: '',
      priceFrom: '',
      priceTo: ''
    }
  }

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  onBlur(name, e) {
    this.setState({
      [name]: e.target.value
    });
    
    if(name=="priceTo" && this.state.priceFrom > this.state.priceTo) {
      this.setState({
        priceFrom: this.state.priceTo,
        priceTo: this.state.priceFrom
      })
    }
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
      this.state.name = nextProps.dataSearch.name;
      this.state.priceFrom = nextProps.dataSearch.price_from;
      this.state.priceTo = nextProps.dataSearch.price_to;
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      name: this.state.name ? this.state.name : '',
      price_from: this.state.priceFrom ? this.state.priceFrom : '',
      price_to: this.state.priceTo ? this.state.priceTo : ''
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
              <Input className='col-xs-12 col-sm-6 col-md-4 mb15' label='オプション名' type='text' maxLength='40' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
              <div className="col-xs-12 col-sm-6 col-md-8 mb15">
               <InputGroupCurrency labelGroup="単位金額" labelFrom="¥" labelTo="¥" name="price" require={false} type="number" valueFrom={this.state.priceFrom} valueTo={this.state.priceTo} onChangeFrom={this.onChange.bind(this, 'priceFrom')} onChangeTo={this.onChange.bind(this, 'priceTo')} onBlurFrom={this.onBlur.bind(this, 'priceFrom')} onBlurTo={this.onBlur.bind(this, 'priceTo')}   disabled={false} />
              </div>
              <div className='wrap-button text-center mt10 col-xs-12 no-gutter'>
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
  dataPrefectures: [],
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    dataPrefectures: state.systemData.prefectures,
    dataSearch: state.listPlanOptions.dataSearch,
    goBack: state.listPlanOptions.goBack,
  }
}

export default connect(bindStateToProps)(Search)

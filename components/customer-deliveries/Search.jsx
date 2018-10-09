import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, DropDown} from 'components/inputform';
import {connect} from 'react-redux';
import {DateFormat, DateTimeFormat} from 'constants/datetime';
import moment from 'moment';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      name: '',
      email: '',
      tel: '',
      listCategory: this.props.listCategory,
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
    if(nextProps.listCategory != this.props.listCategory) {
      this.state.listCategory = nextProps.listCategory;
    }
    if(nextProps.goBack == true) {
      this.state.name = nextProps.dataSearch.name ? nextProps.dataSearch.name : '';
      this.state.email = nextProps.dataSearch.email ? nextProps.dataSearch.email : '';
      this.state.tel = nextProps.dataSearch.tel ? nextProps.dataSearch.tel : '';
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      name: this.state.name ? this.state.name : '',
      email: this.state.email ? this.state.email : '',
      tel: this.state.tel ? this.state.tel : '',
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
                <Input className=' col-xs-4 mb15' label='会員名' type='text' maxLength='255' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <Input className=' col-xs-4 mb15' label='メールアドレス' type='text' maxLength='255' name='email' value={this.state.email} onChange={this.onChange.bind(this, 'email')}/>
                <Input className=' col-xs-4 mb15' label='電話番号' type='text' maxLength='255' name='tel' value={this.state.tel} onChange={this.onChange.bind(this, 'tel')}/>
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
  listCategory: [],
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    listCategory: state.systemData.listCategory,
    dataSearch: state.listCustomer.dataSearch,
    goBack: state.listCustomer.goBack,
  }
}

export default connect(bindStateToProps)(Search)

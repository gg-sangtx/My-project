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
      category_id: '',
      text: '',
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
      this.state.category_id = nextProps.dataSearch.category_id ? nextProps.dataSearch.category_id : '';
      this.state.text = nextProps.dataSearch.text ? nextProps.dataSearch.text : '';
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      category_id: this.state.category_id ? this.state.category_id : '',
      text: this.state.text ? this.state.text : '',
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
                <DropDown className=' col-xs-6 col-sm-3 mb15' label='カテゴリ' showPlaceholder={true} placeholder='選択なし' name='category_id' value={this.state.category_id} onChange={this.onChange.bind(this, 'category_id')} options={this.state.listCategory} keyName='key' valueName='value'/>
                <Input className=' col-xs-6 col-sm-9 mb15' label='フリーワード' type='text' maxLength='40' name='text' value={this.state.text} onChange={this.onChange.bind(this, 'text')}/>
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
    dataSearch: state.listFAQ.dataSearch,
    goBack: state.listFAQ.goBack,
  }
}

export default connect(bindStateToProps)(Search)

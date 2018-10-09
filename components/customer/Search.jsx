import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, DropDown, GroupRadio} from 'components/inputform';
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
      name_kana: '',
      email: '',
      tel: '',
      address: '',
      prefecture: '',
      mailmag: 'null',
      listCategory: this.props.listCategory,
      dataPrefecture: this.props.dataPrefecture,
      dataRadio: [
        {value: 'null', name: '指定しない'},
        {value: '1', name: '登録'},
        {value: '0', name: '未登録'}
      ]
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
    if(nextProps.dataPrefecture != this.props.dataPrefecture) {
      this.state.dataPrefecture = nextProps.dataPrefecture;
    }
    if(nextProps.goBack == true) {
      this.state.name = nextProps.dataSearch.name ? nextProps.dataSearch.name : '';
      this.state.email = nextProps.dataSearch.email ? nextProps.dataSearch.email : '';
      this.state.tel = nextProps.dataSearch.tel ? nextProps.dataSearch.tel : '';
      this.state.name_kana = nextProps.dataSearch.name_kana ? nextProps.dataSearch.name_kana : '';
      this.state.address = nextProps.dataSearch.address ? nextProps.dataSearch.address : '';
      this.state.prefecture = nextProps.dataSearch.prefecture ? nextProps.dataSearch.prefecture : '';
      this.state.mailmag = nextProps.dataSearch.mailmag ? nextProps.dataSearch.mailmag : '';
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
      name_kana: this.state.name_kana ? this.state.name_kana : '',
      address: this.state.address ? this.state.address : '',
      prefecture: this.state.prefecture ? this.state.prefecture : '',
      mailmag: this.state.mailmag ? this.state.mailmag : '',
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
                <Input className='col-xs-4 mb15' label='会員名' type='text' maxLength='255' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <Input className='col-xs-4 mb15' label='会員名 カナ' type='text' maxLength='255' name='name_kana' value={this.state.name_kana} onChange={this.onChange.bind(this, 'name_kana')}/>
                <Input className='col-xs-4 mb15' label='電話番号' type='text' maxLength='255' name='tel' value={this.state.tel} onChange={this.onChange.bind(this, 'tel')}/>
              </div>
              <div className='col-xs-12'>
                <Input className='col-xs-4 mb15' label='メールアドレス' type='text' maxLength='255' name='email' value={this.state.email} onChange={this.onChange.bind(this, 'email')}/>
                <DropDown className='col-xs-4 mb15' label='都道府県' placeholder='都道府県' showPlaceholder={true} name='prefecture' value={this.state.prefecture} onChange={this.onChange.bind(this, 'prefecture')} options={this.state.dataPrefecture} keyName='key' valueName='value'/>
                <Input className='col-xs-4 mb15' label='住所' type='text' maxLength='255' name='address' value={this.state.address} onChange={this.onChange.bind(this, 'address')}/>
              </div>
              <div className='col-xs-12'>
                <GroupRadio className='col-xs-12 mb15' label='メルマガ登録' name='mailmag' value={this.state.mailmag} onChange={this.onChange.bind(this, 'mailmag')} data={this.state.dataRadio} keyName='value' valueName='name'/>
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
    dataPrefecture: state.systemData.prefectures
  }
}

export default connect(bindStateToProps)(Search)

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
import {Customer} from 'api';

class List extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageData: {
        number: 0,
        size: 50,
        totalElements: 0
      },
      data: [],
      dataSearch: {},
      sort: 'id',
      firstName: '',
      lastName: '',
      dataSort: [
        {key: 'id', value: '会員ID'},
        {key: 'name', value: '会員名'},
        {key: 'email', value: 'メールアドレス'},
        {key: 'tel', value: '電話番号'}
      ],
      header: [
        { name: '会員ID', width: 170 },
        { name: '会員名', width: 170 },
        { name: 'メールアドレス', width: 200 },
        { name: '電話番号', width: 200 },
        { name: '子供情報', minWidth: 250 },
        { name: '前回予約', width: 170 },
        { name: '直近予約', width: 170 },
        { name: '操作', width: 110, minWidth: 110 }
      ],
      modalIsOpen: false,
      deleteLoading: false,
      loading: false,
      search: false
    }
  }

  componentDidMount() {
    this.getListData();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.goBack == true) {
      this.state.dataSearch = nextProps.dataSearch;
      this.setState({...this.state})
    }
  }

  getListData() {
    this.state.loading = true;
    this.setState({...this.state});
    let dataSearch = {};
    let params = {};
    if(this.props.goBack == true) {
      dataSearch = this.props.dataSearch
    } else {
      dataSearch = this.state.dataSearch
    }
    if(this.props.goBack == true) {
      params.page = this.props.pageData + 1
    } else {
      params.page = this.state.pageData.number + 1
    }
    if (dataSearch && dataSearch.name) {
      params.name = dataSearch.name
    }
    if (dataSearch && dataSearch.email) {
      params.email = dataSearch.email
    }
    if (dataSearch && dataSearch.tel) {
      params.tel = dataSearch.tel
    }
    if (dataSearch && dataSearch.name_kana) {
      params.name_kana = dataSearch.name_kana
    }
    if (dataSearch && dataSearch.prefecture) {
      params.prefecture = dataSearch.prefecture
    }
    if (dataSearch && dataSearch.address) {
      params.address = dataSearch.address
    }
    if (dataSearch && dataSearch.mailmag != 'null') {
      params.mailmag = dataSearch.mailmag
    }
    if (dataSearch && dataSearch.sort) {
      params.sort = dataSearch.sort
    } else {
      params.sort = 'id'
    }
    params.includes = ["booking_nearest"];
    Customer.actions.list.request(params).then(res => {
      if(res && res.data) {
        let Data = res.data.data.customers;
        this.state.data = Data.data;
        this.state.pageData.number = Data.current_page - 1;
        this.state.pageData.size = Data.per_page;
        this.state.pageData.totalElements = Data.total;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_CUSTOMER_LIST', customers: Data.data});
        this.props.dispatch({type: 'CUSTOMER_RESET_GO_BACK'});
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_CUSTOMER_LIST', customers: []});
        this.props.dispatch({type: 'CUSTOMER_RESET_GO_BACK'});
      }
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.props.dispatch({type: 'CUSTOMER_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    let Search = {...this.state.dataSearch, ...dataSearch};
    this.state.dataSearch = Search;
    this.props.dispatch({type: 'UPDATE_CUSTOMER_SEARCH', dataSearch: Search});
    this.props.dispatch({type: 'UPDATE_CUSTOMER_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_CUSTOMER_PAGE', pageData: page.selected});
    this.getListData();
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  openModal(id, lastName, firstName) {
    this.state.deleteId = id;
    this.state.lastName = lastName;
    this.state.firstName = firstName;
    this.state.modalIsOpen = true;
    this.setState({
      ...this.state
    })
  }

  checkLastItem() {
    let total = this.state.pageData.totalElements;
    let limit = this.state.pageData.size;
    let number = this.state.pageData.number;
    if(number == 0) {
      return false
    } else if ((total - (number*limit)) == 1){
      return true
    } else {
      return false
    }
  }

  deleteItem() {
    this.state.deleteLoading = true;
    this.setState({...this.state});
    let data = [...this.state.data];
    let dataFilter = data.filter(state => {
      return state.id == this.state.deleteId
    })
    Customer.actions.delete.request({id: this.state.deleteId}).then(res => {
      Toastr(`${this.state.lastName} ${this.state.firstName} ${msg.deleteCustomer}`, 'success');

      if(this.checkLastItem()) {
        this.state.pageData.number = this.state.pageData.number - 1;
        this.props.dispatch({type: 'UPDATE_CUSTUMER_PAGE', pageData: this.state.pageData.number});
      }
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

  downloadCSV() {
    let token = cookie.load('accessToken');
    let URL = String(API_URL) + "/faqs/download-csv?token=" + token + '&limit=0';
    let dataSearch = {...this.state.dataSearch};
    if (dataSearch && dataSearch.text) {
      URL = URL + "&text=" + dataSearch.text;
    }
    if (dataSearch && dataSearch.category_id) {
      URL = URL + "&category_id=" + dataSearch.category_id;
    }
    let fileName = "my-csv.csv";
    this.saveData(URL, fileName);
  }

  saveData(url, fileName) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.target = '_blank';
    a.download = fileName;
    a.click();
  };

  onChange(e) {
    let Search = {...this.state.dataSearch, sort: e.target.value};
    this.state.dataSearch = Search;
    this.state.sort = e.target.value;
    this.setState({...this.state});
    this.props.dispatch({type: 'UPDATE_CUSTOMER_SEARCH', dataSearch: Search});
    this.getListData();
  }

  render() {
    let Element = document.getElementById('content-list-manager');
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>会員情報 <small>一覧</small></h2>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading}/>
        <Datatable
          title={`検索結果 ${this.state.pageData.totalElements}件`}
          header={this.state.header}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          dataList={this.state.data}
          loading={this.state.loading}
          numberColumnHeader={8}
          sort={this.state.sort}
          hasSort={true}
          dataSort={this.state.dataSort}
          keyName='key'
          valueName='value'
          onChange={this.onChange.bind(this)}
        >
          <ListItem deleteItem={this.openModal.bind(this)}/>
        </Datatable>
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
            <p className='p-14'>{this.state.lastName}&nbsp;{this.state.firstName}&nbsp;{msg.confirmDeleteCustomer}</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.deleteItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' disabled={this.state.deleteLoading ? true : false} onClick={this.closeModal.bind(this)}>閉じる</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

List.defaultProps = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function bindStateToProps(state) {
  return {
    data: state.listCustomer.data,
    dataSearch: state.listCustomer.dataSearch,
    goBack: state.listCustomer.goBack,
    pageData: state.listCustomer.pageData
  }
}

export default connect(bindStateToProps)(withRouter(List))
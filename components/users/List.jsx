import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {msg} from "constants/message";
import {Users} from 'api';
import {Toastr} from 'components/modules/toastr';
import cookie from 'react-cookie';
import { API_URL } from 'constants/config';

class List extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pageData: {
        number: 0,
        size: 50,
        totalElements: 0
      },
      messageDelete: '',
      data: [],
      dataSearch: [],
      modalIsOpen: false,
      deleteLoading: false,
      loading: false,
      search: false,
    }
  }

  componentDidMount() {
    this.getListData();
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
    if (dataSearch && dataSearch.authorities) {
      params.authorities = dataSearch.authorities
    }
    if (dataSearch && dataSearch.studios) {
      params.studios = dataSearch.studios
    }

    Users.actions.list.request(params).then(res => {
      if(res && res.data) {
        this.state.data = res.data.data.users.data;
        this.state.pageData.number = res.data.data.users.current_page - 1;
        this.state.pageData.size = res.data.data.users.per_page;
        this.state.pageData.totalElements = res.data.data.users.total;
        this.state.loading = false;
        this.props.dispatch({type: 'UPDATE_USER_LIST', users: res.data.data.users.data});
        this.props.dispatch({type: 'USER_RESET_GO_BACK'});
        this.setState({
          ...this.state
        })
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.props.dispatch({type: 'UPDATE_USER_LIST', users: []});
        this.props.dispatch({type: 'USER_RESET_GO_BACK'});
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
      this.state.loading = false;
      this.setState({...this.state});
      this.props.dispatch({type: 'USER_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    this.state.dataSearch = dataSearch;
    this.props.dispatch({type: 'UPDATE_USER_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'UPDATE_USER_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_USER_PAGE', pageData: page.selected});
    this.getListData();
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  openModal(id) {
    let data = [...this.state.data];
    let dataFilter = data.filter(state => {
      return state.id == id
    })
    if (dataFilter.length > 0) {
      this.state.messageDelete = dataFilter[0].email + 'を削除します。宜しいですか？';
    } else {
      this.state.messageDelete = '管理者を削除します。宜しいですか？';
    }
    this.state.deleteId = id;
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
    Users.actions.deleteUser.request({id: this.state.deleteId}).then(res => {
      Toastr(msg.deleteUser, 'success');
      if(this.checkLastItem()) {
        this.state.pageData.number = this.state.pageData.number - 1;
        this.props.dispatch({type: 'UPDATE_USER_PAGE', pageData: this.state.pageData.number});
      }
      this.closeModal();
      this.getListData();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.closeModal()
    })
  }

  downloadCSV() {
    let token = cookie.load('accessToken');
    let URL = String(API_URL) + "/admin/users/download-csv?token=" + token + '&limit=0';
    let dataSearch = {...this.state.dataSearch};
    if (dataSearch && dataSearch.name) {
      URL = URL + "&name=" + dataSearch.name;
    }
    if (dataSearch && dataSearch.email) {
      URL = URL + "&email=" + dataSearch.email;
    }
    if (dataSearch && dataSearch.authorities && dataSearch.authorities.length) {
      dataSearch.authorities.map((item, index) => {
        URL = URL + "&authorities["+index+"]=" + item;
      })
    }
    if (dataSearch && dataSearch.studios && dataSearch.studios.length) {
      dataSearch.studios.map((item, index) => {
        URL = URL + "&studios["+index+"]=" + item;
      })
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

  closeModal() {
    this.state.deleteId = '';
    this.state.modalIsOpen = false;
    this.state.deleteLoading = false;
    this.setState({
      ...this.state
    })
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>管理者情報 <small>一覧</small></h2>
          <Link className='btn-addnew' to='/users/create'>新規登録</Link>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading}/>
        <Datatable
          title={`検索結果 ${this.state.pageData.totalElements}件`}
          header={header.Manager}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          dataList={this.state.data}
          loading={this.state.loading}
          download={true}
          downloadCSV={this.downloadCSV.bind(this)}
          numberColumnHeader ={6}
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
            <p className='p-14'>{this.state.messageDelete}</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.deleteItem.bind(this)}>OK</button>
              <button className='btn-close-confirm' onClick={this.closeModal.bind(this)}>閉じる</button>
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
    data: state.listUsers.data,
    dataSearch: state.listUsers.dataSearch,
    goBack: state.listUsers.goBack,
    pageData: state.listUsers.pageData
  }
}

export default connect(bindStateToProps)(List)
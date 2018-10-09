import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {msg} from "constants/message";
import {News} from 'api';
import cookie from 'react-cookie';
import {Toastr} from 'components/modules/toastr';
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
      dataSearch: {},
      modalIsOpen: false,
      deleteLoading: false,
      loading: false,
      search: false,
      dataSort: [
        {key: 'ID', value: 'ID'},
        {key: 'OPEN', value: '公開開始日時'},
        {key: 'CLOSE', value: '公開終了日時'},
        {key: 'STATUS', value: 'ステータス'}
      ],
      sort: 'ID',
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
    if (dataSearch && dataSearch.open_time_from) {
      params.open_time_from = dataSearch.open_time_from
    }
    if (dataSearch && dataSearch.open_time_to) {
      params.open_time_to = dataSearch.open_time_to
    }
    if (dataSearch && dataSearch.close_time_from) {
      params.close_time_from = dataSearch.close_time_from
    }
    if (dataSearch && dataSearch.close_time_to) {
      params.close_time_to = dataSearch.close_time_to
    }
    if (dataSearch && dataSearch.status) {
      params.status = dataSearch.status
    }
    if (dataSearch && dataSearch.free_word) {
      params.free_word = dataSearch.free_word
    }
    if (dataSearch && dataSearch.sort) {
      params.sort = dataSearch.sort
    } else {
      params.sort = 'ID'
    }

    News.actions.list.request(params).then(res => {
      if(res && res.data) {
        this.state.data = res.data.data.news.data;
        this.state.pageData.number = res.data.data.news.current_page - 1;
        this.state.pageData.size = res.data.data.news.per_page;
        this.state.pageData.totalElements = res.data.data.news.total;
        this.state.loading = false;
        this.props.dispatch({type: 'UPDATE_NEWS_LIST', news: res.data.data.news.data});
        this.props.dispatch({type: 'NEWS_RESET_GO_BACK'});
        this.setState({
          ...this.state
        })
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.props.dispatch({type: 'UPDATE_NEWS_LIST', news: []});
        this.props.dispatch({type: 'NEWS_RESET_GO_BACK'});
        this.setState({
          ...this.state
        })
      }
    }).catch(err => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(msg.fail, 'error');
      this.props.dispatch({type: 'NEWS_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    this.state.dataSearch = dataSearch;
    this.props.dispatch({type: 'UPDATE_NEWS_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'UPDATE_NEWS_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_NEWS_PAGE', pageData: page.selected});
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
      this.state.messageDelete = dataFilter[0].title + ' ' + 'を削除します。宜しいですか？';
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
    News.actions.deleteNews.request({id: this.state.deleteId}).then(res => {
      Toastr(msg.deleteNews, 'success');
      if(this.checkLastItem()) {
        this.state.pageData.number = this.state.pageData.number - 1;
        this.props.dispatch({type: 'UPDATE_NEWS_PAGE', pageData: this.state.pageData.number});
      }
      this.closeModal();
      this.getListData();
    }).catch(err => {
      if(err.response) {
        Toastr(err.response.data.message, 'error');
        this.closeModal()
      }
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
  onChange(name, e) {
    this.state[name] = e.target.value;
    this.state.dataSearch.sort = e.target.value;
    this.setState({...this.state});
    this.getListData();
  }

  downloadCSV() {
    let token = cookie.load('accessToken');
    let URL = String( API_URL) + "/news/download-csv?token=" + token + '&limit=0';
    let dataSearch = {...this.state.dataSearch};
    if (dataSearch && dataSearch.open_time_from) {
      URL = URL + "&open_time_from=" + dataSearch.open_time_from;
    }
    if (dataSearch && dataSearch.open_time_to) {
      URL = URL + "&open_time_to=" + dataSearch.open_time_to;
    }
    if (dataSearch && dataSearch.close_time_from) {
      URL = URL + "&close_time_from=" + dataSearch.close_time_from;
    }
    if (dataSearch && dataSearch.close_time_to) {
      URL = URL + "&close_time_to=" + dataSearch.close_time_to;
    }
    if (dataSearch && dataSearch.status) {
      URL = URL + "&status=" + dataSearch.status;
    }
    if (dataSearch && dataSearch.free_word) {
      URL = URL + "&free_word=" + dataSearch.free_word;
    }
    if (dataSearch && dataSearch.sort) {
      URL = URL + "&sort=" + dataSearch.sort;
    } else {
      URL = URL + "&sort=ID"
    }

    let fileName = "my-csv.csv";
    this.saveData(URL, fileName);

    console.log(URL);
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

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>ニュース情報 <small>一覧</small></h2>
          <Link className='btn-addnew' to='/news/create'>新規登録</Link>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading}/>
        <Datatable
          title={`検索結果 ${this.state.pageData.totalElements}件`}
          header={header.News}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          dataList={this.state.data}
          loading={this.state.loading}
          download={true}
          downloadCSV={this.downloadCSV.bind(this)}
          numberColumnHeader ={7}
          onChange={this.onChange.bind(this, 'sort')}
          dataSort={this.state.dataSort}
          sort={this.state.sort}
          hasSort={true}
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
    data: state.listNews.data,
    dataSearch: state.listNews.dataSearch,
    goBack: state.listNews.goBack,
    pageData: state.listNews.pageData
  }
}

export default connect(bindStateToProps)(List)
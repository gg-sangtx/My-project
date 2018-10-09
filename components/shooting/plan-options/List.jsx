import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { PlanOptions } from 'api';
import {msg} from "constants/message";
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
      data: [],
      dataSort: [
        {
          key: "ID",
          value: 'ID'
        },
        {
          key: "CODE",
          value: '撮影オプションコード'
        },
        {
          key: "PRICE",
          value: '単位金額'
        }
      ],
      dataSearch: {},
      messageDelete: '',
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
    if (dataSearch && dataSearch.price_from) {
      params.price_from = dataSearch.price_from
    }
    if (dataSearch && dataSearch.price_to) {
      params.price_to = dataSearch.price_to
    }
    if (dataSearch && dataSearch.sort) {
      params.sort_value = dataSearch.sort
    } else {
      URL = URL + "&sort_value=ID"
    }

    PlanOptions.actions.listPlanOptions.request(params).then(res => {
      if(res && res.data) {
        this.state.data = res.data.data.planOptions.data;
        this.state.pageData.number = res.data.data.planOptions.current_page - 1;
        this.state.pageData.size = res.data.data.planOptions.per_page;
        this.state.pageData.totalElements = res.data.data.planOptions.total;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_PLANOPTIONS_LIST', planOptions: res.data.data.planOptions.data});
        this.props.dispatch({type: 'STUDIO_RESET_GO_BACK'});
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_PLANOPTIONS_LIST', planOptions: []});
        this.props.dispatch({type: 'STUDIO_RESET_GO_BACK'});
      }
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.props.dispatch({type: 'STUDIO_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    this.state.dataSearch = dataSearch;
    this.props.dispatch({type: 'UPDATE_PLANOPTIONS_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'UPDATE_PLANOPTIONS_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  downloadCSV() {
    let token = cookie.load('accessToken');
    let URL = String(API_URL) + "/plan-options/download-csv?token=" + token + '&limit=0';
    let dataSearch = {...this.state.dataSearch};
    if (dataSearch && dataSearch.name) {
      URL = URL + "&name=" + dataSearch.name;
    }
    if (dataSearch && dataSearch.price_from) {
      URL = URL + "&price_from=" + dataSearch.price_from;
    }
    if (dataSearch && dataSearch.price_from) {
      URL = URL + "&price_to=" + dataSearch.price_to;
    }
    if (dataSearch && dataSearch.sort) {
      URL = URL + "&sort_value=" + dataSearch.sort;
    } else {
      URL = URL + "&sort_value=ID"
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

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_PLANOPTIONS_PAGE', pageData: page.selected});
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
      this.state.messageDelete = dataFilter[0].name + ' ' + msg.planOptionsConfirmDetele;
    }
    this.state.deleteId = id;
    this.state.modalIsOpen = true;
    this.setState({
      ...this.state
    })
  }

  deleteItem() {
    this.state.deleteLoading = true;
    this.setState({...this.state});
    let data = [...this.state.data];
    let dataFilter = data.filter(state => {
      return state.id == this.state.deleteId
    })
    PlanOptions.actions.deletePlanOptions.request({id: this.state.deleteId}).then(res => {
      if(this.checkLastItem()) {
        this.state.pageData.number = this.state.pageData.number - 1;
        this.props.dispatch({type: 'UPDATE_PLANOPTIONS_PAGE', pageData: this.state.pageData.number});
      }
      Toastr(dataFilter[0].name + msg.deletPlans, 'success');
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

  onChange(e) {
    let Search = {...this.state.dataSearch, sort: e.target.value};
    this.state.dataSearch = Search;
    this.state.sort = e.target.value;
    this.setState({...this.state});
    this.props.dispatch({type: 'UPDATE_PlANOPTIONS_SEARCH', dataSearch: Search});
    this.getListData();
  }

  closeModal() {
    this.state.deleteId = '';
    this.state.modalIsOpen = false;
    this.state.deleteLoading = false;
    this.setState({
      ...this.state
    })
  }

  render() {
    let Element = document.getElementById('content-list-manager');
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>撮影オプション情報 <small>一覧</small></h2>
          <Link className='btn-addnew' to='/planOptions/create'>新規登録</Link>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading}/>
        <Datatable
          title={`検索条件 ${this.state.pageData.totalElements}件`}
          header={header.PlanOptions}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          dataList={this.state.data}
          loading={this.state.loading}
          numberColumnHeader ={5}
          download={true}
          downloadCSV={this.downloadCSV.bind(this)}
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
            <p className='p-14'>{this.state.messageDelete}</p>
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
    data: state.listPlanOptions.data,
    dataSearch: state.listPlanOptions.dataSearch,
    goBack: state.listPlanOptions.goBack,
    pageData: state.listPlanOptions.pageData
  }
}

export default connect(bindStateToProps)(List)

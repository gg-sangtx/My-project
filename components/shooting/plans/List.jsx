import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { Plans } from 'api';
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
          value: '撮影費用コード'
        },
        {
          key: "WEEKDAY_PRICE",
          value: '平日価格'
        },
        {
          key: "HOLIDAY_PRICE",
          value: '休日価格'
        }
      ],
      dataSearch: {},
      messageDelete: '',
      modalIsOpen: false,
      deleteLoading: false,
      loading: false,
      search: false
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
    if (dataSearch && dataSearch.code) {
      params.code = dataSearch.code
    }
    if (dataSearch && dataSearch.weekday_price_from) {
      params.weekday_price_from = dataSearch.weekday_price_from
    }
    if (dataSearch && dataSearch.weekday_price_to) {
      params.weekday_price_to = dataSearch.weekday_price_to
    }
    if (dataSearch && dataSearch.holiday_price_from) {
      params.holiday_price_from = dataSearch.holiday_price_from
    }
    if (dataSearch && dataSearch.holiday_price_to) {
      params.holiday_price_to = dataSearch.holiday_price_to
    }
    if (dataSearch && dataSearch.sort) {
      params.sort_value = dataSearch.sort
    } else {
      URL = URL + "&sort_value=ID"
    }

    Plans.actions.listPlans.request(params).then(res => {
      if(res && res.data) {
        this.state.data = res.data.data.plans.data;
        this.state.pageData.number = res.data.data.plans.current_page - 1;
        this.state.pageData.size = res.data.data.plans.per_page;
        this.state.pageData.totalElements = res.data.data.plans.total;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_PLANS_LIST', plans: res.data.data.plans.data});
        this.props.dispatch({type: 'PLANS_RESET_GO_BACK'});
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_PLANS_LIST', plans: []});
        this.props.dispatch({type: 'PLANS_RESET_GO_BACK'});
      }
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.props.dispatch({type: 'PLANS_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    this.state.dataSearch = dataSearch;
    this.props.dispatch({type: 'UPDATE_PLANS_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'UPDATE_PLANS_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_PLANS_PAGE', pageData: page.selected});
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
      this.state.messageDelete = dataFilter[0].name + ' ' + msg.plansConfirmDetele;
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
    Plans.actions.deletePlans.request({id: this.state.deleteId}).then(res => {
      if(this.checkLastItem()) {
        this.state.pageData.number = this.state.pageData.number - 1;
        this.props.dispatch({type: 'UPDATE_PLANS_PAGE', pageData: this.state.pageData.number});
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

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    let Search = {...this.state.dataSearch, ...dataSearch};
    this.state.dataSearch = Search;
    this.props.dispatch({type: 'UPDATE_PLANS_SEARCH', dataSearch: Search});
    this.props.dispatch({type: 'UPDATE_PLANS_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  downloadCSV() {
    let token = cookie.load('accessToken');
    let URL = String(API_URL) + "/plans/download-csv?token=" + token + '&limit=0';
    let dataSearch = {...this.state.dataSearch};
    if (dataSearch && dataSearch.name) {
      URL = URL + "&name=" + dataSearch.name;
    }
    if (dataSearch && dataSearch.code) {
      URL = URL + "&code=" + dataSearch.code;
    }
    if (dataSearch && dataSearch.weekday_price_from) {
      URL = URL + "&weekday_price_from=" + dataSearch.weekday_price_from;
    }
    if (dataSearch && dataSearch.weekday_price_to) {
      URL = URL + "&weekday_price_to=" + dataSearch.weekday_price_to;
    }
    if (dataSearch && dataSearch.holiday_price_from) {
      URL = URL + "&holiday_price_from=" + dataSearch.holiday_price_from;
    }
    if (dataSearch && dataSearch.holiday_price_to) {
      URL = URL + "&holiday_price_to=" + dataSearch.holiday_price_to;
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

  componentWillReceiveProps(nextProps) {
    if(nextProps.goBack == true) {
      this.state.dataSearch = nextProps.dataSearch;
      this.state.sort = nextProps.dataSearch.sort || '';
      this.setState({...this.state})
    }
  }

  onChange(e) {
    let Search = {...this.state.dataSearch, sort: e.target.value};
    this.state.dataSearch = Search;
    this.state.sort = e.target.value;
    this.setState({...this.state});
    this.props.dispatch({type: 'UPDATE_PLANS_SEARCH', dataSearch: Search});
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
          <h2 className='heading-2'>撮影費用情報 <small>一覧</small></h2>
          <Link className='btn-addnew' to='/plans/create'>新規登録</Link>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading} />
        <Datatable
          title={`検索条件 ${this.state.pageData.totalElements}件`}
          header={header.Plans}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          dataList={this.state.data}
          loading={this.state.loading}
          numberColumnHeader ={6}
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
    data: state.listPlans.data,
    dataSearch: state.listPlans.dataSearch,
    goBack: state.listPlans.goBack,
    pageData: state.listPlans.pageData
  }
}

export default connect(bindStateToProps)(List)

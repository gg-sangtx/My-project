import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import ListItemDay from './ListItemDay.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { StaffPays } from 'api';
import {ShowIf} from 'components/utils';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import { withRouter } from 'react-router';
import moment from 'moment';

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
      dataSort: [{key: 'MONTHLY', value: '月別'}, {key: "DAILY", value: '日別'}],
      dataSelected: [],
      headerMonth: [
        {name: '', minWidth: 45, width: 45},
        {name: '日付', minWidth: 130},
        {name: 'カメラマン／ヘアメイクID', minWidth: 112, width: 112, maxWidth: 112},
        {name: 'カメラマン／ヘアメイク名', minWidth: 112, width: 112, maxWidth: 112},
        {name: '時給・日給', minWidth: 110, width: 110},
        {name: '出勤時間', minWidth: 85, width: 85},
        {name: '合計金額', minWidth: 130},
        {name: '確定処理', width: 90, minWidth: 90},
        {name: '報酬明細書', width: 90, minWidth: 90},
        {name: '請求書', width: 90, minWidth: 90}
      ],
      headerDate: [
        {name: '日付', width: 220},
        {name: 'カメラマン／ヘアメイクID'},
        {name: 'カメラマン／ヘアメイク名'},
        {name: '時給・日給'},
        {name: '出勤時間'},
        {name: '合計金額'},
        {name: '操作', width: 110, minWidth: 110}
      ],
      dataSearch: {},
      sort: this.props.sort || 'MONTHLY',
      messageDelete: '',
      modalIsOpen: false,
      deleteLoading: false,
      loading: false,
      search: false,
      modalConfirmIsOpen: false
    }
  }

  componentDidMount() {
    this.getListData();
    if (this.props.goBack == true) {
      this.state.dataSearch = this.props.dataSearch;
      this.state.sort = this.props.dataSearch.sort;
      this.setState({...this.state})
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.goBack == true) {
      this.state.dataSearch = nextProps.dataSearch;
      this.state.sort = nextProps.dataSearch.sort;
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
    if (dataSearch && dataSearch.staff_id) {
      params.staff_id = dataSearch.staff_id
    }
    if (dataSearch && dataSearch.staff_name) {
      params.staff_name = dataSearch.staff_name
    }
    if (dataSearch && dataSearch.staff_name_kana) {
      params.staff_name_kana = dataSearch.staff_name_kana
    }
    if (dataSearch && dataSearch.date) {
      params.month = moment(dataSearch.date).format('MM');
      params.year = moment(dataSearch.date).format('YYYY');
    }
    if (dataSearch && dataSearch.admin_confirms && dataSearch.admin_confirms.length > 0) {
      params.admin_confirms = dataSearch.admin_confirms
    }
    if (dataSearch && dataSearch.sort) {
      params.type_list = dataSearch.sort
    } else {
      params.type_list = 'MONTHLY'
    }
    StaffPays.actions.list.request(params).then(res => {
      if(res && res.data) {
        let Data = res.data.data.staff_pays;
        this.state.data = Data.data;
        this.state.pageData.number = Data.current_page - 1;
        this.state.pageData.size = Data.per_page;
        this.state.pageData.totalElements = Data.total;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_STAFF_PAY_LIST', staff: Data.data});
        this.props.dispatch({type: 'STAFF_PAY_RESET_GO_BACK'});
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_STAFF_PAY_LIST', staff: []});
        this.props.dispatch({type: 'STAFF_PAY_RESET_GO_BACK'});
      }
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.props.dispatch({type: 'STAFF_PAY_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    let Search = {...this.state.dataSearch, ...dataSearch};
    this.state.dataSearch = Search;
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_SEARCH', dataSearch: Search});
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_PAGE', pageData: page.selected});
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
      this.state.messageDelete = msg.confirmDeleteStaffPays;
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
    let data = [...this.state.data];
    let dataFilter = data.filter(state => {
      return state.id == this.state.deleteId
    })
    StaffPays.actions.delete.request({id: this.state.deleteId}).then(res => {
      Toastr(msg.deleteStaffPays, 'success');
      if(this.checkLastItem()) {
        this.state.pageData.number = this.state.pageData.number - 1;
        this.props.dispatch({type: 'UPDATE_STAFF_PAY_PAGE', pageData: this.state.pageData.number});
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

  openModalConfirm() {
    if(this.state.dataSelected.length > 0) {
      this.state.modalConfirmIsOpen = true;
      this.setState({
        ...this.state
      })
    }
  }

  closeConfirmModal() {
    this.state.modalConfirmIsOpen = false;
    this.state.loadingConfirm = false;
    this.setState({
      ...this.state
    })
  }

  onChange(e) {
    let Search = {...this.state.dataSearch, sort: e.target.value};
    this.state.dataSearch = Search;
    this.state.pageData.number = 0;
    this.state.dataSelected = [];
    this.state.sort = e.target.value;
    this.setState({...this.state});
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_SEARCH', dataSearch: Search});
    this.getListData();
  }

  onItemCheck(item) {
    let index = this.state.dataSelected.findIndex(itemX => itemX.staff_id == item.staff_id && itemX.month == item.month && itemX.year == item.year)
    if( index != -1) {
      this.state.dataSelected.splice(index, 1);
    } else {
      let newItem = {
        staff_id: item.staff_id,
        month: item.month,
        year: item.year
      }
      this.state.dataSelected.push(newItem);
    }
    this.setState({...this.state})
  }

  itemComfirm(count) {
    let item = this.state.data[count - 1];
    let index = this.state.dataSelected.findIndex(itemX => itemX.staff_id == item.staff_id && itemX.month == item.month && itemX.year == item.year)
    if( index != -1) {
      this.state.dataSelected.splice(index, 1);
    }
    this.state.data[count - 1].admin_confirm = true;
    this.setState({...this.state})
  }

  confirmAll() {
    this.state.loadingConfirm = true;
    this.setState({...this.state})
    let params = {
      staff_pays: [...this.state.dataSelected]
    }
    StaffPays.actions.confirm.request('', params).then(res => {
      Toastr(msg.confirmAllStaffPays, 'success')
      this.state.dataSelected = [];
      this.state.loadingConfirm = false;
      this.setState({...this.state})
      this.closeConfirmModal();
      this.getListData();
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.loadingConfirm = false;
      this.setState({...this.state});
      this.closeConfirmModal();
    })
  }

  render() {
    let Element = document.getElementById('content-list-manager');
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>カメラマン／ヘアメイク報酬情報 <small>一覧</small></h2>
        </div>
        <Search search={this.search.bind(this)} sort={this.state.sort} loading={this.state.loading}/>
        <ShowIf condition={this.state.sort != 'DAILY'}>
          <Datatable
            title={`検索結果 ${this.state.pageData.totalElements}件`}
            header={this.state.headerMonth}
            pageData={this.state.pageData}
            handlePageClick = {this.handlePageClick.bind(this)}
            dataList={this.state.data}
            loading={this.state.loading}
            numberColumnHeader ={10}
            dataSort={this.state.dataSort}
            keyName='key'
            valueName='value'
            sort={this.state.sort}
            hasSort={true}
            showLabelSort={false}
            onChange={this.onChange.bind(this)}
          >
            <ListItem itemComfirm={this.itemComfirm.bind(this)} deleteItem={this.openModal.bind(this)} onItemCheck={this.onItemCheck.bind(this)} dataSelected={this.state.dataSelected}/>
          </Datatable>
        </ShowIf>
        <ShowIf condition={this.state.sort == 'DAILY'}>
          <Datatable
            title={`検索結果 ${this.state.pageData.totalElements}件`}
            header={this.state.headerDate}
            pageData={this.state.pageData}
            handlePageClick = {this.handlePageClick.bind(this)}
            dataList={this.state.data}
            loading={this.state.loading}
            numberColumnHeader ={7}
            dataSort={this.state.dataSort}
            keyName='key'
            valueName='value'
            sort={this.state.sort}
            hasSort={true}
            showLabelSort={false}
            onChange={this.onChange.bind(this)}
          >
            <ListItemDay deleteItem={this.openModal.bind(this)}/>
          </Datatable>
        </ShowIf>
        <ShowIf condition={this.state.dataSelected.length > 0}>
          <div className='col-xs-12 pt15 text-center'>
            <button className='btn-confirm mr20 has-loading' disabled={this.state.loadingConfirm} onClick={this.openModalConfirm.bind(this)}>一括確定</button>
          </div>
        </ShowIf>
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
        <Modal
          isOpen={this.state.modalConfirmIsOpen}
          onRequestClose={this.closeConfirmModal.bind(this)}
          className="model-confirm-delete"
        >
          <div className='title-block'>
            <h3 className='heading-3'>確認</h3>
            <button className='btn-close' onClick={this.closeConfirmModal.bind(this)}></button>
          </div>
          <div className='wrap-content-modal'>
            <p className='p-14'>{msg.messageConfirmAllStaffPays}</p>
            <div className='wrap-button'>
              <button className='btn-confirm has-loading' disabled={this.state.loadingConfirm ? true : false} onClick={this.confirmAll.bind(this)}>OK</button>
              <button className='btn-close-confirm' disabled={this.state.loadingConfirm ? true : false} onClick={this.closeConfirmModal.bind(this)}>閉じる</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

List.defaultProps = {
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function bindStateToProps(state) {
  return {
    dataSearch: state.staffPays.dataSearch,
    goBack: state.staffPays.goBack,
    pageData: state.staffPays.pageData
  }
}

export default connect(bindStateToProps)(withRouter(List))
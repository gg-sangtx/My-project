import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {msg} from "constants/message";
import {Order} from 'api';
import cookie from 'react-cookie';
import {Toastr} from 'components/modules/toastr';

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
        {key: 'BOOKING_ID', value: '予約情報ID'},
        {key: 'ORDER_DATE', value: '受注日'},
        {key: 'STATUS', value: '受注ステータス'},
        {key: 'LATEST_SEND_DATE', value: '発送日'}
      ],
      sort: 'BOOKING_ID',
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
    if (dataSearch && dataSearch.sort) {
      params.sort_field = dataSearch.sort
    } else {
      params.sort_field = 'BOOKING_ID'
    }

    if (dataSearch && dataSearch.status) {
      params.status = dataSearch.status
    }
    if (dataSearch && dataSearch.product_code) {
      params.product_code = dataSearch.product_code
    }
    if (dataSearch && dataSearch.product_name) {
      params.product_name = dataSearch.product_name
    }
    if (dataSearch && dataSearch.customer_id) {
      params.customer_id = dataSearch.customer_id
    }
    if (dataSearch && dataSearch.customer_name) {
      params.customer_name = dataSearch.customer_name
    }
    if (dataSearch && dataSearch.customer_email) {
      params.customer_email = dataSearch.customer_email
    }
    if (dataSearch && dataSearch.customer_tel) {
      params.customer_tel = dataSearch.customer_tel
    }
    if (dataSearch && dataSearch.booking_code) {
      params.booking_code = dataSearch.booking_code
    }
    if (dataSearch && dataSearch.order_status_id) {
      params.order_status_id = dataSearch.order_status_id
    }
    if (dataSearch && dataSearch.order_date_from) {
      params.order_date_from = dataSearch.order_date_from
    }
    if (dataSearch && dataSearch.order_date_to) {
      params.order_date_to = dataSearch.order_date_to
    }
    if (dataSearch && dataSearch.delivery_date_from) {
      params.delivery_date_from = dataSearch.delivery_date_from
    }
    if (dataSearch && dataSearch.delivery_date_to) {
      params.delivery_date_to = dataSearch.delivery_date_to
    }
    if (dataSearch && dataSearch.send_date_from) {
      params.send_date_from = dataSearch.send_date_from
    }
    if (dataSearch && dataSearch.send_date_to) {
      params.send_date_to = dataSearch.send_date_to
    }

    params.sort_type = 'ASC';

    Order.actions.list.request(params).then(res => {
      if(res && res.data) {
        let Data = res.data.data.orders;
        this.state.data = Data.data;
        this.state.pageData.number = Data.current_page - 1;
        this.state.pageData.size = Data.per_page;
        this.state.pageData.totalElements = Data.total;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_ORDER_LIST', orders: Data.data});
        this.props.dispatch({type: 'ORDER_RESET_GO_BACK'});
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_ORDER_LIST', orders: []});
        this.props.dispatch({type: 'ORDER_RESET_GO_BACK'});
      }
    }).catch(err => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(msg.fail, 'error');
      this.props.dispatch({type: 'ORDER_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    this.state.dataSearch = dataSearch;
    this.props.dispatch({type: 'UPDATE_ORDER_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'UPDATE_ORDER_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_ORDER_PAGE', pageData: page.selected});
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
      this.state.messageDelete = dataFilter[0].order_number + ' ' + msg.messageConfirmCancelOrder;
    } else {
      this.state.messageDelete = msg.messageConfirmCancelOrder;
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

  cancelItem() {
    this.state.deleteLoading = true;
    this.setState({...this.state});
    let data = [...this.state.data];
    let dataFilter = data.filter(state => {
      return state.id == this.state.deleteId
    })
    Order.actions.cancel.request('',{id: this.state.deleteId}).then(res => {
      Toastr(dataFilter[0].order_number + ' ' + msg.cancelOrderSuccess, 'success');
      if(this.checkLastItem()) {
        this.state.pageData.number = this.state.pageData.number - 1;
        this.props.dispatch({type: 'UPDATE_ORDER_PAGE', pageData: this.state.pageData.number});
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

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>受注情報 <small>一覧</small></h2>
          <Link className='btn-addnew' to='/orders/create'>新規登録</Link>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading}/>
        <Datatable
          title={`検索結果 ${this.state.pageData.totalElements}件`}
          header={header.Order}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          dataList={this.state.data}
          loading={this.state.loading}
          numberColumnHeader ={10}
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
              <button className='btn-confirm has-loading' disabled={this.state.deleteLoading ? true : false} onClick={this.cancelItem.bind(this)}>OK</button>
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
    data: state.order.data,
    dataSearch: state.order.dataSearch,
    goBack: state.order.goBack,
    pageData: state.order.pageData
  }
}

export default connect(bindStateToProps)(List)
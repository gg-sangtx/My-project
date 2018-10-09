import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import ListItem from './ListItem.jsx';
import ListItemDay from './ListItemDay.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { StaffPayForStaff } from 'api';
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
      dataSort: [{key: 'ASC', value: '日付昇順'},{key: 'DESC', value: '日付降順'}],
      dataSelected: [],
      headerMonth: [
        {name: '日付', minWidth: 200},
        {name: '金額', minWidth: 200},
        {name: '確定処理', width: 170, minWidth: 170},
        {name: '報酬明細書', width: 170, minWidth: 170},
        {name: '操作', width: 110, minWidth: 110}
      ],
      headerDate: [
        {name: '日付', width: 220},
        {name: '時給・日給'},
        {name: '出勤時間'},
        {name: '合計金額'},
        {name: '操作', width: 110, minWidth: 110}
      ],
      sort_field: 'DATE',
      sort_type: 'ASC',
      dataSearch: {},
      type_list: this.props.type_list || 'MONTHLY',
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
      this.state.type_list = this.props.dataSearch.type_list || 'MONTHLY';
      this.state.sort_type = this.props.dataSearch.sort_type || 'ASC';
      this.setState({...this.state})
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.goBack == true) {
      this.state.dataSearch = nextProps.dataSearch;
      this.state.type_list = nextProps.dataSearch.type_list || 'MONTHLY';
      this.state.sort_type = nextProps.dataSearch.sort_type || 'ASC';
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
    if(dataSearch.type_list && dataSearch.type_list == 'DAILY') {
      params.page = 1
    } else {
      if(this.props.goBack == true) {
        params.page = this.props.pageData + 1
      } else {
        params.page = this.state.pageData.number + 1
      }
    }

    if (dataSearch && dataSearch.type_list) {
      params.type_list = dataSearch.type_list
    } else {
      params.type_list = 'MONTHLY'
    }

    if (dataSearch && dataSearch.month) {
      params.month = dataSearch.month
    }

    if (dataSearch && dataSearch.year) {
      params.year = dataSearch.year
    }

    if (dataSearch && dataSearch.sort_type) {
      params.sort_type = dataSearch.sort_type
    } else {
      params.sort_type = 'ASC';
      this.state.dataSearch.sort_type = 'ASC';
    }

    params.sort_field = 'DATE';

    StaffPayForStaff.actions.list.request(params).then(res => {
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
        this.props.dispatch({type: 'UPDATE_STAFF_PAY_FOR_STAFF_LIST', staffPays: Data.data});
        this.props.dispatch({type: 'STAFF_PAY_FOR_STAFF_RESET_GO_BACK'});
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.setState({
          ...this.state
        })
        this.props.dispatch({type: 'UPDATE_STAFF_PAY_FOR_STAFF_LIST', staffPays: []});
        this.props.dispatch({type: 'STAFF_PAY_FOR_STAFF_RESET_GO_BACK'});
      }
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.props.dispatch({type: 'STAFF_PAY_FOR_STAFF_RESET_GO_BACK'});
    })
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_FOR_STAFF_PAGE', pageData: page.selected});
    this.getListData();
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    let Search = {...this.state.dataSearch, sort_type: e.target.value};
    this.state.dataSearch = Search;
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_FOR_STAFF_SEARCH', dataSearch: Search});
    this.state.sort_type = e.target.value;
    this.setState({...this.state});
    this.getListData();
  }

  onItemCheck(index) {
    this.state.data[index].staff_confirm = true;
    this.setState({...this.state});
  }

  viewDaily(month, year) {
    this.state.dataSearch.month = month;
    this.state.dataSearch.year = year;
    this.state.dataSearch.type_list = 'DAILY';
    this.state.type_list = 'DAILY';
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_FOR_STAFF_SEARCH', dataSearch: this.state.dataSearch});
    this.setState({...this.state});
    this.getListData();
  }

  goBack() {
    this.state.dataSearch.month = '';
    this.state.dataSearch.year = '';
    this.state.dataSearch.type_list = 'MONTHLY';
    this.state.type_list = 'MONTHLY';
    this.state.pageData.number = this.props.pageData;
    this.props.dispatch({type: 'UPDATE_STAFF_PAY_FOR_STAFF_SEARCH', dataSearch: this.state.dataSearch});
    this.setState({...this.state});
    this.getListData();
  }

  render() {
    let Element = document.getElementById('content-list-manager');
    return (
      <div id='content-list-manager'>
        <div className='title-block mb10'>
          <h2 className='heading-2 mb20'>報酬情報 <small>一覧</small></h2>
        </div>
        <ShowIf condition={this.state.type_list != 'DAILY'}>
          <Datatable
            title={`検索結果 ${this.state.pageData.totalElements}件`}
            header={this.state.headerMonth}
            pageData={this.state.pageData}
            handlePageClick = {this.handlePageClick.bind(this)}
            dataList={this.state.data}
            loading={this.state.loading}
            numberColumnHeader={5}
            dataSort={this.state.dataSort}
            keyName='key'
            valueName='value'
            sort={this.state.sort_type}
            hasSort={true}
            onChange={this.onChange.bind(this, 'sort_type')}
          >
            <ListItem viewDaily={this.viewDaily.bind(this)} onItemCheck={this.onItemCheck.bind(this)}/>
          </Datatable>
        </ShowIf>
        <ShowIf condition={this.state.type_list == 'DAILY'}>
          <div className='wrap-daily'>
            <button className='btn-confirm' onClick={this.goBack.bind(this)}>月別に戻る</button>
            <Datatable
              title={`検索結果 ${this.state.pageData.totalElements}件`}
              header={this.state.headerDate}
              pageData={this.state.pageData}
              handlePageClick = {this.handlePageClick.bind(this)}
              dataList={this.state.data}
              loading={this.state.loading}
              numberColumnHeader={5}
              keyName='key'
              valueName='value'
            >
              <ListItemDay/>
            </Datatable>
          </div>
        </ShowIf>

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
    dataSearch: state.staffPayForStaff.dataSearch,
    goBack: state.staffPayForStaff.goBack,
    pageData: state.staffPayForStaff.pageData
  }
}

export default connect(bindStateToProps)(withRouter(List))
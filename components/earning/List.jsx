import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import {DropDown} from 'components/inputform';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import { Earning } from 'api';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import { withRouter } from 'react-router';
import cookie from 'react-cookie';
import moment from 'moment';
import { API_URL } from 'constants/config';
import Chart from './Chart.jsx';
import {getPrice} from 'constants/money';

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
        {key: '1', value: 'スタジオ名'},
        {key: '2', value: '月昇順'},
        {key: '3', value: '月降順'},
        {key: '4', value: '売上昇順'},
        {key: '5', value: '売上降順'}],
      dataSortDaily: [
        {key: '1', value: 'スタジオ名'},
        {key: '2', value: '日付昇順'},
        {key: '3', value: '日付降順'},
        {key: '4', value: '売上昇順'},
        {key: '5', value: '売上降順'}],
      dataSearch: {
        dataShow: ['is_has_booking', 'is_has_order'],
        date_from: moment().add(-1, 'months').add(1, 'days').format('YYYY-MM'),
        date_to: moment().format('YYYY-MM'),
      },
      dataView: [
        {id: 'MONTHLY', name: '月別表示'},
        {id: 'DAILY', name: '日別表示'}
      ],
      sort: '2',
      sort_field: 'DATE',
      type_view: 'DAILY',
      sort_type: 'ASC',
      loading: false,
      search: false,
      initData: true,
      total_earnings: 0,
      headerMonthly: [
        { name: '月', width: 120 },
        { name: 'スタジオ名', minWidth: 190 },
        { name: '予約金額', width: 190 },
        { name: '物販商品金額', width: 190 },
        { name: '合計金額', width: 190 }
      ],
      headerDaily: [
        { name: '日付', width: 120 },
        { name: 'スタジオ名', minWidth: 190 },
        { name: '予約金額', width: 190 },
        { name: '物販商品金額', width: 190 },
        { name: '合計金額', width: 190 }
      ],
      dataChart: []
    }
  }

  componentDidMount() {
    this.getListData('defautl');
    this.getDataChart();
  }

  getDataChart() {
    let dataSearch = this.state.dataSearch;
    let params = {
      type_list: this.state.type_view
    }
    if (this.state.type_view == 'MONTHLY') {
      if (this.state.initData) {
        params.year_month_from = moment().add(-1, 'years').add(1, 'months').format('YYYY-MM');
        params.year_month_to = moment().format('YYYY-MM');
      } else {
        if (!dataSearch.date_from && !dataSearch.date_to) {
          params.year_month_from = moment().add(-1, 'years').add(1, 'months').format('YYYY-MM');
          params.year_month_to = moment().format('YYYY-MM');
        } else if (dataSearch.date_from && !dataSearch.date_to) {
          params.year_month_from = moment(dataSearch.date_from).format('YYYY-MM');
          params.year_month_to = moment(dataSearch.date_from).add(1, 'years').add(-1, 'months').format('YYYY-MM');
        } else if (!dataSearch.date_from && dataSearch.date_to) {
          params.year_month_from = moment(dataSearch.date_to).add(-1, 'years').add(1, 'months').format('YYYY-MM')
          params.year_month_to = moment(dataSearch.date_to).format('YYYY-MM')
        } else {
          params.year_month_from = moment(dataSearch.date_from).format('YYYY-MM');
          params.year_month_to = moment(dataSearch.date_to).format('YYYY-MM');
        }
      }
    } else {
      if (this.state.initData) {
        params.date_from = moment().format('YYYY-MM') + '-01';
        params.date_to = moment(params.date_from).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD');
      } else {
        if (!dataSearch.date_from && !dataSearch.date_to) {
          params.date_from = moment().format('YYYY-MM') + "-01";
          params.date_to = moment(moment(params.date_from).add(1, 'months').add(-1, 'days')).format('YYYY-MM-DD');
        } else if (dataSearch.date_from && !dataSearch.date_to) {
          params.date_from = moment(dataSearch.date_from).format('YYYY-MM-DD');
          params.date_to = moment(dataSearch.date_from).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD');
        } else if (!dataSearch.date_from && dataSearch.date_to) {
          params.date_from = moment(dataSearch.date_to).add(-1, 'months').add(1, 'days').format('YYYY-MM-DD')
          params.date_to = moment(dataSearch.date_to).format('YYYY-MM-DD')
        } else {
          params.date_from = moment(dataSearch.date_from).format('YYYY-MM-DD');
          params.date_to = moment(dataSearch.date_to).format('YYYY-MM-DD');
        }
      }
    }
    if (dataSearch && dataSearch.dataShow.length > 0 && dataSearch.dataShow.indexOf('is_has_booking') != -1) {
      params.is_has_booking = 1
    } else {
      params.is_has_booking = 0
    }

    if (dataSearch && dataSearch.dataShow.length > 0 && dataSearch.dataShow.indexOf('is_has_order') != -1) {
      params.is_has_order = 1
    } else {
      params.is_has_order = 0
    }

    Earning.actions.chart.request(params).then(res => {
      if(res.data) {
        let dataResult = [];
        let Data = res.data.data.earnings;
        Data.map(item => {
          let newItem = {};
          if(this.state.type_view == 'MONTHLY') {
            newItem.name = item.year + '年' + item.month + '月';
          } else {
            newItem.name = item.date ? moment(item.date).format('YYYY年MM月DD日') : '';
          }
          newItem.合計金額 = item.earnings;
          newItem.予約金額 = item.booking_total_price;
          newItem.物販商品金額 = item.order_total_price;
          dataResult.push(newItem);
        })
        this.state.dataChart = dataResult;
        this.setState({...this.state});
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
    })
  }

  getListData() {
    this.state.loading = true;
    this.setState({...this.state});
    let dataSearch = this.state.dataSearch;
    let params = {
      page: this.state.pageData.number + 1
    };
    if (dataSearch && dataSearch.plan_code) {
      params.plan_code = dataSearch.plan_code
    }
    if (dataSearch && dataSearch.studio_code) {
      params.studio_code = dataSearch.studio_code
    }
    if (dataSearch && dataSearch.product_code) {
      params.product_code = dataSearch.product_code
    }
    if (dataSearch && dataSearch.product_id) {
      params.product_id = dataSearch.product_id
    }
    if (dataSearch && dataSearch.plan_ids) {
      params.plan_ids = dataSearch.plan_ids
    }
    if (dataSearch && dataSearch.studio_ids) {
      params.studio_ids = dataSearch.studio_ids
    }
    if (this.state.type_view == 'MONTHLY') {
      if (this.state.initData) {
        params.year_month_from = moment().add(-1, 'years').add(1, 'months').format('YYYY-MM');
        params.year_month_to = moment().format('YYYY-MM');
      } else {
        if (dataSearch && dataSearch.date_from) {
          params.year_month_from = moment(dataSearch.date_from).format('YYYY-MM')
        }
        if (dataSearch && dataSearch.date_to) {
          params.year_month_to = moment(dataSearch.date_to).format('YYYY-MM')
        }
      }
    } else {
      if (this.state.initData) {
        params.date_from = moment().format('YYYY-MM') + '-01';
        params.date_to = moment(params.date_from).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD');
      } else {
        if (dataSearch && dataSearch.date_from) {
          params.date_from = moment(dataSearch.date_from).format('YYYY-MM-DD')
        }
        if (dataSearch && dataSearch.date_to) {
          params.date_to = moment(dataSearch.date_to).format('YYYY-MM-DD')
        }
      }
    }
    if (dataSearch && dataSearch.sort_field) {
      params.sort_field = dataSearch.sort_field
    } else {
      params.sort_field = 'STUDIO_NAME'
    }
    if (dataSearch && dataSearch.sort_type) {
      params.sort_type = dataSearch.sort_type
    } else {
      params.sort_type = 'ASC'
    }
    if (this.state.type_view) {
      params.type_list = this.state.type_view
    } else {
      params.type_list = 'MONTHLY'
    }

    if (dataSearch && dataSearch.dataShow.length > 0 && dataSearch.dataShow.indexOf('is_has_booking') != -1) {
      params.is_has_booking = 1
    } else {
      params.is_has_booking = 0
    }

    if (dataSearch && dataSearch.dataShow.length > 0 && dataSearch.dataShow.indexOf('is_has_order') != -1) {
      params.is_has_order = 1
    } else {
      params.is_has_order = 0
    }


    Earning.actions.list.request(params).then(res => {
      if(res && res.data) {
        let Data = res.data.data.earnings;
        this.state.data = Data.data;
        this.state.pageData.number = Data.current_page - 1;
        this.state.pageData.size = Data.per_page;
        this.state.pageData.totalElements = Data.total;
        this.state.loading = false;
        this.state.total_earnings = res.data.data.total_earnings
        this.setState({
          ...this.state
        })
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.state.total_earnings = 0;
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
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    this.state.initData = false;
    let Search = {...this.state.dataSearch, ...dataSearch};
    this.state.dataSearch = Search;
    this.setState({
      ...this.state
    })
    this.getListData();
    this.getDataChart();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.getListData();
  }

  onChange(e) {
    let Search = {...this.state.dataSearch};
    let value = e.target.value;
    if (value == '1') {
      Search.sort_field = 'STUDIO_NAME';
      Search.sort_type = 'ASC';
    } else if (value == '2') {
      Search.sort_field = this.state.type_view == 'MONTHLY' ? 'YEAR_MONTH_TIME' : 'DATE';
      Search.sort_type = 'ASC';
    } else if (value == '3') {
      Search.sort_field = this.state.type_view == 'MONTHLY' ? 'YEAR_MONTH_TIME' : 'DATE';
      Search.sort_type = 'DESC';
    } else if (value == '4') {
      Search.sort_field = 'EARNINGS';
      Search.sort_type = 'ASC';
    } else {
      Search.sort_field = 'EARNINGS';
      Search.sort_type = 'DESC';
    }
    this.state.dataSearch = Search;
    this.state.sort = e.target.value;
    this.setState({...this.state});
    this.getListData();
  }

  onChangeLayout(e) {
    let dataSearch = this.state.dataSearch;
    this.state.type_view = e.target.value;
    if(e.target.value == 'DAILY' && dataSearch.date_from && dataSearch.date_to && (new Date(moment(dataSearch.date_from).add(1, 'months')).getTime() < new Date(moment(dataSearch.date_to)).getTime())) {
      dataSearch.date_to = moment(dataSearch.date_from).add(1, 'months');
      this.state.dataSearch = dataSearch;
    }
    this.setState({...this.state});
    this.getListData();
    this.getDataChart();
  }

  render() {
    let Element = document.getElementById('content-list-manager');
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>売上情報 <small>一覧</small></h2>
          <DropDown className='col-xs-3' label='' options={this.state.dataView} keyName='id' valueName='name' name='type_view' value={this.state.type_view} onChange={this.onChangeLayout.bind(this)}/>
        </div>
        <Search search={this.search.bind(this)} type_view={this.state.type_view} loading={this.state.loading}/>
        <ShowIf condition={this.state.dataChart.length > 0}>
          <div className='mt15 mb15'>
            <Chart data={this.state.dataChart}/>
          </div>
        </ShowIf>
        <Datatable
          title={`検索結果 ${this.state.pageData.totalElements}件`}
          smallTitle={`合計金額 ¥${getPrice(this.state.total_earnings)}`}
          header={this.state.type_view != 'MONTHLY' ? this.state.headerDaily : this.state.headerMonthly}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          dataList={this.state.data}
          loading={this.state.loading}
          numberColumnHeader ={5}
          dataSort={this.state.type_view == 'MONTHLY' ? this.state.dataSort : this.state.dataSortDaily}
          keyName='key'
          valueName='value'
          sort={this.state.sort}
          hasSort={true}
          onChange={this.onChange.bind(this)}
        >
          <ListItem type_view={this.state.type_view}/>
        </Datatable>
      </div>
    );
  }
}


export default List;
import React, { Component } from 'react';
import {Datatable} from 'components/datatable';
import header from 'constants/header';
import Search from './Search.jsx';
import ListItem from './ListItem.jsx';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import {msg} from "constants/message";
import {Costumes} from 'api';
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
    if (dataSearch && dataSearch.costume_code) {
      params.costume_code = dataSearch.costume_code
    }
    if (dataSearch && dataSearch.type) {
      params.type = dataSearch.type
    }
    if (dataSearch && dataSearch.studio_code) {
      params.studio_code = dataSearch.studio_code
    }
    if (dataSearch && dataSearch.studios_can_work) {
      params.studios_can_work = dataSearch.studios_can_work
    }

    Costumes.actions.list.request(params).then(res => {

      if(res && res.data) {
        this.state.data = res.data.data.costumes.data;
        this.state.pageData.number = res.data.data.costumes.current_page - 1;
        this.state.pageData.size = res.data.data.costumes.per_page;
        this.state.pageData.totalElements = res.data.data.costumes.total;
        this.state.loading = false;
        this.props.dispatch({type: 'UPDATE_COSTUME_LIST', costumes: res.data.data.costumes.data});
        this.props.dispatch({type: 'COSTUME_RESET_GO_BACK'});
        this.setState({
          ...this.state
        })
      } else {
        this.state.data = [];
        this.state.pageData.number = 1;
        this.state.pageData.size = 50;
        this.state.pageData.totalElements = 0;
        this.state.loading = false;
        this.props.dispatch({type: 'UPDATE_COSTUME_LIST', costumes: []});
        this.props.dispatch({type: 'COSTUME_RESET_GO_BACK'});
        this.setState({
          ...this.state
        })
      }
    }).catch(err => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(msg.fail, 'error');
      this.props.dispatch({type: 'COSTUME_RESET_GO_BACK'});
    })
  }

  search(dataSearch) {
    this.state.pageData.number = 0;
    this.state.pageData.size = 50;
    this.state.pageData.totalElements = 0;
    this.state.dataSearch = dataSearch;
    this.props.dispatch({type: 'UPDATE_COSTUME_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'UPDATE_COSTUME_PAGE', pageData: 0});
    this.setState({
      ...this.state
    })
    this.getListData();
  }

  handlePageClick(page) {
    this.state.pageData.number = page.selected;
    this.props.dispatch({type: 'UPDATE_COSTUME_PAGE', pageData: page.selected});
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
      this.state.messageDelete = dataFilter[0].name + ' ' + 'を削除します。宜しいですか？';
    } else {
      this.state.messageDelete = '管理者を削除します。宜しいですか？';
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
    Costumes.actions.deleteCostume.request({id: this.state.deleteId}).then(res => {
      Toastr(msg.deleteCostume, 'success');
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
  downloadCSV() {
    let token = cookie.load('accessToken');
    let URL = String( API_URL) + "/costumes/download-csv?token=" + token + '&limit=0';
    let dataSearch = {...this.state.dataSearch};
    if (dataSearch && dataSearch.costume_code) {
      URL = URL + "&costume_code=" + dataSearch.costume_code;
    }
    if (dataSearch && dataSearch.name) {
      URL = URL + "&name=" + dataSearch.name;
    }
    if (dataSearch && dataSearch.studio_code && dataSearch.studio_code.length > 0) {
      URL = URL + "&studio_code=" + dataSearch.studio_code;
    }
    if (dataSearch && dataSearch.type && dataSearch.type.length) {
      URL = URL + "&type=" + dataSearch.type;
    }
    if (dataSearch && dataSearch.sex && dataSearch.sex.length) {
      URL = URL + "&sex=" + dataSearch.sex;
    }
    if (dataSearch && dataSearch.studios_can_work && dataSearch.studios_can_work.length > 0) {
      dataSearch.studios_can_work.map((item, index) => {
        URL = URL + "&studios_can_work["+index+"]=" + item;
      })
    }
    let fileName = "my-csv.csv";
    this.saveData(URL, fileName);
  }

  saveData(url, fileName) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.target = '_blank';
    a.href = url;
    a.download = fileName;
    a.click();
  };

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>衣装情報 <small>一覧</small></h2>
          <Link className='btn-addnew' to='/costumes/create'>新規登録</Link>
        </div>
        <Search search={this.search.bind(this)} loading={this.state.loading}/>
        <Datatable
          title={`検索結果 ${this.state.pageData.totalElements}件`}
          header={header.Costume}
          pageData={this.state.pageData}
          handlePageClick = {this.handlePageClick.bind(this)}
          download={true}
          dataList={this.state.data}
          loading={this.state.loading}
          numberColumnHeader ={9}
          downloadCSV={this.downloadCSV.bind(this)}
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
    data: state.listCostumes.data,
    dataSearch: state.listCostumes.dataSearch,
    goBack: state.listCostumes.goBack,
    pageData: state.listCostumes.pageData
  }
}

export default connect(bindStateToProps)(List)

import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, GroupRadio, DropDown} from 'components/inputform';
import {connect} from 'react-redux';
import {Costumes} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      codeCostume: '',
      name: '',
      style: '',
      studio_code: '',
      studios_can_work: '',
      dataStyle: [
        {value: 1, name: '洋装'},
        {value: 2, name: '和装'}
      ],
      dataStudio: this.props.studioCanWork
    }
  }

  ComponentDidMount() {
    this.getdataCostumes();
  }

  getdataCostumes() {
    Costumes.actions.listCostume.request().then(res => {
      if(res.data) {
        this.state.dataCostume= res.data.data.costumes.data;
      } else {
        this.state.dataCostume = []
      }
      this.setState({...this.state});
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

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  Collapse() {
    this.state.isOpen = !this.state.isOpen;
    this.setState({
      ...this.state
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.loading == false) {
      this.state.search = false;
    }
    if(nextProps.studioCanWork != this.props.studioCanWork) {
      this.state.dataStudio = nextProps.studioCanWork;
    }
    if(nextProps.goBack == true) {
      this.state.codeCostume = nextProps.dataSearch.codeCostume;
      this.state.name = nextProps.dataSearch.name;
      this.state.style = nextProps.dataSearch.style;
      this.state.studio_code = nextProps.dataSearch.studio_code ? nextProps.dataSearch.studio_code : [];
      this.state.studios_can_work = nextProps.dataSearch.studios_can_work ? nextProps.dataSearch.studios_can_work : [];
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      costume_code: this.state.codeCostume ? this.state.codeCostume : '',
      name: this.state.name ? this.state.name : '',
      type: this.state.style ? this.state.style : '',
      studios_can_work: this.state.studios_can_work ? this.state.studios_can_work : [],
      studio_code: this.state.studio_code ? this.state.studio_code : [],
    }
    this.props.search(data);
    return;
  }

  render() {
    return (
      <div className='search-container'>
        <div className='title-collapse'>
          <h3 className='heading-3 bold'>検索条件</h3>
          <button className={`btn-collapse ${this.state.isOpen ? 'collaped' : ''}`} onClick={this.Collapse.bind(this)}></button>
        </div>
        <Collapse isOpened={this.state.isOpen}>
          <div className='wrap-collapse-content'>
            <form className='search-form'>
              <div className='col-xs-12 pb15'>
                <Input className='col-xs-6 mb15' label='衣装コード' type='text' maxLength='40' name='Code' value={this.state.codeCostume} onChange={this.onChange.bind(this, 'codeCostume')}/>
                <Input className='col-xs-6 mb15' label='衣装名' type='text' maxLength='40' name='Name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <DropDown className=' col-xs-6 mb15' label='タイプ' options={this.state.dataStyle} showPlaceholder={true} placeholder='選択なし' keyName='value' valueName='name' value={this.state.style} onChange={this.onChange.bind(this, 'style')}/>
                <div className = 'col-xs-6 pb15'>
                  <Input className='' label='スタジオコード' type='text' maxLength='40' name='CodeStudio' value={this.state.studio_code} onChange={this.onChange.bind(this, 'studio_code')}/>
                </div>
              </div>
              <div className = 'col-xs-12 pb15'>
                <div className='col-xs-12 pb15 '>
                  <GroupCheckBox name='authorities' label='スタジオ' data={this.state.dataStudio} value={this.state.studios_can_work} onChange={this.onChange.bind(this, 'studios_can_work')} keyName='id' valueName='name'/>
                </div>
              </div>
              <div className='wrap-button'>
                <button className={`btn-submit-form${this.state.search == true ? ' has-loading' : ''}`} disabled={this.props.loading ? true : false} onClick={this.search.bind(this)}>検索する</button>
              </div>
            </form>
          </div>
        </Collapse>
      </div>
    );
  }
}

Search.defaultProps = {
  dataSearch: {},
  goBack: false,
  studioCanWork: [],
}

function bindStateToProps(state) {
  return {
    dataSearch: state.listUsers.dataSearch,
    goBack: state.listUsers.goBack,
    studioCanWork: state.systemData.studioCanWork,
  }
}

export default connect(bindStateToProps)(Search)

import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, DropDown, GroupCheckBox} from 'components/inputform';
import {connect} from 'react-redux';
import {option} from "constants/option";

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      name: '',
      code: '',
      studios_can_work: '',
      dataStudio: this.props.studioCanWork,
      type: '',
      status: '',
      typeOptions: option.couponsType ? option.couponsType : [],
      statusOptions: option.couponsStatus ? option.couponsStatus : []
    }
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
      this.state.code = nextProps.dataSearch.code;
      this.state.name = nextProps.dataSearch.name;
      this.state.status = nextProps.dataSearch.status;
      this.state.type = nextProps.dataSearch.type;
      this.state.studios_can_work = nextProps.dataSearch.studios_can_work ? nextProps.dataSearch.studios_can_work : [];
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      code: this.state.code ? this.state.code : '',
      name: this.state.name ? this.state.name : '',
      status: this.state.status ? this.state.status : '',
      type: this.state.type ? this.state.type : '',
      studio_id: this.state.studios_can_work ? this.state.studios_can_work : []
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
              <div className='col-xs-12'>
                <Input className='col-xs-12 col-sm-6 col-md-4 mb15' label='クーポンコード' type='text' maxLength='255' name='code' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
                <Input className='col-xs-12 col-sm-6 col-md-4 mb15' label='クーポン名' type='text' maxLength='255' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <DropDown className='col-xs-12 col-sm-6 col-md-4 mb15' label='ステータス' showPlaceholder={true} placeholder='選択なし' options={this.state.statusOptions} keyName='key' valueName='name' value={this.state.status} onChange={this.onChange.bind(this, 'status')}/>
                <DropDown className='col-xs-12 col-sm-6 col-md-4 mb15' label='種類' showPlaceholder={true} placeholder='選択なし' options={this.state.typeOptions} keyName='key' valueName='name' value={this.state.type} onChange={this.onChange.bind(this, 'type')}/>
              </div>
              <div className="col-xs-12 wrap-list-check-box">
                <GroupCheckBox name='type' label='スタジオ' data={this.state.dataStudio} name='studios_can_work' value={this.state.studios_can_work} onChange={this.onChange.bind(this, 'studios_can_work')} keyName='id' valueName='name'/>
              </div>
              <div className='wrap-button text-center mt10 mb15 col-xs-12 no-gutter'>
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
  studioCanWork: [],
  dataSearch: {},
  goBack: false,
}

function bindStateToProps(state) {
  return {
    studioCanWork: state.systemData.studioCanWork
  }
}

export default connect(bindStateToProps)(Search)

import React, { Component } from 'react';
import {Collapse} from 'react-collapse';
import {Input, GroupCheckBox, GroupRadio} from 'components/inputform';
import {connect} from 'react-redux';
import {Users} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: true,
      search: false,
      name: '',
      email: '',
      authorities: [],
      studios: [],
      dataRole: this.props.dataRole || [],
      dataStudio: []
    }
  }

  componentDidMount() {
    this.getdataStudio();
  }

  getdataStudio() {
    Users.actions.listStudio.request().then(res => {
      if(res.data) {
        this.state.dataStudio= res.data.data.studios.data;
      } else {
        this.state.dataStudio = []
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
    if(this.props.dataRole != nextProps.dataRole) {
      this.state.dataRole = nextProps.dataRole;
    }
    if(nextProps.goBack == true) {
      this.state.name = nextProps.dataSearch.name || '';
      this.state.email = nextProps.dataSearch.email || '';
      this.state.authorities = nextProps.dataSearch.authorities || [];
      this.state.studios = nextProps.dataSearch.studios || [];
    }
    this.setState({...this.state});
  }

  search(e) {
    e.preventDefault();
    this.state.search = true;
    this.setState({...this.state});
    let data = {
      email: this.state.email ? this.state.email : '',
      name: this.state.name ? this.state.name : '',
      authorities: this.state.authorities ? this.state.authorities : [],
      studios: this.state.studios ? this.state.studios : []
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
                <Input className='col-xs-6' label='名前' type='text' maxLength='40' name='Name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
                <Input className='col-xs-6' label='メールアドレス' type='email' maxLength='40' name='Email' value={this.state.email} onChange={this.onChange.bind(this, 'email')}/>
              </div>
              <div className='wrap-list-check-box'>
                <GroupCheckBox name='authorities' label='権限' data={this.state.dataRole} value={this.state.authorities} onChange={this.onChange.bind(this, 'authorities')} keyName='key' valueName='value'/>
              </div>
              <div className='wrap-list-check-box'>
                <GroupCheckBox name='studios' label='スタジオ' data={this.state.dataStudio} value={this.state.studios} onChange={this.onChange.bind(this, 'studios')} keyName='id' valueName='name'/>
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
  dataRole: []
}

function bindStateToProps(state) {
  return {
    dataSearch: state.listUsers.dataSearch,
    goBack: state.listUsers.goBack,
    dataRole: state.systemData.authorities
  }
}

export default connect(bindStateToProps)(Search)
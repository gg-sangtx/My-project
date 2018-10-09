import React, { Component } from 'react';
import {Input, DropDown, GroupCheckBox} from 'components/inputform';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import {Users} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      email: '',
      authority: '1',
      studios: [],
      loading: false,
      resetLoading: false,
      dataOption: this.props.dataOption || [],
      dataCheckbox: []
    }
  }

  componentDidMount() {
    if(this.props.params && this.props.params.id) {
      this.getInfo(this.props.params.id);
    }
    this.getDataCheckBox();
  }

  getDataCheckBox() {
    Users.actions.listStudio.request().then(res => {
      if(res.data) {
        this.state.dataCheckbox= res.data.data.studios.data;
      } else {
        this.state.dataCheckbox = []
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

  componentWillReceiveProps(nextProps) {
    if(this.props.dataOption != nextProps.dataOption) {
      this.state.dataOption = nextProps.dataOption;
    }
    this.setState({...this.state})
  }

  getInfo(id) {
    let dataFilter = [];
    if(this.props.listUsers.length > 0) {
      dataFilter = this.props.listUsers.filter(state => {
        return state.id == id
      })
    }
    if(dataFilter.length > 0) {
      this.state.name = dataFilter[0].name;
      this.state.email = dataFilter[0].email;
      this.state.authority = dataFilter[0].authority;
      if(dataFilter[0].studios && dataFilter[0].studios.length > 0) {
        dataFilter[0].studios.map(item => {
          this.state.studios.push(item.id)
        })
      }
      this.setState({
        ...this.state
      })
    } else {
      Users.actions.getUser.request({id: id}).then(res => {
        if(res && res.data) {
          let data = res.data.data;
          this.state.name = data.users.name;
          this.state.email = data.users.email;
          this.state.authority = data.users.authority;
          if(data.studios && data.studios.length > 0) {
            data.studios.map(item => {
              this.state.studios.push(item.id)
            })
          }
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
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  createUser(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = {
        name: this.state.name,
        email: this.state.email,
        authority: this.state.authority,
        studios: this.state.studios || []
      }
      Users.actions.createUser.request('',params).then(res => {
        Toastr(msg.createUser, 'success');
        this.props.history.push('/users');
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.state.loading = false;
        this.setState({
          ...this.state
        })
      })
    }
    return;
  }

  updateUser(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = {
        name: this.state.name,
        email: this.state.email,
        authority: this.state.authority,
        studios: this.state.studios || []
      }
      Users.actions.updateUser.request({id: this.props.params.id},params).then(res => {
        Toastr(msg.updateUser, 'success');
        this.goBack();
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
        this.state.loading = false;
        this.setState({
          ...this.state
        })
      })
    }
    return;
  }

  validateSubmitForm() {
    let pass = true;
    this.props.validators['form'].map(validator => {
      if(pass) {
        pass = validator.validate();
      } else {
        validator.validate();
      }
    })
    return pass;
  }

  componentWillUnmount() {
    this.props.validators['form'] = [];
  }

  checkAll() {
    this.checkBox.refs.wrappedComponent.checkAll();
  }

  unCheckAll() {
    this.checkBox.refs.wrappedComponent.unCheckAll();
  }

  resetPassword(e) {
    e.preventDefault();
    this.state.resetLoading = true;
    this.setState({...this.state})
    Users.actions.resetPassword.request({id: this.props.params.id}).then(res => {
      Toastr(msg.sendResetPassword, 'success');
      this.props.history.push('/users');
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.resetLoading = false;
      this.setState({...this.state})
    })
  }

  goBack() {
    this.props.dispatch({type: 'USER_GO_BACK'});
    this.props.history.push('/users');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>管理者情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>管理者情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container'>
          <form className='search-form' method='javascript:voild(0)'>
            <div className='col-sm-12'>
              <Input className='col-sm-6 mb15' label='名前' require={true} bindValidator={this} type='text' channel='form' maxLength='40' name='Name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
              <Input className='col-sm-6 mb15' label='メールアドレス' disabled={this.props.edit == true ? true : false} require={true} bindValidator={this} type='email' channel='form' maxLength='40' name='Email' value={this.state.email} onChange={this.onChange.bind(this, 'email')}/>
              <DropDown className='col-sm-6 mb15 clear-left' label='権限' placeholder='' require={true} bindValidator={this} type='text' channel='form' options={this.state.dataOption} keyName='key' valueName='value' value={this.state.authority} onChange={this.onChange.bind(this, 'authority')}/>
            </div>
            <div className='wrap-list-check-box'>
              <label className='form-label'>スタジオ</label>
              <div className='wrap-button-block mb15'>
                <span className='btn-close-confirm mr20' onClick={this.checkAll.bind(this)}>すべて選択</span>
                <span className='btn-close-confirm' onClick={this.unCheckAll.bind(this)}>すべて解除</span>
              </div>
              <GroupCheckBox label='' ref={(checkBox) => {this.checkBox = checkBox}} name='studios' data={this.state.dataCheckbox} value={this.state.studios} onChange={this.onChange.bind(this, 'studios')} keyName='id' valueName='name'/>
            </div>
            <ShowIf condition={this.props.edit == true}>
              <div className='form-group mb0'>
                <button disabled={this.state.loading} className='btn-confirm mr20 has-loading' onClick={this.updateUser.bind(this)}>保存</button>
                <button disabled={this.state.loading} className='btn-close-confirm' onClick={this.goBack.bind(this)}>キャンセル</button>
              </div>
            </ShowIf>
            <ShowIf condition={this.props.edit != true}>
              <div className='form-group mb0'>
                <button disabled={this.state.loading} className='btn-confirm mr20 has-loading' onClick={this.createUser.bind(this)}>保存</button>
                <button disabled={this.state.loading} className='btn-close-confirm' onClick={this.goBack.bind(this)}>キャンセル</button>
              </div>
            </ShowIf>
          </form>
        </div>
      </div>
    );
  }
}

Add.defaultProps={
  validators: {
    form: []
  },
  listUsers: [],
  dataOption: []
}

function bindStateToProps(state) {
  return {
    listUsers: state.listUsers.data,
    dataOption: state.systemData.authorities,
  }
}

export default connect(bindStateToProps)(withRouter(Add));
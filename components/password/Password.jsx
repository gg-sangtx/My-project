import React from 'react';
import {Input} from 'components/inputform';
import {ShowIf} from 'components/utils';
import {msg} from 'constants/message';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import {Toastr} from 'components/modules/toastr';
import {Users} from 'api';

class Password extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      password: '',
      passwordConfirm: '',
      name: '',
      email: '',
      type: '',
      message: '',
      loading: false,
      checking: true,
      hasError: false
    }
  }

  componentDidMount() {
    this.parseUrl();
  }

  parseUrl(){
    let params = queryString.parse(this.props.location.search) || null;
    this.checkUpdatePassword(params)
  }

  checkUpdatePassword(data) {
    let params = {
      verification_code: data.verification_code ? data.verification_code : null,
      email: data.email ? data.email : null,
      type: data.type ? data.type : null
    }
    Users.actions.checkUpdatePassword.request('', params).then(res => {
      this.state.checking = false;
      this.state.email = data.email;
      this.state.name = data.name;
      this.state.type = data.type;
      this.setState({...this.state});
    }).catch(err => {
      if(err.response) {
        let errors = err.response && err.response.data.errors ? err.response.data.errors : null;
        if(errors && typeof errors == String) {
          this.state.message = errors;
        } else if (errors && errors.length > 0) {
          this.state.message = errors[0];
        } else {
          this.state.message = msg.systemFail;
        }
      } else {
        this.state.message = msg.systemFail;
      }
      this.state.checking = false;
      this.state.hasError = true;
      this.setState({...this.state});
    })
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
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

  handleChangePassword(e) {
    e.preventDefault();
    if(this.state.password != '' && this.state.password.length < 8) {
      return
    } else if(this.state.password != '' && this.state.passwordConfirm != '' && this.state.password != this.state.passwordConfirm) {
      return
    } else if(this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({...this.state});
      let params = {
        email: this.state.email,
        password: this.state.password,
        type: this.state.type
      }
      Users.actions.createPassword.request('', params).then(res => {
        if(this.props.edit == true) {
          Toastr(msg.resetPassword, 'success')
        } else {
          Toastr(msg.createPassword, 'success')
        }
        this.handleRedirect()
      }).catch(err => {
        Toastr(err.message, 'error');
        this.state.loading = false;
        this.setState({...this.state});
      })
    }
  }

  componentWillUnmount() {
    this.props.validators['form'] = [];
  }

  handleRedirect() {
    this.props.history.push('/');
  }

  render() {
    return (
      <div className='password-container'>
        <h1 className='header-title'>Studio Marl Marl</h1>
        <ShowIf condition={this.state.checking == true}>
          <form className='form-password'>
            <ShowIf condition={this.props.edit == true}>
              <h2 className='heading-2 mb20'>パスワード再設定</h2>
            </ShowIf>
            <ShowIf condition={this.props.edit != true}>
              <h2 className='heading-2 mb20'>パスワード登録</h2>
            </ShowIf>
            <span className='has-loading loading pl15'></span>
          </form>
        </ShowIf>
        <ShowIf condition={this.state.checking != true && this.state.hasError == true}>
          <form className='form-password'>
            <ShowIf condition={this.props.edit == true}>
              <h2 className='heading-2 mb20'>パスワード再設定</h2>
            </ShowIf>
            <ShowIf condition={this.props.edit != true}>
              <h2 className='heading-2 mb20'>パスワード登録</h2>
            </ShowIf>
            <h2 className='p-14 mb20'>{this.state.message}</h2>
          </form>
        </ShowIf>
        <ShowIf condition={this.state.checking != true && this.state.hasError != true}>
          <form className='password-form form-password' onSubmit={this.handleChangePassword.bind(this)} >
            <ShowIf condition={this.props.edit == true}>
              <h2 className='heading-2 mb20'>パスワード再設定</h2>
            </ShowIf>
            <ShowIf condition={this.props.edit != true}>
              <h2 className='heading-2 mb20'>パスワード登録</h2>
            </ShowIf>
            <p className='p-14 mb5'>名前</p>
            <p className='p-14 mb20'>{this.state.name}</p>
            <p className='p-14 mb5'>メールアドレス</p>
            <p className='p-14 mb20'>{this.state.email}</p>
            <div className='row'>
              <Input name='password' className={`col-xs-12${this.state.password != '' && this.state.password.length < 8 ? '' : ' mb20'}`} require bindValidator={this} type='password' channel='form' label='パスワード' value={this.state.password} onChange={this.onChange.bind(this, 'password')}/>
              <ShowIf condition={this.state.password != '' && this.state.password.length < 8}>
                <span className="pt-form-helper-text col-xs-12 mb20">{msg.passwordShort}</span>
              </ShowIf>
              <Input name='password-confirm' className={`col-xs-12${this.state.password != '' && this.state.passwordConfirm != '' && this.state.password != this.state.passwordConfirm ? '' : ' mb20'}`} require bindValidator={this} type='password' channel='form' label='パスワード確認' value={this.state.passwordConfirm} onChange={this.onChange.bind(this, 'passwordConfirm')}/>
              <ShowIf condition={this.state.password != '' && this.state.passwordConfirm != '' && this.state.password != this.state.passwordConfirm}>
                <span className="pt-form-helper-text col-xs-12 mb20">{msg.passwordNotSame}</span>
              </ShowIf>
            </div>
            <button className='btn-confirm has-loading mt10' disabled={this.state.loading}>保存</button>
          </form>
        </ShowIf>
      </div>
    )
  }
}

Password.defaultProps={
  validators: {
    form: []
  }
}

export default withRouter(Password);
import React, {PropTypes} from 'react';
import { withRouter } from 'react-router';
import {LoginLayout} from 'components/layouts/login';
import {msg} from "constants/message";
import {checkEmail} from 'lib/validate';
import {Users} from 'api';
import {connect} from 'react-redux';
import {Toastr} from 'components/modules/toastr';
import {ShowIf} from 'components/utils';
import {Input} from 'components/inputform';

class ForgotPassword extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      loading: false,
      error: '',
      check: false
    }
  }

  onChange(e) {
    this.setState({
      error: '',
      email: e.target.value
    });
  }

  handleSendPassword(e) {
    e.preventDefault();
    if(this.checkEmail()) {
      this.state.loading = true
      this.setState({
        ...this.state
      });
      let params = {
        email: this.state.email
      }
      Users.actions.resetPassword.request('',params).then(res => {
        this.state.message = '登録されているメールアドレスに再設定用のメールを送信しました。';
        this.state.loading = false;
        this.state.check = true;
        this.setState({
          ...this.state
        });
      }).catch(err => {
        if(err.response) {
          let errors = err.response && err.response.data.errors ? err.response.data.errors : null;
          if(typeof errors == Array && errors.length > 0) {
            this.state.message = errors[0];
          } else if (errors) {
            this.state.message = errors;
          } else {
            this.state.message = msg.systemFail;
          }
        } else {
          this.state.message = msg.systemFail;
        }
        this.state.loading = false;
        this.state.check = true;
        this.setState({
          ...this.state
        });
      })
    }
    return;
  }

  checkEmail() {
    if(this.state.email == '') {
      this.state.error = msg.messageDefault;
      this.setState({...this.state});
      return false;
    } else if(!checkEmail(this.state.email)) {
      this.state.error = msg.wrongEmail;
      this.setState({...this.state})
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className='password-container'>
        <h1 className='header-title'>Studio Marl Marl</h1>
        <ShowIf condition={this.state.check == true}>
          <form className='form-password'>
            <h2 className='mb20'>パスワード再設定</h2>
            <h2 className='p-14 mb20'>{this.state.message}</h2>
          </form>
        </ShowIf>
        <ShowIf condition={this.state.check != true}>
          <form className={`form-password ${this.state.loading ? 'form-disable' : ''}`} onSubmit={this.handleSendPassword.bind(this)} noValidate>
            <h2 className='mb20'>パスワード再設定</h2>
            <h2 className='p-14 mb20'>登録されているメールアドレスを入力してください。</h2>
            <div className='row mb20'>
              <Input label='メールアドレス' className='col-xs-6' name='email' type='email' require={true} value={this.state.email} onChange={this.onChange.bind(this)}/>
              {
                this.state.error != '' ? (
                  <p className='pt-form-helper-text pt5 mb0 col-xs-12'>{this.state.error}</p>
                ) : null
              }
            </div>
            <div className="row pl15 pr15">
              <button disabled={this.state.loading ? true : false} type="submit" className="has-loading btn-confirm">再設定</button>
            </div>
          </form>
        </ShowIf>
      </div>
    )
  }
}

export default connect()(withRouter(ForgotPassword));

import React, {PropTypes} from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {LoginLayout} from 'components/layouts/login';
import {msg} from "constants/message";
import {checkEmail} from 'lib/validate';
import {login} from 'base/actions';
import {connect} from 'react-redux';
import {Toastr} from 'components/modules/toastr';

function ErrorText(props) {
  if (!props.errText) {
    return null;
  } else {
    return (
      <div className="pt-form-helper-text">
        <div className="pt-form-helper-text">{props.errText}</div>
      </div>
    )
  }
}

class LoginForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Username: '',
      Password: '',
      remember: false,
      loading: false,
      error: {}
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleLogin(e) {
    e.preventDefault();
    if(this.checkEmail()) {
      this.state.loading = true
      this.setState({
        ...this.state
      });

      this.props.dispatch(login(this.state.Username, this.state.Password, this.state.remember)).then(response => {
        this.state.loading = false;
        this.setState({...this.state});
        if (response.isAuthenticated) {
          Toastr(msg.loginSuccess, 'success')
          this.props.history.push(this.props.defaultPage);
        } else if (response && response.data && response.data.data) {
          let error = response.data.data.message;
          if (error) {
            Toastr(error, 'error')
          } else {
            Toastr(msg.systemFail, 'error')
          }
        } else {
          Toastr(msg.systemFail, 'error')
        }
      });
    }
    return;
  }

  checkEmail() {
    if(checkEmail(this.state.Username)) {
      return true;
    } else {
      Toastr(msg.wrongEmail, 'error');
      return false;
    }
  }

  handleCheck(e) {
    this.setState({
      remember: !this.state.remember
    });
  }

  render() {
    return (
        <form  onSubmit={this.handleLogin.bind(this)} action="javascript:void(0)" noValidate disabled>
          <div className="form-group has-feedback">
            <input type="email" className="form-control" placeholder="メールアドレス" name="Username" value={this.state.Username} onChange={this.handleChange.bind(this)} autoFocus autoComplete = "off"
                maxLength={40}/>
                <ErrorText errText={this.state.error.email}/>
            <span className="glyphicon glyphicon-envelope form-control-feedback" />
          </div>
          <div className="form-group has-feedback">
            <input type="password" className="form-control" placeholder="パスワード" name="Password" value={this.state.Password} onChange={this.handleChange.bind(this)} autoComplete = "off"
                maxLength={40}/>
            <ErrorText errText={this.state.error.password}/>
            <span className="glyphicon glyphicon-lock form-control-feedback" />
          </div>
          <div className="row">
            <div className="col-xs-8">
              <Link className='forgot-password-link' to={this.state.loading ? '#' : '/forgot-password'}>パスワードを忘れた方はこちら</Link>
            </div>
            <div className="col-xs-4">
              <button disabled={this.state.loading ? true : false} type="submit" className="has-loading btn btn-block btn-flat btn-cuedin login-text">ログイン</button>
            </div>
          </div>
        </form>
    );
  }
}

LoginForm.defaultProps = {
  defaultPage: "/"
}

export default connect()(withRouter(LoginForm));

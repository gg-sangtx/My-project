import React, {PropTypes} from 'react';
import {LoginLayout} from 'components/layouts/login';
import {LoginForm} from 'components/login';

class Login extends React.Component {
  
  render() {

    return (
      <LoginLayout>
        <LoginForm/>
      </LoginLayout>
    );
  }
}

export default Login;

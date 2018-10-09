import React, {PropTypes} from 'react';
import {StaffLoginLayout} from 'components/layouts/staff-login';
import {LoginForm} from 'components/staff-login';

class StaffLogin extends React.Component {

  render() {

    return (
      <StaffLoginLayout>
        <LoginForm/>
      </StaffLoginLayout>
    );
  }
}

export default StaffLogin;

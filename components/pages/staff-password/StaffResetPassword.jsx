import React from 'react';
import {StaffPassword} from 'components/staff-password';

class StaffResetPassword extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <StaffPassword edit={true}/>
      </div>
    )
  }
}

export default StaffResetPassword;

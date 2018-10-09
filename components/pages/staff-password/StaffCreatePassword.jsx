import React from 'react';
import {StaffPassword} from 'components/staff-password';

class StaffCreatePassword extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <StaffPassword/>
      </div>
    )
  }
}

export default StaffCreatePassword;

import React from 'react';
import {Password} from 'components/password';

class ResetPassword extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <Password edit={true}/>
      </div>
    )
  }
}

export default ResetPassword;

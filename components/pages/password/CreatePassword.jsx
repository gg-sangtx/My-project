import React from 'react';
import {Password} from 'components/password';

class CreatePassword extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <Password/>
      </div>
    )
  }
}

export default CreatePassword;

import React from 'react';
import { MainLayout } from 'components/layouts';
import {Edit} from 'components/staff-pay';

class EditStaffPay extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <MainLayout active={[5]}>
        <Edit params={this.props.match.params}/>
      </MainLayout>
    )
  }
}

export default EditStaffPay;
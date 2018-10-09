import React from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/staff-pay';

class ListStaffPay extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    )
  }
}

export default ListStaffPay;

import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/coupons';

export default class CreateCoupon extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

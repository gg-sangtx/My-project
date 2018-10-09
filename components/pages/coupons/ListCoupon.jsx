import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/coupons';

export default class ListCoupon extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}

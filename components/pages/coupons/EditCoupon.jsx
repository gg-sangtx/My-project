import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/coupons';

export default class EditCoupon extends Component {
  render() {
    return (
      <MainLayout active={[9,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

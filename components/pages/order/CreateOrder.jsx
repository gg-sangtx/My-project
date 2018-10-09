import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/order';

export default class CreateOrder extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

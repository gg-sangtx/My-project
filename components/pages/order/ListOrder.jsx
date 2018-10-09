import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/order';

export default class ListOrder extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}
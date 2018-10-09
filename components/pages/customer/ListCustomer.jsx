import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/customer';

export default class ListCustomer extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}

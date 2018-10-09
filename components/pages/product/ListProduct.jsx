import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/product';

export default class ListProduct extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}
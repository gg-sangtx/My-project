import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/earning';

export default class ListEarning extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}
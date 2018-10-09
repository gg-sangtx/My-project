import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/costume-lock';

export default class ListCostumeLocks extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}
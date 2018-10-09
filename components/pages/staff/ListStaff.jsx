import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/staff';

export default class ListStaff extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}
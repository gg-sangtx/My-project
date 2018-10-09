import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/staff-schedule';

export default class ListStaffSchedule extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}
import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { List } from 'components/staff-pay-for-staff';

export default class ListStaffPayForStaff extends Component {
  render() {
    return (
      <MainLayout isStaff={true}>
        <List/>
      </MainLayout>
    );
  }
}
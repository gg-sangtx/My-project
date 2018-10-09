import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { List } from 'components/staff-booking';

export default class ListStaffBooking extends Component {
  render() {
    return (
      <MainLayout isStaff={true}>
        <List/>
      </MainLayout>
    );
  }
}

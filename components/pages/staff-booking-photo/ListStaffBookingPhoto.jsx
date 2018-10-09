import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { List } from 'components/booking-photo';

export default class ListStaffBookingPhoto extends Component {
  render() {
    return (
      <MainLayout isBooking={true} isStaff={true} isStaffMenu={true}>
        <List params={this.props.match.params} isStaff={true}/>
      </MainLayout>
    );
  }
}

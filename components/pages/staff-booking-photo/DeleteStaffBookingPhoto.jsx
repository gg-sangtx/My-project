import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { Edit } from 'components/booking-photo';

export default class DeleteStaffBookingPhoto extends Component {
  render() {
    return (
      <MainLayout isBooking={true} isStaff={true} isStaffMenu={true}>
        <Edit params={this.props.match.params} isStaff={true}/>
      </MainLayout>
    );
  }
}

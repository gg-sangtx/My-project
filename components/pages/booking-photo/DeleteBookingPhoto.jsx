import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { Edit } from 'components/booking-photo';

export default class DeleteBookingPhoto extends Component {
  render() {
    return (
      <MainLayout isBooking={true}>
        <Edit params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

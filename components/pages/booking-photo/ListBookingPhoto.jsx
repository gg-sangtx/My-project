import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { List } from 'components/booking-photo';

export default class ListBookingPhoto extends Component {
  render() {
    return (
      <MainLayout isBooking={true}>
        <List params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

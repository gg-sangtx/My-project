import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { Edit } from 'components/booking-photo';

export default class DownloadStaffBookingPhoto extends Component {
  render() {
    return (
      <MainLayout isBooking={true} isStaff={true} isStaffMenu={true}>
        <Edit params={this.props.match.params} isDownload={true} isStaff={true}/>
      </MainLayout>
    );
  }
}
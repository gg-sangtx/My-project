import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { Detail } from 'components/staff-booking';

export default class DetailStaffBooking extends Component {
  render() {
    return (
      <MainLayout active={[1]} isStaff={true}>
        <Detail params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

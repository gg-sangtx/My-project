import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { Detail } from 'components/staff-pay-for-staff';

export default class DetailStaffPayForStaff extends Component {
  render() {
    return (
      <MainLayout isStaff={true} active={[2]}>
        <Detail params={this.props.match.params}/>
      </MainLayout>
    );
  }
}
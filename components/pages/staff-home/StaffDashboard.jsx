import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { List } from 'components/staff-home';

export default class StaffDashboard extends Component {
  render() {
    return (
      <MainLayout active={[0]} isStaff={true}>
        <List params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

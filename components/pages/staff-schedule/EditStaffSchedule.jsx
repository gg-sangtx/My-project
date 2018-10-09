import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Edit} from 'components/staff-schedule';

export default class EditStaffSchedule extends Component {
  render() {
    return (
      <MainLayout active={[3]}>
        <Edit params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

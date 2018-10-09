import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { Edit } from 'components/booking';

export default class EditBooking extends Component {
  render() {
    return (
      <MainLayout active={[12]}>
        <Edit params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { List } from 'components/booking';

export default class ListBooking extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}

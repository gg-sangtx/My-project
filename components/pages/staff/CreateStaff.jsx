import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/staff';

export default class CreateStaff extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

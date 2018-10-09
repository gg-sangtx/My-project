import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/costume-lock';

export default class CreateCostumeLocks extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

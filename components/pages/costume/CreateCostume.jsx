import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/costume';

export default class CreateCostume extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

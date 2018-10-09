import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/costume';

export default class ListCostume extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}

import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/studio';

export default class ListStudio extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}

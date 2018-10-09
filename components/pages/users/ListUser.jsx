import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/users';

export default class ListManager extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}

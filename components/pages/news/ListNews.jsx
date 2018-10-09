import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/news';

export default class ListNews extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}
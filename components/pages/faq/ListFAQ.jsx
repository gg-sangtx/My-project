import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/faq';

export default class ListFAQ extends Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );
  }
}


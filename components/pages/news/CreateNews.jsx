import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/news';

export default class CreateNews extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

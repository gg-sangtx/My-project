import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/product';

export default class CreateProduct extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

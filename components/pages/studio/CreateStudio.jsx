import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/studio';

export default class CreateStudio extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

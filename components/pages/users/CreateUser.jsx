import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/users';

export default class CreateUser extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

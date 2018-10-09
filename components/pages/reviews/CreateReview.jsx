import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/reviews';

export default class CreateReview extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}

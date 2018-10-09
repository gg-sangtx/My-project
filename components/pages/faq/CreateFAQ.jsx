import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/faq';

export default class CreateFAQ extends Component {
  render() {
    return (
      <MainLayout>
        <Add/>
      </MainLayout>
    );
  }
}


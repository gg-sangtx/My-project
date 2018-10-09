import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/faq';

export default class EditFAQ extends Component {
  render() {
    return (
      <MainLayout active={[17,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}


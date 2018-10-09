import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/reviews';

export default class EditReview extends Component {
  render() {
    return (
      <MainLayout active={[14,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

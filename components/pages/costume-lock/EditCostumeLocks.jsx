import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/costume-lock';

export default class EditCostumeLocks extends Component {
  render() {
    return (
      <MainLayout active={[7,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/costume';

export default class EditCostume extends Component {
  render() {
    return (
      <MainLayout active={[6,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/order';

export default class EditOrder extends Component {
  render() {
    return (
      <MainLayout active={[13,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

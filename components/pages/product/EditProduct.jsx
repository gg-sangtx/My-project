import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/product';

export default class EditProduct extends Component {
  render() {
    return (
      <MainLayout active={[10,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

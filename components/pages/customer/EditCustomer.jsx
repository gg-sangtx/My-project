import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/customer';

export default class EditCustomer extends Component {
  render() {
    return (
      <MainLayout active={[11]}>
        <Add params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

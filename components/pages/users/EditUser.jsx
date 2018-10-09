import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/users';

export default class EditUser extends Component {
  render() {
    return (
      <MainLayout active={[1,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

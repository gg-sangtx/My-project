import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/staff';

export default class EditStaff extends Component {
  render() {
    return (
      <MainLayout active={[3,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

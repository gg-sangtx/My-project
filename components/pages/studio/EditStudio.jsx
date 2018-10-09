import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/studio';

export default class EditStudio extends Component {
  render() {
    return (
      <MainLayout active={[2,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

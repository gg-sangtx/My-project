import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/news';

export default class EditNews extends Component {
  render() {
    return (
      <MainLayout active={[16,1]}>
        <Add edit={true} params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

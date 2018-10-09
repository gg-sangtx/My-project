import React, { Component } from 'react';
import { MainLayout } from 'components/layouts';
import { List } from 'components/home';

export default class Dashboard extends Component {
  render() {
    return (
      <MainLayout active={[0]}>
        <List params={this.props.match.params}/>
      </MainLayout>
    );
  }
}

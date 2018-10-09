import React from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/shooting/plans';

class ListPlans extends React.Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );

  }
}

export default ListPlans;

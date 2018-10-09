import React from 'react';
import { MainLayout } from 'components/layouts';
import {List} from 'components/shooting/plan-options';

class ListPlanOptions extends React.Component {
  render() {
    return (
      <MainLayout>
        <List/>
      </MainLayout>
    );

  }
}

export default ListPlanOptions;

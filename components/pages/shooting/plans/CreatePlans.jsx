import React from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/shooting/plans';

class CreatePlans extends React.Component {
    render() {
      return (
        <MainLayout>
          <Add />
        </MainLayout>
      );
    }
}

export default CreatePlans;

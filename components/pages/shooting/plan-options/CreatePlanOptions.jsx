import React from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/shooting/plan-options';

class CreatePlanOptions extends React.Component {
    render() {
      return (
        <MainLayout>
          <Add />
        </MainLayout>
      );
    }
}

export default CreatePlanOptions;

import React from 'react';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/shooting/plan-options';

class EditPlanOptions extends React.Component {
    render() {
      return (
        <MainLayout active={[8,3]}>
          <Add edit={true} params={this.props.match.params}/>
        </MainLayout>
      );
    }
}

export default EditPlanOptions;

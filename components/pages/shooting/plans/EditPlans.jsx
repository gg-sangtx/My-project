import React from 'react';
import PropTypes from 'prop-types';
import { MainLayout } from 'components/layouts';
import {Add} from 'components/shooting/plans';

class EditPlans extends React.Component {
    render() {
      return (
        <MainLayout active={[8,1]}>
          <Add edit={true} params={this.props.match.params}/>
        </MainLayout>
      );
    }
}

export default EditPlans;

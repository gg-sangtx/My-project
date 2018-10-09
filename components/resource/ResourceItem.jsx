import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {Checkbox} from '@blueprintjs/core';

class ResourceItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isCheck: false
    }
  }

  componentWillReceiveProps(nextProps) {
    let isDefaultCheck = false;

    if (this.props.id != nextProps.id) {
      this.setState({
        isCheck: isDefaultCheck
      });

      this.props.checkboxStore.registerCheckboxItem(nextProps.id, this, isDefaultCheck, (isCheck) => {
        this.setState({
          isCheck
        })
      });
    }
  }

  handleCheckboxChange() {
    let isCheck = !this.state.isCheck;

    this.setState({
      isCheck
    });

    this.props.checkboxStore.dispatch({
      type: 'TOGGLE',
      key: this.props.id
    });
  }

  componentDidMount() {
    let isCheck = this.state.isCheck;

    this.props.checkboxStore.registerCheckboxItem(this.props.id, this, isCheck, (isCheck) => {
      this.setState({
        isCheck
      })
    });
  }

  formatTypeDateTime(dateTime) {
    return moment(dateTime).format('MM/DD/YYYY HH:mm:ss');
  }

  render() {
    return (
      <tr>
        <td className="text-center">
          <Checkbox checked={this.state.isCheck} className="delete-checkbox" onChange={this.handleCheckboxChange.bind(this)}/>
        </td>
        <td><Link to={`/resources/edit/${this.props.id}`}>{this.props.title}</Link></td>
        <td>{this.props.summary}</td>
        <td>{this.formatTypeDateTime(this.props.created_at)}</td>
      </tr>
    );
  }
}

export default ResourceItem;

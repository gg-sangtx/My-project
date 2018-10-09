import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import {withRouter} from 'react-router';
import {Input, LinkWebInput} from 'components/UI/Form';
import {Set} from 'api';

class Setting extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      appName: '',
      linkIOS: '',
      formErrors: {
        appName: '',
        linkIOS: ''
      }
    }
    this.props.validators['testGroup'] = [];
  }

  componentDidMount() {
    let data = [];
    Set.actions.all.request().then(response => {
      response.data.data.map(item => {
        data[item.attributes.key] = item.attributes.value;
      });
      this.setState({
        appName: data['app_name'],
        linkIOS: data['app_link']
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  checkValidate() {
   let pass = true;
   this.props.validators['testGroup'].map(validator => {
     if (pass) {
       pass = validator.validate();
     } else {
       validator.validate();
     }
   });
   return pass;
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.resetError();
    if (this.checkValidate()) {
      this.props.fnSubmit(this.state);
    }
  }

  onCancel() {
    this.props.history.push({
      pathname: '/users',
      search: null,
      state: null
    });
  }

  render() {
    return (
      <div>
        <section className="content-header">
          <h1>SETTINGS</h1>
        </section>
        <section className="content">
          <div className="box box-cuedin create-counselor-form pb50">
            <form role="form">
              <div className="box-body">
                <Input className="" type="text" name="appName" label="App Name" value={this.state.appName} onChange={this.handleChange.bind(this)} bindValidator={this} channel="testGroup" validationText="This field is not allowed to be empty"/>
                <LinkWebInput className="" type="text" name="linkIOS" label="Link iOS" value={this.state.linkIOS} onChange={this.handleChange.bind(this)} bindValidator={this} channel="testGroup" validationText="Please enter valid URL"/>
              </div>
              <div className="box-footer border-none">
                <div className="pull-left">
                  <button type="button" className="btn btn-default" onClick={this.onCancel.bind(this)}><i className="fa fa-times"></i>Cancel</button>
                </div>
                <div className="pull-right">
                  <button type="submit" className="btn btn-cuedin" onClick={this.onSubmit.bind(this)}><i className="fa fa-save"></i>Save</button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

Setting.defaultProps = {
  validators: {},
  autoload: true
}
Setting.propTypes = {
  autoload: React.PropTypes.bool
}

export default withRouter(Setting);

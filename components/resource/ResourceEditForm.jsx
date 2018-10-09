import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {Input, EmailInput, NumberInput, LinkWebInput, Textarea} from 'components/UI/Form';
import { Res } from 'api';

class ResourceEditForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: '',
      title: '',
      link: '',
      summary: '',
      image:'',
      uploadFile: '',
      formData: '',
      imagePreviewUrl: '',
      file: ''
    }
    this.props.validators['testGroup'] = [];
  }

  handleChange(name, e) {
    if (name == 'link') {
      Res.actions.crawl.request({
        link: e.target.value
      }).then(response => {
        this.setState({
          title: response.data.data.attributes.title,
          summary: response.data.data.attributes.description,
          link: this.state.link,
          image: response.data.data.attributes.images[0].url
        })
      });
    }
   this.setState({
     [name]: e.target.value
   })
  }

  componentDidMount() {
    let {id} = this.props.match.params;
      Res.actions.get.request({id}
      ).then(response => {
        this.setState({
          id: response.data.data.attributes.id,
          title: response.data.data.attributes.title,
          summary: response.data.data.attributes.summary,
          link: response.data.data.attributes.link,
          image: response.data.data.attributes.image
        });
      });
  }

  handleFile(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', e.target.files[0])

    let reader = new FileReader();
    let file = e.target.files[0];

    this.setState({
      uploadFile: file.name,
      formData: formData
    })

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result
      });
    }

    reader.readAsDataURL(file)
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
    if(this.checkValidate()) {
      this.props.fnSubmit(this.state);
    }
  }

  onCancel() {
    this.props.history.push({
      pathname: '/resources',
      search: null,
      state: null
    });
  }

  render() {
    return (
      <div>
        <section className="content-header">
          <h1>Resource Edit</h1>
        </section>
        <section className="content">
          <div className="box box-primary create-counselor-form pb50">
            <form role="form">
              <div className="box-body">
                <Input className="" type="text" label="Title Resource" value={this.state.title} required={'This field is required'}  onChange={this.handleChange.bind(this, 'title')} bindValidator={this} channel="testGroup"
                 validationText="This field is not allowed to be empty"/>
                 <LinkWebInput className="" type="text" label="Link" value={this.state.link} required={'This field is required'} onChange={this.handleChange.bind(this, 'link')} bindValidator={this} channel="testGroup"
                  validationText="Please enter valid URL"/>
                   <div className="fl">
                     <img src={this.state.image}  />
                   </div>
                     <input type="file" onChange={this.handleFile.bind(this)} accept="image/*"/>
                 <Textarea className="" type="text" row="10" required={'This field is required'} onChange={this.handleChange.bind(this, 'summary')} value={this.state.summary} bindValidator={this} channel="testGroup"
                  validationText="This field is not allowed to be empty"/>
              </div>
              <div className="box-footer border-none">
                <div className="pull-left">
                  <button type="button" className="btn btn-default" onClick={ this.onCancel.bind(this) }><i className="fa fa-times"></i>Cancel</button>
                </div>
                <div className="pull-right">
                  <button type="submit" className="btn btn-success" onClick={ this.onSubmit.bind(this) }><i className="fa fa-save"></i>Edit</button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

ResourceEditForm.defaultProps = {
  validators: {}
}
export default withRouter(ResourceEditForm);

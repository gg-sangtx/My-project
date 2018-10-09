import React, { Component } from 'react';
import {msg} from "constants/message";
import { System } from 'api';
import { Toastr } from 'components/modules/toastr';

export default class ItemUploadMultiple extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      listFileAddNew: []
    }
  }

  onChange(e) {
    let listFile = [...e.target.files];
    if(listFile.length > 0) {
      listFile.map((item, index) => {
        this.upload(item);
      });
      this.state.listFileAddNew = [];
      this.setState({...this.state})
    }
  }

  upload(file) {
    let newItem = {
      id: null,
      loading: true,
      imagePreviewUrl: ''
    }
    let indexParent = this.props.pushItem(newItem);
    System.actions.uploadFile.request('',{field: 'filename', file: file}).then(res => {
      if(res && res.data) {
        let ItemResult = {
          imagePreviewUrl: res.data.data.fileUrl,
          loading: false
        }
        this.props.pushItemResult(ItemResult, indexParent);
        this.setState({...this.state});
      }
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.loading = false;
      this.setState({...this.state});
    })
  }
  render() {
    return (
      <div className={`item-upload-image mb20`}>
        <div className='wrap'>
          <div className='wrap-input-file'>
            <input type='file' className='input-file' value={this.state.listFileAddNew} onChange={this.onChange.bind(this)} multiple accept='image/*'/>
            <span className='fa fa-plus-circle' style={{pointerEvents: 'none', borderRadius: '100px', overflow: 'hidden'}}/>
          </div>
        </div>
      </div>
    );
  }
}

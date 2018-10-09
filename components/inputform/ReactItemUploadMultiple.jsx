import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {LimitImageType, LimitFileSize} from 'constants/file';
import { Toastr } from 'components/modules/toastr';
import {msg} from 'constants/message';
import { System } from 'api';

class ReactItemUploadMultiple extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      URL: this.props.ItemUploadMultiple && this.props.ItemUploadMultiple.URL || '',
      loading: this.props.ItemUploadMultiple && this.props.ItemUploadMultiple.loading || false,
      isValid: false,
      message: msg.messageDefault,
      origin_file_name: this.props.ItemUploadMultiple && this.props.ItemUploadMultiple.origin_file_name || '',
      recommend: this.props.ItemUploadMultiple && this.props.ItemUploadMultiple.recommend || 0,
      public: this.props.ItemUploadMultiple && this.props.ItemUploadMultiple.public || 0
    }
  }

  componentWillReceiveProps(nextProps) {
    this.state.URL = nextProps.ItemUploadMultiple.URL || '';
    this.state.loading = nextProps.ItemUploadMultiple.loading || false;
    this.state.recommend = nextProps.ItemUploadMultiple.recommend || 0;
    this.state.origin_file_name = nextProps.ItemUploadMultiple.origin_file_name || '';
    this.state.public = nextProps.ItemUploadMultiple.public || 0;
    this.setState({...this.state})
  }

  onChange(e) {
    if (e.target.files[0]) {
      let fileName = e.target.files[0].name;
      let ext = fileName.split('.').pop().toLowerCase();
      let fileSize = e.target.files[0].size;
      if (LimitImageType.indexOf(ext) == -1) {
        Toastr(msg.fileTypeErr, 'warning');
      } else if (fileSize > LimitFileSize*1024*1024) {
        Toastr(msg.fileSizeErr, 'warning');
      } else {
        this.state.URL = '';
        this.state.loading = true;
        this.setState({...this.state})
        System.actions.uploadFile.request('',{field: 'filename', file: e.target.files[0], is_need_origin_name: true}).then(res => {
          if(res && res.data) {
            this.state.URL = res.data.data.fileUrl;
            this.state.loading = false;
            this.setState({...this.state});
            console.log(res);
            let data = {
              target: {
                value: {
                  id: this.props.ItemUploadMultiple.id || null,
                  URL: res.data.data.fileUrl || '',
                  origin_file_name: res.data.data.origin_file_name || '',
                  recommend: this.state.recommend || 0,
                  public: this.state.public || 0,
                  accept: true
                }
              }
            }
            this.props.onChange(this.props.count, data)
          }
        }).catch(err => {
          this.state.loading = false;
          this.setState({...this.state});
        })
      }
    }
  }


  removeImage() {
    this.state.URL = '';
    this.state.loading = false;
    this.setState({...this.state})
    let data = {
      target: {
        value: {
          id: this.props.ItemUploadMultiple.id || null,
          URL: '',
          origin_file_name: '',
          recommend: 0,
          public: 0,
          accept: true
        }
      }
    }
    this.props.onChange(this.props.count, data)
  }

  validate() {
    if (this.props.require == true && this.state.URL == '') {
      this.state.isValid = true;
      this.setState({...this.state})
      this.ItemUploadMultiple.focus();
      return false
    } else {
      return true
    }
  }

  handleRemove() {
    this.props.handleRemove(this.props.count, this.props.ItemUploadMultiple.id);
  }

  Uploading() {
    this.props.Uploading();
  }

  Uploaded() {
    this.props.Uploaded();
  }

  changeStatus(name) {
    if (this.state[name] == 1) {
      this.state[name] = 0;
    } else {
      this.state[name] = 1;
    }
    this.setState({...this.state});
    let data = {
      target: {
        value: {
          id: this.props.ItemUploadMultiple.id || null,
          URL: this.state.URL || '',
          recommend: this.state.recommend || 0,
          origin_file_name: this.state.origin_file_name || '',
          public: this.state.public || 0,
          accept: true
        }
      }
    }
    this.props.onChange(this.props.count, data)
  }

  render() {
    let URL = this.state.URL || '';
    return (
      <div className={`item-upload-image mb20 ${this.props.editBookingPhoto == true ? 'edit-booking-photo' : ''}`} style={{position: 'relative'}}>
        <span className='btn btn-delete-image' disabled={this.state.loading} onClick={this.handleRemove.bind(this)}></span>
        <div className={`wrap ${this.props.hasAlt == true ? 'mb10' : ''}`}>
          <div className='index-item'>{this.props.count + 1}</div>
          <ShowIf condition={this.state.loading != true}>
            <div>
              <ShowIf condition={URL != ''}>
                <div className='wrap-input-file has-file'>
                  <div className='wrap-close'>
                    <img className='img-result' src={URL}/>
                    <ShowIf condition={this.props.allowAddNew == true}>
                      <span className='fa fa-times-circle' onClick={this.removeImage.bind(this)}/>
                    </ShowIf>
                  </div>
                  <input type='file' ref={(file) => {this.file = file}} className='reupload' accept='image/*' onChange={this.onChange.bind(this)}/>
                  <ShowIf condition={this.props.editBookingPhoto == true}>
                    <div className='wrap-button-status'>
                      <button className={this.state.recommend == 1 ? 'btn-recommended' : 'btn-not-recommended'} onClick={this.changeStatus.bind(this, 'recommend')}>{this.state.recommend ? 'オススメ' : 'オススメにする'}</button>
                      <button className={this.state.public == 1 ? 'btn-public' : 'btn-private'} onClick={this.changeStatus.bind(this, 'public')}>{this.state.public ? '公開' : '非公開'}</button>
                    </div>
                  </ShowIf>
                </div>
              </ShowIf>
              <ShowIf condition={URL == ''}>
                <div className='wrap-input-file'>
                  <input type='file' ref={(file) => {this.file = file}} className='input-file' accept='image/*' onChange={this.onChange.bind(this)}/>
                  <span className='fa fa-cloud-upload-alt'/>
                </div>
              </ShowIf>
            </div>
          </ShowIf>
          <ShowIf condition={this.state.loading == true}>
            <div className='wrap-input-file has-loading loading'>
            </div>
          </ShowIf>
        </div>
        <div className='row pl15 pr15'>
          <input className='hidden-input' ref={(ItemUploadMultiple) => {this.ItemUploadMultiple = ItemUploadMultiple}}/>
          <ShowIf condition={this.state.isValid == true}>
            <span className="pt-form-helper-text col-xs-12 pt5">{this.state.message}</span>
          </ShowIf>
        </div>
      </div>
    )
  }
}

ReactItemUploadMultiple.defaultProps = {
  multipleUpload: false,
  allowAddNew: true,
  onChange: function() {},
  removeImage: function() {},
  handleRemove: function() {}
}

export default validatable(ReactItemUploadMultiple);
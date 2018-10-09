import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {LimitImageType, LimitFileSize} from 'constants/file';
import { Toastr } from 'components/modules/toastr';
import {Input} from 'components/inputform';
import {msg} from "constants/message";
import { System } from 'api';

class UploadImage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      url: '',
      value: this.props.value,
      file: '',
      imagePreviewUrl: '',
      alt: '',
      loading: false,
      isValid: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.value && nextProps.value != this.props.value) {
      this.state.value = nextProps.value;
      this.setState({...this.state})
    }
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
        this.state.loading = true;
        this.setState({...this.state})
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
          this.state.value = '';
          this.state.file = file;
          this.state.imagePreviewUrl = reader.result;
          this.state.isValid = false;
          this.setState({
            ...this.state
          }, () => {
            this.state.loading = false;
            this.setState({...this.state})
          });
        }
        reader.readAsDataURL(file)
        let data = {
          target: {
            value: e.target.files[0]
          }
        }
        this.props.onChange(data)
      }
    }
  }

  removeImage() {
    this.state.value = '';
    this.state.file = '';
    this.state.imagePreviewUrl = '';
    this.state.loading = false;
    this.setState({...this.state})
    this.props.removeImage();
  }

  onChangeAlt(e) {
    this.state.alt = e.target.value;
    this.setState({...this.state})
  }

  validate() {
    if (this.props.require == true && (this.state.value == '' && this.state.imagePreviewUrl == '')) {
      this.state.isValid = true;
      this.setState({...this.state})
      this.uploadImage.focus();
      return false
    } else {
      return true
    }
  }

  render() {
    let imagePreviewUrl = '';
    if(this.state.value) {
      imagePreviewUrl = this.state.value
    } else if(this.state.imagePreviewUrl) {
      imagePreviewUrl = this.state.imagePreviewUrl
    }
    return (
      <div className='upload-container' style={{position: 'relative'}}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className="label-require">&nbsp;*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className={`upload-list-item ${this.state.isValid ? '' : 'mb15'}`}>
          <div className='item-upload-image'>
            <div className={`wrap ${this.props.hasAlt == true ? 'mb10' : ''}`}>
              <ShowIf condition={this.state.loading != true}>
                <div>
                  <ShowIf condition={imagePreviewUrl != ''}>
                    <div className='wrap-input-file has-file'>
                      <img className='img-result' src={imagePreviewUrl}/>
                      <span className='fa fa-times-circle' onClick={this.removeImage.bind(this)}/>
                    </div>
                  </ShowIf>
                  <ShowIf condition={imagePreviewUrl == ''}>
                    <div className='wrap-input-file'>
                      <input type='file' className='input-file' onChange={this.onChange.bind(this)}/>
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
            <ShowIf condition={this.props.hasAlt == true}>
              <div className='row pl15 pr15'>
                <Input label={this.props.altLabel} value={this.state.alt} onChange={this.onChangeAlt.bind(this)} className='col-xs-12'/>
              </div>
            </ShowIf>
          </div>
        </div>
        <input className='hidden-input' ref={(uploadImage) => {this.uploadImage = uploadImage}}/>
        <ShowIf condition={this.state.isValid}>
          <span className="pt-form-helper-text mb15">{msg.messageDefault}</span>
        </ShowIf>
      </div>
    )
  }
}

UploadImage.defaultProps = {
  multipleUpload: false,
  value: false,
  hasAlt: false,
  altLabel: 'alt'
}

export default validatable(UploadImage);
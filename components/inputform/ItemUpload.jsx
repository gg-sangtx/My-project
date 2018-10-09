import React from 'react';
import {ShowIf, validatable} from 'components/utils';
import {LimitImageType, LimitFileSize} from 'constants/file';
import { Toastr } from 'components/modules/toastr';
import {Input} from 'components/inputform';
import {msg} from "constants/message";
import { System } from 'api';

class ItemUpload extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: this.props.itemUpload && this.props.itemUpload.id || '',
      imagePreviewUrl: this.props.itemUpload && this.props.itemUpload.imagePreviewUrl || '',
      alt: this.props.itemUpload && this.props.itemUpload.alt || '',
      sort: this.props.itemUpload && this.props.itemUpload.sort || '',
      loading: this.props.itemUpload && this.props.itemUpload.loading || false,
      isValid: false,
      message: msg.messageDefault
    }
  }

  componentDidMount() {
    if(this.props.itemUpload.new == true) {
      this.file.click();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.itemUpload && nextProps.itemUpload != this.props.itemUpload) {
      this.state.id = nextProps.itemUpload.id ? nextProps.itemUpload.id : '';
      this.state.imagePreviewUrl = nextProps.itemUpload.imagePreviewUrl ? nextProps.itemUpload.imagePreviewUrl : '';
      this.state.sort = nextProps.itemUpload.sort ? nextProps.itemUpload.sort : '';
      this.state.loading = nextProps.itemUpload.loading ? nextProps.itemUpload.loading : false;
      this.state.alt = nextProps.itemUpload.alt ? nextProps.itemUpload.alt : '';
      this.setState({...this.state})
    }
  }

  onChange(e) {
    if(this.props.uploadMultiple == true) {
      let listFile = [...e.target.files];
      if(listFile.length > 0) {
        this.setState({...this.state});
        listFile.map((item, index) => {
          if(index != 0) {
            this.upload(item);
          } else {
            let fileName = e.target.files[0].name;
            let ext = fileName.split('.').pop().toLowerCase();
            let fileSize = e.target.files[0].size;
            this.state.loading = true;
            this.setState({...this.state})

            System.actions.uploadFile.request('',{field: 'filename', file: e.target.files[0]}).then(res => {
              if(res && res.data) {
                this.state.imagePreviewUrl = res.data.data.fileUrl;
                this.state.loading = false;
                this.setState({...this.state});
                if (this.props.multi == true) {
                  this.pushDataMulti('multi');
                } else {
                  this.pushDataMulti('file');
                }
              }
            }).catch(err => {
              this.state.loading = false;
              this.setState({...this.state});
            })
          }
        })
      }
    } else {
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

          System.actions.uploadFile.request('',{field: 'filename', file: e.target.files[0]}).then(res => {
            if(res && res.data) {
              this.state.imagePreviewUrl = res.data.data.fileUrl;
              this.state.loading = false;
              this.setState({...this.state});
              if (this.props.multi == true) {
                this.pushDataMulti('multi');
              } else {
                this.pushDataMulti('file');
              }
            }
          }).catch(err => {
            this.state.loading = false;
            this.setState({...this.state});
          })
        }
      }
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

  removeImage() {
    this.state.imagePreviewUrl = '';
    this.state.loading = false;
    this.setState({...this.state})
    if (this.props.multi == true) {
      this.pushDataMulti('multi');
    } else {
      this.pushDataMulti('file');
    }
  }

  onChangeAlt(e) {
    this.state.alt = e.target.value;
    this.setState({...this.state})
    if (this.props.multi == true) {
      this.pushDataMulti('multi');
    } else {
      this.pushDataMulti('alt');
    }
  }

  onChangeSort(e) {
    this.state.sort = e.target.value;
    this.setState({...this.state})
    if (this.props.multi == true) {
      this.pushDataMulti('multi');
    } else {
      this.pushDataMulti('sort');
    }
  }

  pushDataMulti(type) {
    this.state.isValid = false;
    this.setState({...this.state});
    let data = {
      id: this.state.id || null,
      imagePreviewUrl: this.state.imagePreviewUrl
    }
    if(this.props.hasAlt) {
      data = {
        ...data,
        alt: this.state.alt
      }
    }
    if(this.props.hasSort) {
      data = {
        ...data,
        sort: this.state.sort
      }
    }
    if(type == 'multi') {
      this.props.onChange(this.props.index, data);
    } else {
      this.props.onPushData(type, data);
    }
  }

  validate() {
    if (this.props.require == true && this.state.imagePreviewUrl == '') {
      this.state.isValid = true;
      this.setState({...this.state})
      this.itemUpload.focus();
      return false
    } else if (this.props.requirealt == true && this.state.alt == '') {
      this.state.isValid = true;
      this.setState({...this.state})
      this.itemUpload.focus();
      return false
    } else if (this.props.multi == true && this.state.imagePreviewUrl != '' && (this.props.hasSort == true && this.state.sort == '')) {
      this.state.isValid = true;
      this.setState({...this.state})
      this.itemUpload.focus();
      return false
    } else {
      return true
    }
  }

  handleRemove() {
    this.props.handleRemove(this.props.index);
  }

  render() {
    let imagePreviewUrl = this.state.imagePreviewUrl;
    return (
      <div className='item-upload-image mb20' style={{position: 'relative'}}>
        <ShowIf condition={this.props.countItem && this.props.countItem > 1}>
          <span className='btn btn-delete-image' onClick={this.handleRemove.bind(this)}></span>
        </ShowIf>
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
                  <input type='file' ref={(file) => {this.file = file}} className='input-file' onChange={this.onChange.bind(this)} multiple/>
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
          <div className={`row pl15 pr15 ${this.props.hasSort == true ? 'pb15' : ''}`}>
            <Input label={this.props.altLabel} changeOnBlur={true} value={this.state.alt} onChange={this.onChangeAlt.bind(this)} className='col-xs-12'/>
          </div>
        </ShowIf>
        <ShowIf condition={this.props.hasSort == true}>
          <div className='row pl15 pr15'>
            <Input label={this.props.sortLabel} changeOnBlur={true} value={this.state.sort} onChange={this.onChangeSort.bind(this)} className='col-xs-12'/>
          </div>
        </ShowIf>
        <div className='row pl15 pr15'>
          <input className='hidden-input' ref={(itemUpload) => {this.itemUpload = itemUpload}}/>
          <ShowIf condition={this.state.isValid == true}>
            <span className="pt-form-helper-text col-xs-12 pt5">{this.state.message}</span>
          </ShowIf>
        </div>
      </div>
    )
  }
}

ItemUpload.defaultProps = {
  multipleUpload: false,
  value: false,
  hasAlt: false,
  hasSort: false,
  uploadMultiple: false,
  altLabel: 'alt',
  sortLabel: 'sort',
  onChange: function() {},
  removeImage: function() {},
  handleRemove: function() {}
}

export default validatable(ItemUpload);
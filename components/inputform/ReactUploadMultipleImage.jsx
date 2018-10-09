import React from 'react';
import ReactItemUploadMultiple from './ReactItemUploadMultiple.jsx';
import {ShowIf, validatable} from 'components/utils';
import {LimitImageType} from 'constants/file';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {System} from 'api';

const SortableItem = SortableElement(({value, parent, count}) =>
  <div className={`item-upload-image ${parent.props.classNameCustom ? parent.props.classNameCustom : ''}`}>
    <ReactItemUploadMultiple editBookingPhoto={parent.props.editBookingPhoto} Uploading={parent.Uploading.bind(parent)} Uploaded={parent.Uploaded.bind(parent)} classNameCustom={parent.props.classNameCustom} allowAddNew={parent.props.allowAddNew} onChange={parent.onChange.bind(parent)} count={count} handleRemove={parent.handleRemove.bind(parent)} ItemUploadMultiple={value}/>
  </div>
);

const SortableList = SortableContainer(({items, parent}) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} parent={parent} classNameCustom={parent.props.classNameCustom} index={index} count={index} value={value} />
      ))}
      <ShowIf condition={parent.props.allowAddNew == true}>
        <div className={`item-upload-image mb20`}>
          <div className='wrap'>
            <div className='wrap-input-file'>
              <input type='file' className='input-file' value={parent.state.listFileAddNew} onChange={parent.addNewItem.bind(parent)} multiple accept='image/*'/>
              <span className='fa fa-plus-circle' style={{pointerEvents: 'none', borderRadius: '100px', overflow: 'hidden'}}/>
            </div>
          </div>
        </div>
      </ShowIf>
    </div>
  );
});

class ReactUploadMultipleImage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: this.props.data || [{}],
      listFileAddNew: [],
      countFileUpload: [],
      listFileNumber: []
    }
  }

  addNewItem(e) {
    let listFile = [...e.target.files];
    if(listFile.length > 0) {
      this.Uploading();
      this.state.listFileNumber.push(listFile.length);
      this.state.countFileUpload.push(0);
      this.setState({...this.state});
      let IndexItem = this.state.data.length;
      listFile.map((item, index) => {
        this.upload(item, IndexItem + index, this.state.listFileNumber.length - 1);
      })
    }
  }

  upload(file, index, checkIndex) {
    let newItem = {
      id: null,
      loading: true,
      URL: ''
    }
    this.state.data.push(newItem);
    System.actions.uploadFile.request('',{field: 'filename', file: file, is_need_origin_name: true}).then(res => {
      if(res && res.data) {
        this.state.data[index].URL = res.data.data.fileUrl;
        this.state.data[index].origin_file_name = res.data.data.origin_file_name;
        this.state.data[index].loading = false;
        this.state.countFileUpload[checkIndex] = this.state.countFileUpload[checkIndex] + 1;
        this.sheckCountFileUpload(checkIndex);
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

  sheckCountFileUpload(checkIndex) {
    if(this.state.countFileUpload[checkIndex] === this.state.listFileNumber[checkIndex] && checkIndex === this.state.countFileUpload.length - 1) {
      this.setState({...this.state})
      this.Uploaded();
      this.pushData();
    }
  }

  onSortEnd({oldIndex, newIndex}) {
    this.state.data = arrayMove(this.state.data, oldIndex, newIndex)
    this.setState({
      ...this.state
    });
    this.pushData();
  };

  handleRemove(index, id) {
    this.state.data.splice(index, 1);
    this.setState({...this.state});
    this.pushData();
    if (id) {
      this.props.onDeleteItem(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data != this.props.data) {
      this.state.data = nextProps.data;
      this.setState({...this.state})
    }
  }

  onChange(index, data) {
    this.state.data[index] = data.target.value;
    this.setState({...this.state});
    this.pushData();
  }

  pushData() {
    this.props.onChange(this.state.data)
  }

  Uploading() {
    this.props.disableAction();
  }

  Uploaded() {
    this.props.enableAction();
  }

  render() {
    return (
      <div className='upload-container' style={{position: 'relative'}}>
        <ShowIf condition={this.props.label != ''}>
          <label className='form-label'>{this.props.label}
            <ShowIf condition={this.props.require == true}>
              <span className='label-require'>&nbsp;*</span>
            </ShowIf>
          </label>
        </ShowIf>
        <div className='upload-list-item'>
          <SortableList items={this.state.data} parent={this} onSortEnd={this.onSortEnd.bind(this)} axis='xy'/>
        </div>
      </div>
    )
  }
}

ReactUploadMultipleImage.defaultProps = {
  multi: true,
  altLabel: '',
  allowAddNew: true,
  onChangeFile: function() {},
  onChangeAlt: function() {},
  onChangeSort: function() {},
  onChange: function() {},
}

export default validatable(ReactUploadMultipleImage);

import React from 'react';
import ItemUpload from './ItemUpload.jsx';
import ItemUploadMultiple from './ItemUploadMultiple.jsx';
import {ShowIf, validatable} from 'components/utils';

class UploadMultipleImage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: this.props.data || [{}]
    }
  }

  addNewItem() {
    let item = {
      new: true
    }
    this.state.data.push(item);
    this.setState({...this.state})
  }

  handleRemove(index) {
    this.state.data.splice(index, 1);
    this.setState({...this.state})
    let value = {
      target: {
        value: this.state.data
      }
    }
    this.props.onChange(value)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data != this.props.data) {
      this.state.data = nextProps.data;
      this.setState({...this.state})
    }
  }

  onChange(index, data) {
    this.state.data[index] = data;
    this.setState({...this.state});
    let value = {
      target: {
        value: this.state.data
      }
    }
    this.props.onChange(value)
  }

  onPushData(type, data) {
    this.state.data[0] = data;
    this.setState({...this.state});
    let value = {
      target: {
        value: ''
      }
    }
    if(type == 'file') {
      value.target.value = data.imagePreviewUrl;
      this.props.onChangeFile(value);
    }
    if(type == 'alt') {
      value.target.value = data.alt;
      this.props.onChangeAlt(value);
    }
    if(type == 'sort') {
      value.target.value = data.sort;
      this.props.onChangeSort(value);
    }
  }

  pushItem(data) {
    return this.props.pushItem(data);
  }

  pushItemResult(data, index) {
    this.props.pushItemResult(data, index);
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
          {
            this.state.data.map((itemUpload, i) => {
              return <ItemUpload pushItem={this.pushItem.bind(this)} pushItemResult={this.pushItemResult.bind(this)} uploadMultiple={this.props.uploadMultiple} key={i} index={i} bindValidator={this} require={this.props.require}  requirealt={this.props.requirealt} channel='form' multi={this.props.multi} altLabel={this.props.altLabel} onPushData={this.onPushData.bind(this)} countItem={this.state.data.length} onChange={this.onChange.bind(this)} hasAlt={this.props.hasAlt} hasSort={this.props.hasSort} handleRemove={this.handleRemove.bind(this)} sortLabel={this.props.sortLabel} itemUpload={itemUpload}/>
            })
          }
          <ShowIf condition={this.props.multi == true && !this.props.uploadMultiple}>
            <div className='item-upload-image mb20'>
              <div className='wrap'>
                <div className='wrap-input-file'>
                  <span className='fa fa-plus-circle' style={{cursor: 'pointer', borderRadius: '100px', overflow: 'hidden'}} onClick={this.addNewItem.bind(this)}/>
                </div>
              </div>
            </div>
          </ShowIf>
          <ShowIf condition={this.props.uploadMultiple}>
            <ItemUploadMultiple pushItem={this.pushItem.bind(this)} pushItemResult={this.pushItemResult.bind(this)}/>
          </ShowIf>
        </div>
      </div>
    )
  }
}

UploadMultipleImage.defaultProps = {
  multi: true,
  altLabel: '',
  uploadMultiple: false,
  pushItem: function() {},
  onChangeFile: function() {},
  onChangeAlt: function() {},
  onChangeSort: function() {},
  onChange: function() {},
}

export default validatable(UploadMultipleImage);

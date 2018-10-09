import React, { Component } from 'react';
import {Input, DropDown, GroupCheckBox, TextArea, UploadMultipleImage} from 'components/inputform';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import {Costumes} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import {updateSystemData} from 'base/actions/systemData';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      code: '',
      name: '',
      type: 1,
      sex: "0",
      studioId: '',
      size: [],
      description: '',
      costume_images:[],
      studios_can_work: [],
      matching_costume_code:'',
      studio: [],
      loading: false,
      resetLoading: false,
      dataStyle: [
        {value: 1, name: '洋装'},
        {value: 2, name: '和装'}
      ],
      dataSex: [
        {value: "0", name: 'ユニセックス'},
        {value: "1", name: '男の子'},
        {value: "2", name: '女の子'}
      ],
      dataStudioCanWork: this.props.dataStudioCanWork || [],
      listSize: this.props.listSize || [],
      dataUpdateStudio: [],
      dataUpdateSize: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataStudioCanWork != this.props.dataStudioCanWork) {
      this.state.dataStudioCanWork = nextProps.dataStudioCanWork;
    }

    if(nextProps.listSize != this.props.listSize) {
      this.state.listSize = nextProps.listSize;
    }

    this.setState({...this.state});
  }

  componentDidMount() {
    if(this.props.params && this.props.params.id) {
      this.getInfo(this.props.params.id);
    }

  }

  getInfo(id) {
    let dataFilter = [];
    if(this.props.listCostumes.length > 0) {
      dataFilter = this.props.listCostumes.filter(state => {
        return state.id == id
      })
    }
    if(dataFilter.length > 0) {
      this.state.name = dataFilter[0].name;
      this.state.code = dataFilter[0].code;
      this.state.type = dataFilter[0].type;
      this.state.sex = dataFilter[0].sex;
      let dataNewStudio = dataFilter[0].studios.map(item => {
        this.state.dataUpdateStudio.push(item.id)
      });

      let dataNewSize = dataFilter[0].costume_sizes.map(item => {
        let itemSize = item.id;
        this.state.dataUpdateSize.push(itemSize);
      });

      this.state.studios_can_work = this.state.dataUpdateStudio;
      this.state.size = this.state.dataUpdateSize;
      this.state.description = dataFilter[0].description;
      this.state.matching_costume_code = dataFilter[0].matching_costume_code || '';

      if (dataFilter[0].costume_images && dataFilter[0].costume_images.length > 0) {
        dataFilter[0].costume_images.map(item => {
          let newItem = {
            id: item.id,
            imagePreviewUrl: item.image_url || '',
            sort: item.sort_value || '',
            alt: item.text || ''
          }
          this.state.costume_images.push(newItem);
        })

      } else {
        this.state.costume_images.push();
      }
      this.setState({
        ...this.state
      })
    } else {
      Costumes.actions.getCostume.request({id: this.props.params.id}).then(res => {
        if(res && res.data) {
          this.state.name = res.data.data.costume.name;
          this.state.code = res.data.data.costume.code;
          this.state.type = res.data.data.costume.type;
          this.state.sex = res.data.data.costume.sex;

          let dataNewStudio = res.data.data.studios_can_work.map(item => {
            this.state.dataUpdateStudio.push(item.id)
          });

          let dataNewSize = res.data.data.sizes.map(item => {
            let itemSize = item.id;
            this.state.dataUpdateSize.push(itemSize);
          });

          this.state.costume_images = [];
          if(res.data.data.images.length > 0) {
            res.data.data.images.map(item => {
              let newItem = {
                id: item.id,
                imagePreviewUrl: item.image_url || '',
                sort: item.sort_value || '',
                alt: item.text || ''
              }
              this.state.costume_images.push(newItem);
            })
          } else {
            this.state.costume_images.push({})
          }

          this.state.studios_can_work = this.state.dataUpdateStudio;
          this.state.size = this.state.dataUpdateSize;
          this.state.description = res.data.data.costume.description;
          this.state.matching_costume_code = res.data.data.costume.matching_costume_code || '';
          this.setState({
            ...this.state
          })
        }
      }).catch(err => {
        Toastr(msg.fail, 'error')
      })
    }
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  createCostume(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = {
        name: this.state.name,
        code: this.state.code,
        type: this.state.type,
        sex: Number(this.state.sex),
        studios_can_work: this.state.studios_can_work ? this.state.studios_can_work : [],
        sizes: this.state.size,
        description: this.state.description,
        matching_costume_code: this.state.matching_costume_code,
      }
      params.costume_images = [];
      this.state.costume_images.map(item => {
        let newItem = {
          image_url: item.imagePreviewUrl,
          text: item.alt,
          sort_value: item.sort
        }
        params.costume_images.push(newItem);
      })

      Costumes.actions.postCostume.request('',params).then(res => {
        Toastr(this.state.name + ' ' + msg.createCostume, 'success');
        this.updateSystemData();
        this.props.history.push('/costumes');
      }).catch(err => {
        if(err.response) {
          Toastr(err.response.data.message, 'error');
        }
        this.state.loading = false;
        this.setState({
          ...this.state
        })
      })
    }
    return;
  }

  updateCostume(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = {
        name: this.state.name,
        code: this.state.code,
        type: this.state.type,
        sex: Number(this.state.sex),
        studios_can_work: this.state.studios_can_work ? this.state.studios_can_work : [],
        sizes: this.state.size,
        description: this.state.description,
        matching_costume_code: this.state.matching_costume_code,
      }

      params.costume_images = [];
      this.state.costume_images.map(item => {
        let newItem = {
          id: item.id,
          image_url: item.imagePreviewUrl,
          text: item.alt,
          sort_value: item.sort
        }
        if (item.id) {
          newItem.id = item.id
        }
        params.costume_images.push(newItem);
      })

      Costumes.actions.updateCostume.request({id: this.props.params.id},params).then(res => {
        Toastr(this.state.name + ' ' + msg.updateCostume, 'success');
        this.updateSystemData();
        this.goBack();
      }).catch(err => {
        if(err.response) {
          Toastr(err.response.data.message, 'error');
        }
        this.state.loading = false;
        this.setState({
          ...this.state
        })
      })
    }
    return;
  }

  validateSubmitForm() {
    let pass = true;
    this.props.validators['form'].map(validator => {
      if(pass) {
        pass = validator.validate();
      } else {
        validator.validate();
      }
    })
    return pass;
  }

  checkAll() {
    this.checkBox.refs.wrappedComponent.checkAll();
  }

  unCheckAll() {
    this.checkBox.refs.wrappedComponent.unCheckAll();
  }

  componentWillUnmount() {
    this.props.validators['form'] = [];
  }

  goBack() {
    this.props.dispatch({type: 'COSTUME_GO_BACK'});
    this.props.history.push('/costumes');
  }

  updateSystemData() {
    this.props.dispatch(updateSystemData('listDataCostume')).then(res => {
      if(res.data) {
        this.props.dispatch({type: 'UPDATE_SYSTEM_SUB_DATA', data: res.data, key: 'listDataCostume'})
      }
    })
  }

  pushItem(data) {
    this.state.costume_images.push(data);
    this.setState({...this.state});
    return (this.state.costume_images.length - 1)
  }

  pushItemResult(data, index) {
    this.state.costume_images[index] = data;
    this.setState({...this.state});
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>衣装情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>衣装情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container'>
          <form className='search-form' method='javascript:voild(0)'>
            <div className='col-sm-12'>
              <Input className='col-sm-4 mb15' label='衣装コード' require={true} bindValidator={this} type='text' channel='form' maxLength='40' name='Name' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
              <DropDown className='col-sm-4 mb15' label='タイプ'require={true} bindValidator={this} type='text' channel='form' options={this.state.dataStyle} keyName='value' valueName='name' value={this.state.type} onChange={this.onChange.bind(this, 'type')}/>
              <DropDown className='col-sm-4 mb15' label='性別' bindValidator={this} type='text' channel='form' options={this.state.dataSex} keyName='value' valueName='name' value={this.state.sex} onChange={this.onChange.bind(this, 'sex')}/>
              <Input className='col-sm-4 mb15' label='衣装名' require={true} bindValidator={this} type='text' channel='form' maxLength='40' name='Name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
            </div>
            <div className='col-sm-12 mb15 wrap-list-check-box'>
              <label className='form-label'>スタジオ</label>
              <div className='wrap-button-block mb15'>
                <span className='btn-close-confirm mr20' onClick={this.checkAll.bind(this)}>すべて選択する</span>
                <span className='btn-close-confirm' onClick={this.unCheckAll.bind(this)}>すべて解除</span>
              </div>
              <GroupCheckBox ref={(checkBox) => {this.checkBox = checkBox}} className='col-sm-12' name='studios_can_work' label='' data={this.state.dataStudioCanWork} value={this.state.studios_can_work} onChange={this.onChange.bind(this, 'studios_can_work')} keyName='id' valueName='name'/>
            </div>
            <div className='col-sm-12 mb15 wrap-list-check-box'>
              <GroupCheckBox className='col-sm-12' name='size' label='サイズ' data={this.state.listSize} value={this.state.size} onChange={this.onChange.bind(this, 'size')} keyName='id' valueName='value'/>
            </div>
            <div className='col-sm-12 mb15'>
              <TextArea className='col-sm-6' label='説明' maxLength='255' require={true} bindValidator={this} channel='form' name='description' value={this.state.description} onChange={this.onChange.bind(this, 'description')}/>
            </div>

            <div className='col-sm-12'>
              <div className = 'col-sm-12'>
                <UploadMultipleImage bindValidator={this} pushItemResult={this.pushItemResult.bind(this)} pushItem={this.pushItem.bind(this)} altLabel='alt' uploadMultiple={true} label='写真' hasAlt={true} hasSort={true} sortLabel='優先度' name='costume_images' data={this.state.costume_images} onChange={this.onChange.bind(this, 'costume_images')}/>
              </div>
            </div>

            <div className='col-sm-12'>
              <Input className='col-sm-4 mb15 clear-left' label='おそろい衣装コード' bindValidator={this} type='text' channel='form' maxLength='40' name='Name' value={this.state.matching_costume_code} onChange={this.onChange.bind(this, 'matching_costume_code')}/>
            </div>

            <ShowIf condition={this.props.edit == true}>
              <div className='form-group mb0'>
                <button disabled={this.state.loading} className='btn-confirm mr20 has-loading' onClick={this.updateCostume.bind(this)}>保存</button>
                <button disabled={this.state.loading} className='btn-close-confirm' onClick={this.goBack.bind(this)}>キャンセル</button>
              </div>
            </ShowIf>
            <ShowIf condition={this.props.edit != true}>
              <div className='form-group mb0'>
                <button disabled={this.state.loading} className='btn-confirm mr20 has-loading' onClick={this.createCostume.bind(this)}>保存</button>
                <button disabled={this.state.loading} className='btn-close-confirm' onClick={this.goBack.bind(this)}>キャンセル</button>
              </div>
            </ShowIf>
          </form>
        </div>
      </div>
    );
  }
}

Add.defaultProps={
  validators: {
    form: []
  },
  dataStudioCanWork: [],
  listSize: []
}

function bindStateToProps(state) {
  return {
    listCostumes: state.listCostumes.data,
    dataStudioCanWork: state.systemData.studioCanWork,
    listSize: state.systemData.listSize,
  }
}

export default connect(bindStateToProps)(withRouter(Add));

import React, { Component } from 'react';
import {Input, DropDown, TextArea, UploadMultipleImage, UploadImage, DatePicker} from 'components/inputform';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import {Costumes} from 'api';
import {News} from 'api';
import {System} from 'api';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';
import moment from 'moment';
import * as CONFIG from 'constants/datetime';


class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      chooseAdd: [
        {id: 'text', value: 'テキスト'},
        {id: 'image', value: '画像'}
      ],
      status: 1,
      dataStatus: [
        {id: 1, value: '公開'},
        {id: 2, value: '非公開'},
      ],
      dataSection: [{
        type: 'text',
        caption: '',
        text: '',
      }],
      title: '',
      subtitle: '',
      main_image_url: '',
      main_alt: '',
      open_time: '',
      close_time: '',
      content_image_url: '',
      image: '',
      main_image: [{}],
      content_image: [{}],
      text: '',
      chooseSize: [
        {id: 'normal', value: '標準'},
        {id: 'window', value: 'ウィンドウ幅'},
      ],
      size: 'normal',
      studio_code: '',
      url: '',
      h1: '',
      meta_title: '',
      meta_keywords: '',
      meta_description: '',
      ogp_title: '',
      ogp_description: '',
      ogp_image: '',
    }
  }

  componentDidMount() {
    if(this.props.params && this.props.params.id) {
      this.getInfo(this.props.params.id);
    }
  }

  getInfo(id) {
    News.actions.getNews.request({id: this.props.params.id}).then(res => {
      if(res && res.data) {
        let Data = res.data.data.news;
        let dataSeo = res.data.data.seo;
        this.state.title = Data.title;
        this.state.subtitle = Data.subtitle;
        this.state.open_time = Data.open_time;
        this.state.close_time = Data.close_time;
        this.state.status = Data.status;
        this.state.main_image_url = Data.main_image_url;
        this.state.text = Data.text;
        this.state.studio_code = Data.studio_code || '',
        this.state.dataSection = [];

        this.state.url = dataSeo.url ? dataSeo.url : '';
        this.state.h1 = dataSeo.h1 ? dataSeo.h1 : '';
        this.state.meta_title = dataSeo.meta_title ? dataSeo.meta_title : '';
        this.state.meta_keywords = dataSeo.meta_keywords ? dataSeo.meta_keywords : '';
        this.state.meta_description = dataSeo.meta_description ? dataSeo.meta_description : '';
        this.state.ogp_title = dataSeo.ogp_title ? dataSeo.ogp_title : '';
        this.state.ogp_description = dataSeo.ogp_description ? dataSeo.ogp_description : '';
        this.state.ogp_image = dataSeo.ogp_image ? dataSeo.ogp_image : '';

        let newItem = [{
          imagePreviewUrl: Data.main_image_url || '',
          alt: Data.text || '',
          size: Data.size || '',
        }];
        this.state.main_image = newItem;
        if(Data.content && Data.content.length > 0) {
          Data.content.map((item, index) => {
            if (item.type == "text") {
              let contentText = {
                type: 'text',
                caption: item.caption,
                text: item.text,
              };
              this.state.dataSection.push(contentText);
            } else if (item.type == "image") {
              let contentText = {
                type: 'image',
                image: [{
                  imagePreviewUrl: item.url,
                  alt: item.alt,
                }],
                size: item.size
              };
              this.state.dataSection.push(contentText);
            }
          })
        }
        else {
          this.state.dataSection = [{}]
        }

        this.setState({
          ...this.state
        })
      }
    }).catch(err => {
      Toastr(msg.fail, 'error')
    })
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  onChangeDate(name, e) {
    this.state[name] = e;
    this.setState({
      ...this.state
    })
  }

  onChangeSection(name, index, e) {
    let dataSection = this.state.dataSection;
    if(name == 'type' && e.target.value == 'text') {
      dataSection[index] = {
          type: 'text',
          caption: '',
          text: '',
        };
    } else if(name == 'type' && e.target.value == 'image') {
      dataSection[index] = {
          type: 'image',
          image: [{}],
          size: 'normal'
        };
    } else if(name == 'alt' || name == 'url') {
      dataSection[index].image[0][name] = e.target.value;
    } else {
      dataSection[index][name] = e.target.value;
    }

    this.setState({
      dataSection
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      if(this.props.edit == true) {
        this.patchProcess()
      } else {
        this.postProcess();
      }
      return;
    }
  }

  postProcess() {
    let params = this.getParams();
    News.actions.postNews.request('',params).then(res => {
      Toastr(this.state.title + ' ' + msg.createNews, 'success');
      this.goBack();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.loading = false;
      this.setState({
        ...this.state
      })
    })
  }

  patchProcess() {
    let params = this.getParams();
    News.actions.updateNews.request({id: this.props.params.id},params).then(res => {
      Toastr(this.state.title + ' ' + msg.updateNews, 'success');
      this.goBack();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.loading = false;
      this.setState({
        ...this.state
      })
    })
  }

  getParams() {
    let content_image = [];
    if(this.state.dataSection && this.state.dataSection.length > 0) {
      this.state.dataSection.map(item => {
        if (item.type == "text") {
          let contentText = {
            type: 'text',
            caption: item.caption,
            text: item.text,
          };
          content_image.push(contentText);
        } else if (item.type == "image") {
          let contentText = {
            type: 'image',
            url: item.image[0].imagePreviewUrl,
            alt: item.image[0].alt,
            size: item.size
          };
          content_image.push(contentText);
        }
      })
    } else {
      content_image = []
    }

    let params = {
      text: this.state.text,
      title: this.state.title,
      subtitle: this.state.subtitle,
      main_image_url: this.state.main_image_url,
      open_time: this.state.open_time ? moment(this.state.open_time).format(CONFIG.DateTimeFormat) : '',
      close_time: this.state.close_time ? moment(this.state.close_time).format(CONFIG.DateTimeFormat) : '',
      status: this.state.status,
      contents: content_image,
      studio_code: this.state.studio_code || '',
      seo: {
        url: this.state.url ? this.state.url : '',
        h1: this.state.h1 ? this.state.h1 : '',
        meta_title: this.state.meta_title ? this.state.meta_title : '',
        meta_keywords: this.state.meta_keywords ? this.state.meta_keywords : '',
        meta_description: this.state.meta_description ? this.state.meta_description : '',
        ogp_title: this.state.ogp_title ? this.state.ogp_title : '',
        ogp_description: this.state.ogp_description ? this.state.ogp_description : '',
        ogp_image: this.state.ogp_image ? this.state.ogp_image : ''
      }
    }
    return params;
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

  componentWillUnmount() {
    this.props.validators['form'] = [];
  }

  goBack() {
    this.props.dispatch({type: 'NEWS_GO_BACK'});
    this.props.history.push('/news');
  }
  removeImage(name) {
    this.state[name] = '';
    this.setState({
      ...this.state
    })
  }
  removeSection(index, e) {
    if(this.state.dataSection.length == 1) {
      return;
    }
    let dataSectionSlice = this.state.dataSection;
    dataSectionSlice.splice(index, 1);
    this.setState({
      dataSection: dataSectionSlice
    })
  }
  addSection() {
    let data = {
      type: 'text',
      caption: '',
      text: '',
    };
    this.state.dataSection.push(data);
    this.setState({...this.state})
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>ニュース情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>ニュース情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container'>
          <form className='search-form' method='javascript:voild(0)'>

            <div className='col-sm-12'>
              <Input className='col-sm-12 mb15' label='タイトル' require={true} bindValidator={this} type='text' channel='form' maxLength={false} name='Name' value={this.state.title} onChange={this.onChange.bind(this, 'title')}/>
              <Input className='col-sm-12 mb15' label='サブタイトル' require={true} bindValidator={this} type='text' channel='form' maxLength={false} name='Name' value={this.state.subtitle} onChange={this.onChange.bind(this, 'subtitle')}/>
            </div>

            <div className='col-sm-12 pr30 pl30'>
              <UploadMultipleImage multi={false} require={true} requirealt={false} channel='form' bindValidator={this} label='メイン画像' hasAlt={true} hasSort={false} altLabel="メイン画像 alt" name='main_image' data={this.state.main_image} onChangeFile={this.onChange.bind(this, 'main_image_url')} onChangeAlt={this.onChange.bind(this, 'text')}/>
            </div>
            <div className='col-sm-12 pr30 pl15'>
              <Input className='col-sm-4 mb15 clear-left' label='スタジオコード' bindValidator={this} type='text' channel='form' maxLength='255' name='studio' value={this.state.studio_code} onChange={this.onChange.bind(this, 'studio_code')}/>
            </div>

            <div className='col-sm-12'>
              <DatePicker className='col-xs-6 mb15' label='公開開始日時' require bindValidator={this} channel='form' timeFormat={CONFIG.TimeFormat} value={this.state.open_time} onChange={this.onChangeDate.bind(this, 'open_time')} />
              <DatePicker className='col-xs-6 mb15' label='公開終了日時' timeFormat={CONFIG.TimeFormat} value={this.state.close_time} onChange={this.onChangeDate.bind(this, 'close_time')}/>
            </div>

            <div className='col-sm-12'>
              <DropDown className='col-xs-6 mb15 clear-left' label='ステータス' require bindValidator={this} channel='form' options={this.state.dataStatus} keyName='id' valueName='value' value={this.state.status} onChange={this.onChange.bind(this, 'status')}/>
            </div>
            <div className='col-xs-12 mb15'>
              <Input label='h1' className='col-xs-12 mb15' name='h1' value={this.state.h1} onChange={this.onChange.bind(this, 'h1')} require bindValidator={this} channel='form'/>
              <Input label='title' className='col-xs-12 mb15' name='meta_title' value={this.state.meta_title} onChange={this.onChange.bind(this, 'meta_title')} require bindValidator={this} channel='form'/>
              <Input label='meta:keywords' className='col-xs-12 mb15' name='meta_keywords' value={this.state.meta_keywords} onChange={this.onChange.bind(this, 'meta_keywords')} require bindValidator={this} channel='form'/>
              <TextArea label='meta:description' maxLength={1023} className='col-xs-12' name='meta_description' value={this.state.meta_description} onChange={this.onChange.bind(this, 'meta_description')} require bindValidator={this} channel='form'/>
            </div>
            <div className='col-xs-12 mb15'>
              <Input label='og:title' className='col-xs-12 mb15' name='ogp_title' value={this.state.ogp_title} onChange={this.onChange.bind(this, 'ogp_title')} require bindValidator={this} channel='form'/>
              <TextArea label='og:description' maxLength={1023} className='col-xs-12 mb15' name='ogp_description' value={this.state.ogp_description} onChange={this.onChange.bind(this, 'ogp_description')} require bindValidator={this} channel='form'/>
            </div>
            {
              this.state.dataSection && this.state.dataSection.length > 0 && this.state.dataSection.map((item, index) => {
              return (
                <div className='col-sm-12 pr30 pl30 mb15 section-add' key={index}>
                  <ShowIf condition={item.type == 'text'}>
                    <div className='clear-left box-border col-sm-12 pl0 pr0'>
                      {this.state.dataSection.length > 1 ? <button type='button' className='btn-confirm btn-red btn-remove-seaction' onClick={this.removeSection.bind(this, index)}>削除</button> : ''}
                      <DropDown className='col-xs-6 mb15 clear-left mt15' label='' require bindValidator={this} channel='form' options={this.state.chooseAdd} keyName='id' valueName='value' value={item.type} onChange={this.onChangeSection.bind(this, 'type', index)}/>
                      <Input className='col-sm-12 mb15 clear-left' label='見出し' require={false} bindValidator={this} type='text' channel='form' maxLength={false} name='Name' value={item.caption} onChange={this.onChangeSection.bind(this, 'caption', index)}/>
                      <TextArea className='col-sm-12 mb15 ml0 mr0' label='テキスト' require bindValidator={this} channel='form' maxLength={false} name='business_hours' value={item.text} onChange={this.onChangeSection.bind(this, 'text', index)}/>
                    </div>
                  </ShowIf>

                  <ShowIf condition={item.type == 'image'}>
                    <div className='clear-left box-border col-sm-12'>
                      {this.state.dataSection.length > 1 ? <button type='button' className='btn-confirm btn-red btn-remove-seaction' onClick={this.removeSection.bind(this, index)}>削除</button> : ''}
                      <DropDown className='col-xs-6 pl0 mt15 clear-left' label='' require bindValidator={this} channel='form' options={this.state.chooseAdd} keyName='id' valueName='value' value={item.type} onChange={this.onChangeSection.bind(this, 'type', index)}/>
                      <div className='col-sm-12 pl0 pr0 mt15'>
                        <UploadMultipleImage multi={false} require={true} requirealt={false} channel='form' bindValidator={this} label='メイン画像' hasAlt={true} hasSort={false} altLabel="メイン画像 alt" name='content_image' data={this.state.content_image} data={item.image} onChangeFile={this.onChangeSection.bind(this, 'url', index)} onChangeAlt={this.onChangeSection.bind(this, 'alt', index)}/>
                      </div>
                      <DropDown className='col-xs-6 mb15 clear-left pl0' label='画像サイズ' require bindValidator={this} channel='form' options={this.state.chooseSize} keyName='id' valueName='value' value={item.size} onChange={this.onChangeSection.bind(this, 'size', index)}/>

                    </div>
                  </ShowIf>
                </div>
              );
            })
          }

            <div className='col-sm-12 mb15 clear-left'>
              <button type="button" className='item-link-action btn-confirm ml15' onClick={this.addSection.bind(this)}>セクションを追加する</button>
            </div>

            <div className='form-group mb0'>
              <button type="button" disabled={this.state.loading} className='btn-confirm mr20 has-loading' onClick={this.handleSubmit.bind(this)}>保存</button>
              <button disabled={this.state.loading} className='btn-close-confirm' onClick={this.goBack.bind(this)}>キャンセル</button>
            </div>
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
  listSize: []
}

function bindStateToProps(state) {
  return {
    listNews: state.listNews.data,
  }
}

export default connect(bindStateToProps)(withRouter(Add));
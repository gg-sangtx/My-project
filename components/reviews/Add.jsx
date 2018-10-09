import React, { Component } from 'react';
import {Input, DropDown, TextArea, UploadMultipleImage, UploadImage, DatePicker} from 'components/inputform';
import {ShowIf} from 'components/utils';
import { connect } from 'react-redux';
import {Costumes} from 'api';
import {Reviews} from 'api';
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
      category_id: 1,
      dataStatus: [
        {id: 1, name: '確認待ち'},
        {id: 2, name: '公開'},
        {id: 3, name: '非公開'},
        {id: 4, name: '保留'},
      ],
      dataCategory: [
        {id: 1, name: '撮影レポート'},
        {id: 2, name: 'お客様レビュー'},
      ],
      dataSection: [{
        type: 'text',
        caption: '',
        text: '',
      }],
      booking_code: '',
      title: '',
      description: '',
      tag: '',
      main_image_url: '',
      main_alt: '',
      open_time: '',
      close_time: '',
      content_image_url: '',
      image: '',
      main_image: [{}],
      content_image: [{}],
      main_image_text: '',
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
    Reviews.actions.getReviews.request({id: this.props.params.id}).then(res => {
      if(res && res.data) {
        let Data = res.data.data.review;
        let dataSeo = res.data.data.seo;

        this.state.booking_code = Data.booking_code,
        this.state.title = Data.title;
        this.state.description = Data.description;
        this.state.open_time = Data.open_time;
        this.state.close_time = Data.close_time;
        this.state.status = Data.status;
        this.state.main_image_url = Data.main_image_url;
        this.state.main_alt = Data.text;

        this.state.url = dataSeo.url ? dataSeo.url : '';
        this.state.h1 = dataSeo.h1 ? dataSeo.h1 : '';
        this.state.meta_title = dataSeo.meta_title ? dataSeo.meta_title : '';
        this.state.meta_keywords = dataSeo.meta_keywords ? dataSeo.meta_keywords : '';
        this.state.meta_description = dataSeo.meta_description ? dataSeo.meta_description : '';
        this.state.ogp_title = dataSeo.ogp_title ? dataSeo.ogp_title : '';
        this.state.ogp_description = dataSeo.ogp_description ? dataSeo.ogp_description : '';
        this.state.ogp_image = dataSeo.ogp_image ? dataSeo.ogp_image : '';

        let newDataTag = '';
        if(res.data.data.tags && res.data.data.tags.length > 0) {
          let dataTag = res.data.data.tags.map(item => {
            newDataTag += ' ' + '#'+item.text;
          })
        }

        this.state.tag = newDataTag || '';

        this.state.dataSection = [];
        let newItem = [{
          imagePreviewUrl: Data.main_image_url || '',
          alt: Data.text || ''
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
                }]
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
    }
    if(name == 'type' && e.target.value == 'image') {
      dataSection[index] = {
          type: 'image',
          image: [{}]
        };
    }
    if(name == 'caption' || name == 'text') {
      dataSection[index][name] = e.target.value;
    }

    if(name == 'alt' || name == 'url') {
      dataSection[index].image[0][name] = e.target.value;
    }

    this.setState({
      dataSection,
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
        this.patchProcess();
      } else {
        this.postProcess();
      }
      return;
    }
  }

  patchProcess() {
    let params = this.getParams();
    Reviews.actions.updateReviews.request({id: this.props.params.id},params).then(res => {
      Toastr(msg.updateReviews, 'success');
      this.goBack();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0 && err.response.data) {
        err.response.data.errors.map(item => {
          Toastr(item, 'error');
        })
      }
      this.state.loading = false;
      this.setState({
        ...this.state
      })
    })
  }

  postProcess() {
    let params = this.getParams();
    Reviews.actions.postReviews.request('',params).then(res => {
      Toastr(msg.createReviews, 'success');
      this.goBack();
    }).catch(err => {
      if(err.response && err.response.data.errors.length > 0 && err.response.data) {
        err.response.data.errors.map(item => {
          Toastr(item, 'error');
        })
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
            alt: item.image[0].alt
          };
          content_image.push(contentText);
        }
      })
    } else {
      content_image = []
    }

    let params = {
      booking_code: this.state.booking_code,
      text: this.state.main_image_text,
      title: this.state.title,
      description: this.state.description,
      main_image_url: this.state.main_image_url,
      open_time: this.state.open_time ? moment(this.state.open_time).format(CONFIG.DateTimeFormat) : '',
      close_time: this.state.close_time ? moment(this.state.close_time).format(CONFIG.DateTimeFormat) : '',
      status: this.state.status,
      contents: content_image,
      tag: this.state.tag,
      category_id: this.state.category_id,
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
    this.props.dispatch({type: 'REVIEWS_GO_BACK'});
    this.props.history.push('/reviews');
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
            <h2 className='heading-2'>ストーリー情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>ストーリー情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container'>
          <form className='search-form' method='javascript:voild(0)'>
            <div className='col-sm-12'>
              <Input className='col-sm-6 mb15' label='予約コード' type='text' channel='form' maxLength={false} name='Booking' value={this.state.booking_code} onChange={this.onChange.bind(this, 'booking_code')}/>
            </div>

            <div className='col-sm-12'>
              <Input className='col-sm-12 mb15' label='タイトル' require={true} bindValidator={this} type='text' channel='form' maxLength={false} name='Name' value={this.state.title} onChange={this.onChange.bind(this, 'title')}/>
            </div>

            <div className='col-sm-12'>
              <TextArea className='col-sm-12 mb15' label='ディスクリプション' require={true} bindValidator={this} type='text' maxLength={false} channel='form' name='Name' value={this.state.description} onChange={this.onChange.bind(this, 'description')}/>
            </div>

            <div className='col-sm-12'>
              <Input className='col-sm-12 mb15' label='タグ' type='text' maxLength='40' name='Tag' maxLength={false} value={this.state.tag} onChange={this.onChange.bind(this, 'tag')}/>
            </div>

            <div className='col-sm-12 pr30 pl30'>
              <UploadMultipleImage multi={false} require={true} requirealt={false} channel='form' bindValidator={this} label='メイン画像' hasAlt={true} hasSort={false} altLabel="メイン画像 alt" name='main_image' data={this.state.main_image} onChangeFile={this.onChange.bind(this, 'main_image_url')} onChangeAlt={this.onChange.bind(this, 'main_image_text')}/>
            </div>

            <div className='col-sm-12'>
              <DatePicker className='col-xs-6 mb15' label='公開開始日時' require bindValidator={this} channel='form' timeFormat={CONFIG.TimeFormat} value={this.state.open_time} onChange={this.onChangeDate.bind(this, 'open_time')} />
              <DatePicker className='col-xs-6 mb15' label='公開終了日時' timeFormat={CONFIG.TimeFormat} value={this.state.close_time} onChange={this.onChangeDate.bind(this, 'close_time')}/>
            </div>

            <div className='col-sm-12 mb15'>
              <DropDown className='col-xs-6 mb15 clear-left' label='ステータス' require bindValidator={this} channel='form' options={this.state.dataStatus} keyName='id' valueName='name' value={this.state.status} onChange={this.onChange.bind(this, 'status')}/>
              <DropDown className='col-xs-6 mb15' label='カテゴリ' require bindValidator={this} channel='form' options={this.state.dataCategory} keyName='id' valueName='name' value={this.state.category_id} onChange={this.onChange.bind(this, 'category_id')}/>
            </div>
            <div className='col-xs-12 mb15'>
              <Input label='h1' className='col-xs-12 mb15' name='h1' value={this.state.h1} onChange={this.onChange.bind(this, 'h1')} require bindValidator={this} channel='form'/>
              <Input label='title' className='col-xs-12 mb15' name='meta_title' value={this.state.meta_title} onChange={this.onChange.bind(this, 'meta_title')} require bindValidator={this} channel='form'/>
              <Input label='meta:keywords' className='col-xs-12 mb15' name='meta_keywords' value={this.state.meta_keywords} onChange={this.onChange.bind(this, 'meta_keywords')} require bindValidator={this} channel='form'/>
              <TextArea label='meta:description' maxLength={1023} className='col-xs-12' name='meta_description' value={this.state.meta_description} onChange={this.onChange.bind(this, 'meta_description')} require bindValidator={this} channel='form'/>
            </div>
            <div className='col-xs-12'>
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
                      <Input className='col-sm-12 mb15 clear-left' label='見出し' require={false} bindValidator={this} type='text' channel='form' maxLength={false} name='Name' value={item.caption || ''} onChange={this.onChangeSection.bind(this, 'caption', index)}/>
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
    // listSize: state.systemData.listSize,
  }
}

export default connect(bindStateToProps)(withRouter(Add));

import React, { Component } from 'react';
import { Input, DropDown, TextArea} from 'components/inputform';
import { connect } from 'react-redux';
import { FAQ } from 'api';
import {ShowIf} from 'components/utils';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      category_id: '1',
      sort_value: '',
      answer: '',
      question: '',
      listCategory: this.props.listCategory || []
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.listCategory != this.props.listCategory) {
      this.state.listCategory = nextProps.listCategory;
    }
    this.setState({...this.state});
  }

  componentDidMount() {
    if(this.props.edit == true) {
      let data = [...this.props.dataList];
      let dataFilter = data.filter(state => {
        return state.id == this.props.params.id
      });
      if (dataFilter.length > 0) {
        this.getData(dataFilter[0]);
      } else {
        this.getDetail();
      }
    }
  }

  getDetail() {
    FAQ.actions.get.request({id: this.props.params.id}).then(res => {
      if(res.data) {
        let dataDetail = res.data.data.faq;
        this.getData(dataDetail);
      }
    }).catch(err => {
      if(err && err.response) {
        let message = err.response.data.errors;
        if(typeof message == String) {
          Toastr(message, 'error');
        } else if (message.length > 0) {
          message.map(error => {
            Toastr(error, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error')
        }
      } else {
        Toastr(msg.systemFail, 'error')
      }
    })
  }

  getData(data) {
    this.state.category_id = data.category_id || '';
    this.state.sort_value = data.sort_value || '';
    this.state.answer = data.answer || '';
    this.state.question = data.question || '';
    this.setState({...this.state});
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  getParams() {
    let params = {};
    params.category_id = this.state.category_id ? this.state.category_id : null;
    params.sort_value = this.state.sort_value ? this.state.sort_value : null;
    params.answer = this.state.answer ? this.state.answer : null;
    params.question = this.state.question ? this.state.question : null;
    return params
  }

  createFAQ(e) {
    e.preventDefault();
    let params = this.getParams();
    if(this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({...this.state});
      if(this.props.edit == true) {
        this.patchProcess(params);
      } else {
        this.postProcess(params);
      }
    }
  }

  postProcess(params) {
    FAQ.actions.create.request('', params).then(res => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(msg.createFAQ, 'success');
      this.goBack();
    }).catch(err => {
      if(err && err.response) {
        let message = err.response.data.errors;
        if(typeof message == String) {
          Toastr(message, 'error');
        } else if (message.length > 0) {
          message.map(error => {
            Toastr(error, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error')
        }
      } else {
        Toastr(msg.systemFail, 'error')
      }
      this.state.loading = false;
      this.setState({...this.state});
    })
  }

  patchProcess(params) {
    FAQ.actions.update.request({id: this.props.params.id}, params).then(res => {
      this.state.loading = false;
      this.setState({...this.state});
      Toastr(msg.updateFAQ, 'success');
      this.goBack();
    }).catch(err => {
      if(err && err.response) {
        let message = err.response.data.errors;
        if(typeof message == String) {
          Toastr(message, 'error');
        } else if (message.length > 0) {
          message.map(error => {
            Toastr(error, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error')
        }
      } else {
        Toastr(msg.systemFail, 'error')
      }
      this.state.loading = false;
      this.setState({...this.state});
    })
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
    this.props.dispatch({type: 'FAQ_GO_BACK'});
    this.props.history.push('/faqs');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>FAQ情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>FAQ情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>

            <DropDown className='col-xs-4 mb15' label='カテゴリ' require bindValidator={this} channel='form' options={this.state.listCategory} keyName='key' valueName='value' name='category_id' value={this.state.category_id} onChange={this.onChange.bind(this, 'category_id')}/>
            <TextArea className='col-sm-12 mb15' label='質問' require bindValidator={this} channel='form' maxLength='none' name='question' value={this.state.question} onChange={this.onChange.bind(this, 'question')}/>
            <TextArea className='col-sm-12 mb15' label='テキスト' require bindValidator={this} channel='form' maxLength='none' name='answer' value={this.state.answer} onChange={this.onChange.bind(this, 'answer')}/>
            <Input className='col-xs-4 mb15' label='優先度' require bindValidator={this} channel='form' type='text' maxLength='40' name='sort_value' value={this.state.sort_value} onChange={this.onChange.bind(this, 'sort_value')}/>

            <div className='col-xs-12 pt15'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.createFAQ.bind(this)}>保存</button>
              <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
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
  dataList: [],
  listCategory: [],
}

function bindStateToProps(state) {
  return {
    dataList: state.listFAQ.data,
    listCategory: state.systemData.listCategory
  }
}

export default connect(bindStateToProps)(withRouter(Add))
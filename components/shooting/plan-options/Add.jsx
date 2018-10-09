import React, { Component } from 'react';
import { Input, InputCurrency } from 'components/inputform';
import { connect } from 'react-redux';
import { PlanOptions } from 'api';
import {ShowIf} from 'components/utils';
import {Toastr} from 'components/modules/toastr';
import {msg} from "constants/message";
import { withRouter } from 'react-router';

class Add extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      code: '',
      name: '',
      price: '',
      janCode: ''
    }
  }

  componentDidMount() {
    if(this.props.params && this.props.params.id) {
      this.getInfo(this.props.params.id);
    }
  }

  getInfo(id) {
    //get data if has store
    let dataFilter = [];
    if(this.props.dataPlanOptions.length > 0) {
      dataFilter = this.props.dataPlanOptions.filter(state => {
        return state.id == id
      })
    }
    if(dataFilter.length > 0) {
      this.state.code = dataFilter[0].code;
      this.state.name = dataFilter[0].name;
      this.state.price = dataFilter[0].price;
      this.state.sortValue = dataFilter[0].sort_value;
      this.state.janCode = dataFilter[0].jan_code;
      this.setState({
        ...this.state
      })
    } else {
      PlanOptions.actions.getPlanOptions.request({id: id}).then(res => {
        if(res && res.data) {
          let data = res.data.data;
          this.state.code = data.code;
          this.state.name = data.name;
          this.state.price = data.price;
          this.state.sortValue = data.sort_value;
          this.state.janCode = data.jan_code;
          this.setState({
            ...this.state
          })
        }
      }).catch(err => {
        if(err.response && err.response.data.errors.length > 0) {
          err.response.data.errors.map((errors, i) => {
            Toastr(errors, 'error');
          })
        } else {
          Toastr(msg.systemFail, 'error');
        }
      })
    }
  }

  getData(data) {
    this.state.code = data.code ? data.code : '';
    this.state.name = data.name ? data.name : '';
    this.state.price = data.price ? data.price : '';
    this.state.janCode = data.janCode ? data.jan_code : '';
    this.setState({...this.state})
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  createPlanOptions(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = this.getParams();
      PlanOptions.actions.postPlanOptions.request('',params).then(res => {
        Toastr(this.state.name + ' ' + msg.createPlanOptions, 'success');
        this.props.history.push('/planOptions');
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
    return;
  }

  updatePlanOptions(e) {
    e.preventDefault();
    if(this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      let params = {
        name: this.state.name,
        code: this.state.code,
        price: this.state.price,
        jan_code: this.state.janCode
      }

      PlanOptions.actions.updatePlanOptions.request({id: this.props.params.id},params).then(res =>{
        Toastr(this.state.name + ' ' + msg.updatePlanOptions, 'success');
        this.props.history.push('/planOptions');
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
    return;
  }

  getParams() {
    let params = {
      name: this.state.name,
      code: this.state.code,
      price: this.state.price,
      jan_code: this.state.janCode
    }
    return params
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
    this.props.dispatch({type: 'STUDIO_GO_BACK'});
    this.props.history.push('/planOptions');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>撮影オプション情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>撮影オプション情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>
            <Input className='col-xs-4 mb15 clear-left' label='撮影オプションコード' require bindValidator={this} channel='form' type='text' maxLength='40' name='code' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
            <Input className='col-xs-4 mb15 clear-left' label='JANコード' require bindValidator={this} channel='form' type='text' maxLength='40' name='name' value={this.state.janCode} onChange={this.onChange.bind(this, 'janCode')} />
            <Input className='col-xs-4 mb15 clear-left' label='オプション名' require bindValidator={this} channel='form' type='text' maxLength='40' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
            <InputCurrency className="col-xs-4 mb15 clear-left" label="単位金額" require bindValidator={this} channel='form' type='number' maxLength='40' name='price' value={this.state.price} onChange={this.onChange.bind(this, 'price')} />
            <ShowIf condition={this.props.edit == true}>
              <div className='col-xs-12 pt15'>
                <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.updatePlanOptions.bind(this)}>保存</button>
                <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
              </div>
            </ShowIf>
            <ShowIf condition={this.props.edit != true}>
              <div className='col-xs-12 pt15'>
                <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.createPlanOptions.bind(this)}>保存</button>
                <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
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
  dataPlanOptions: []
}

function bindStateToProps(state) {
  return {
    dataPlanOptions: state.listPlanOptions.data
  }
}

export default connect(bindStateToProps)(withRouter(Add))

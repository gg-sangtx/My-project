import React, { Component } from 'react';
import { Input, InputCurrency } from 'components/inputform';
import { connect } from 'react-redux';
import { Plans } from 'api';
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
      WeekDayPrice: '',
      HolidayFrice: '',
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
    if(this.props.dataPlans.length > 0) {
      dataFilter = this.props.dataPlans.filter(state => {
        return state.id == id
      })
    }
    if(dataFilter.length > 0) {
      this.state.code = dataFilter[0].code;
      this.state.name = dataFilter[0].name;
      this.state.WeekDayPrice = dataFilter[0].weekday_price;
      this.state.HolidayFrice = dataFilter[0].holiday_price;
      this.state.janCode = dataFilter[0].jan_code;
      this.setState({
        ...this.state
      })
    } else {
      Plans.actions.getPlans.request({ id: id }).then(res => {
        if(res && res.data) {
          let data = res.data.data;
          this.state.code = data.code;
          this.state.name = data.name;
          this.state.WeekDayPrice = data.weekday_price;
          this.state.HolidayFrice = data.holiday_price;
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
    this.state.WeekDayPrice = data.WeekDayPrice ? data.WeekDayPrice : '';
    this.state.HolidayFrice = data.HolidayFrice ? data.HolidayFrice : '';
    this.state.janCode = data.name ? data.janCode : '';
    this.setState({...this.state})
  }

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({
      ...this.state
    })
  }

  getParams() {
    let params = {
      name: this.state.name,
      code: this.state.code,
      weekday_price: this.state.WeekDayPrice,
      holiday_price: this.state.HolidayFrice,
      jan_code: this.state.janCode
    }
    return params
  }

  handelSunbmit(e) {
    e.preventDefault();
    if (this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({
        ...this.state
      })
      if(this.props.edit == true) {
        this.patchProcess()
      } else {
        this.postProcess()
      }
    }
  }

  postProcess() {
    let params = this.getParams();
    Plans.actions.postPlans.request('',params).then(res => {
      Toastr(this.state.name + ' ' + msg.createPlans, 'success');
      this.goBack()
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

  patchProcess(){
    let params = this.getParams();
    Plans.actions.updatePlans.request({id: this.props.params.id},params).then(res =>{
      Toastr(this.state.name + ' ' + msg.updatePlans, 'success');
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
    this.props.history.push('/plans');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <ShowIf condition={this.props.edit == true}>
            <h2 className='heading-2'>撮影費用情報 <small>編集</small></h2>
          </ShowIf>
          <ShowIf condition={this.props.edit != true}>
            <h2 className='heading-2'>撮影費用情報 <small>新規登録</small></h2>
          </ShowIf>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>
            <Input className='col-xs-12 col-sm-6 col-md-6 mb15' label='撮影費用コード' require bindValidator={this} channel='form' type='text' maxLength='255' name='code' value={this.state.code} onChange={this.onChange.bind(this, 'code')}/>
            <Input className='col-xs-12 col-sm-6 col-md-6 mb15' label='JANコード' require bindValidator={this} channel='form' type='text' maxLength='40' name='name' value={this.state.janCode} onChange={this.onChange.bind(this, 'janCode')} />
            <Input className='col-xs-12 col-sm-6 col-md-6 mb15' label='表示名' require bindValidator={this} channel='form' type='text' maxLength='255' name='name' value={this.state.name} onChange={this.onChange.bind(this, 'name')}/>
            <InputCurrency className="col-xs-12 col-sm-6 col-md-6 mb15" label="平日価格" require bindValidator={this} channel='form' type='number' name='WeekDayPrice' value={this.state.WeekDayPrice} onChange={this.onChange.bind(this, 'WeekDayPrice')} />
            <InputCurrency className="col-xs-12 col-sm-6 col-md-6 mb15" label="休日価格" require bindValidator={this} channel='form' type='number' name='HolidayFrice' value={this.state.HolidayFrice} onChange={this.onChange.bind(this, 'HolidayFrice')} />
            <div className='col-xs-12 pt15'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.handelSunbmit.bind(this)}>保存</button>
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
  dataPlans: []
}

function bindStateToProps(state) {
  return {
    dataPlans: state.listPlans.data
  }
}

export default connect(bindStateToProps)(withRouter(Add))

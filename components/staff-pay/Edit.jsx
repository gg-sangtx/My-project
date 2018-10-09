import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Input, TextArea, Text } from 'components/inputform';
import { connect } from 'react-redux';
import { StaffPays } from 'api';
import {ShowIf} from 'components/utils';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import { withRouter } from 'react-router';
import moment from 'moment';

class Edit extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      date: '',
      staff_id: '',
      staff_name: '',
      wage_type: '',
      wage: '',
      working_hours: '',
      total_wage: '',
      memo: '',
      loading: false
    }
  }

  componentDidMount() {
    this.getDetail(this.props.params.id);
  }

  getDetail(id) {
    StaffPays.actions.get.request({id: id}).then(res => {
      if (res.data) {   
        let Data = res.data.data.staff_pay;
        this.state.date = Data.date ? Data.date : '';
        this.state.staff_id = Data.staff_id ? Data.staff_id : '';
        this.state.staff_name = Data.staff_name ? Data.staff_name : '';
        this.state.wage_type = Data.wage_type ? Data.wage_type : '';
        this.state.wage = Data.wage ? Data.wage : '';
        this.state.working_hours = Data.working_hours ? Data.working_hours : '';
        this.state.total_wage = Data.total_wage ? Data.total_wage : '';
        this.state.memo = Data.memo ? Data.memo : '';
        this.setState({...this.state})
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

  onChange(name, e) {
    this.state[name] = e.target.value;
    this.setState({...this.state})
  }

  updateStaffPay(e) {
    e.preventDefault();
    if(this.validateSubmitForm()) {
      this.state.loading = true;
      this.setState({...this.state});
      let params = {
        working_hours: this.state.working_hours ? this.state.working_hours : 0,  
        total_wage: this.state.total_wage ? this.state.total_wage : 0,
        memo: this.state.memo ? this.state.memo : null
      }
      StaffPays.actions.edit.request({id: this.props.params.id}, params).then(res => {
        Toastr(msg.updateStaffPays, 'success');
        this.state.loading = false;
        this.setState({...this.state});
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
        this.setState({...this.state});
      })      
    }
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

  goBack() {
    this.props.dispatch({type: 'STAFF_PAY_GO_BACK'});
    this.props.history.push('/staffPays');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>カメラマン／ヘアメイク報酬情報 <small>編集</small></h2>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>

            <Text className='col-xs-6 mb15' label='日付' value={this.state.date ? moment(String(this.state.date)).format('YYYY年MM月DD日') : ''}/>
            <Text className='col-xs-6 mb15 clear-left' label='カメラマン／ヘアメイクID' value={this.state.staff_id ? this.state.staff_id : ''}/>
            <Text className='col-xs-6 mb15' label='カメラマン／ヘアメイク名' value={this.state.staff_name ? this.state.staff_name : ''}/>
            <Text className='col-xs-6 mb15 clear-left' label='時給/日給' value={this.state.wage_type && this.state.wage_type == 1 ? '時給' : '日給'}/>
            
            <Text className='col-xs-6 mb15' label='時給/日給　金額' value={`¥${this.state.wage ? this.state.wage : ''}`}/>
            <Input className='col-xs-6 mb15' require bindValidator={this} channel='form' perLabel={this.state.wage_type == 1 ? "/h" : "/d"} hasUnit={true} label='勤務時間' name='working_hours' value={this.state.working_hours} onChange={this.onChange.bind(this, 'working_hours')}/>
            <Input className='col-xs-6 mb15' require bindValidator={this} channel='form' perLabel="円" hasUnit={true} label='報酬金額' name='total_wage' value={this.state.total_wage} onChange={this.onChange.bind(this, 'total_wage')}/>
            <TextArea className='col-sm-12 mb15' label='備考' maxLength='255' name='memo' value={this.state.memo} onChange={this.onChange.bind(this, 'memo')}/>

            <div className='col-xs-12 pt15'>
              <button className='btn-confirm mr20 has-loading' disabled={this.state.loading} onClick={this.updateStaffPay.bind(this)}>保存</button>
              <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Edit.defaultProps = {
  validators: {
    form: []
  }
}

export default connect()(withRouter(Edit))

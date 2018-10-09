import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Input, TextArea, Text } from 'components/inputform';
import { connect } from 'react-redux';
import { StaffPayForStaff } from 'api';
import {ShowIf} from 'components/utils';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import { withRouter } from 'react-router';
import moment from 'moment';

class Detail extends Component {
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
    StaffPayForStaff.actions.detail.request({id: id}).then(res => {
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

  goBack() {
    this.props.dispatch({type: 'STAFF_PAY_FOR_STAFF_GO_BACK'});
    this.props.history.push('/staff/staffPays');
  }

  render() {
    return (
      <div id='content-list-manager'>
        <div className='title-block'>
          <h2 className='heading-2'>報酬情報 <small>編集</small></h2>
        </div>
        <div className='addnew-container studio'>
          <form className={`search-form ${this.state.loading ? 'form-disable' : ''}`} method='javascript:voild(0)'>

            <Text className='col-xs-6 mb15' label='日付' value={this.state.date ? moment(String(this.state.date)).format('YYYY年MM月DD日') : ''}/>
            <Text className='col-xs-6 mb15 clear-left' label='時給/日給' value={this.state.wage_type && this.state.wage_type == 1 ? '時給' : '日給'}/>

            <Text className='col-xs-6 mb15' label='時給/日給　金額' value={`¥${this.state.wage ? this.state.wage : ''}`}/>
            <Text className='col-xs-6 mb15' label='勤務時間' value={this.state.working_hours} />
            <Text className='col-xs-6 mb15' label='報酬金額' value={this.state.total_wage} />
            <Text className='col-sm-12 mb15 text-area' label='備考' value={this.state.memo}/>

            <div className='col-xs-12 pt15'>
              <button className='btn-close-confirm' disabled={this.state.loading} onClick={this.goBack.bind(this)}>キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}


export default connect()(withRouter(Detail))

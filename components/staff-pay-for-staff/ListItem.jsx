import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { StaffPayForStaff } from 'api';
import {ShowIf} from 'components/utils';
import {msg} from "constants/message";
import {Toastr} from 'components/modules/toastr';
import moment from 'moment';
import cookie from 'react-cookie';
import { API_URL } from 'constants/config';

export default class ListItem extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false
    }
  }

  confirmItem() {
    this.state.loading = true;
    this.setState({...this.state})
    let params = {
      year: this.props.item.year,
      month: this.props.item.month
    }
    StaffPayForStaff.actions.confirm.request('', params).then(res => {
      Toastr(msg.confirmStaffPays, 'success')
      this.state.loading = false;
      this.setState({...this.state})
      this.itemComfirm();
    }).catch(err => {
      if(err.response.data.errors.length > 0) {
        err.response.data.errors.map((errors, i) => {
          Toastr(errors, 'error');
        })
      } else {
        Toastr(msg.systemFail, 'error');
      }
      this.state.loading = false;
      this.setState({...this.state})
    })
  }

  viewDaily() {
    this.props.viewDaily(this.props.item.month, this.props.item.year)
  }

  itemComfirm() {
    this.props.onItemCheck(this.props.count - 1);
  }

  render() {
    let Item = this.props.item;
    let token = cookie.load('accessToken');
    let URL_PDF_REMUNERATION = String(API_URL) + "/staff/staff-pays/download-pdf?month=" + Item.month + "&year=" + Item.year + "&token=" + token;

    return (
      <tr>
        <td> <span>{Item.year ? Item.year : ''}年{Item.month ? Item.month : ''}月</span></td>
        <td>{`¥${Item.total_wage ? Item.total_wage : ''}`}</td>
        <td>
          <ShowIf condition={Item.staff_confirm == true && Item.admin_confirm == true}>
            <div className='wrap-button-action'>{`済`}</div>
          </ShowIf>
          <ShowIf condition={Item.admin_confirm != true}>
            <div className='wrap-button-action'>{`報酬金額未確定`}</div>
          </ShowIf>
          <ShowIf condition={Item.staff_confirm != true && Item.admin_confirm == true}>
            <div className='wrap-button-action'>
              <button className='item-link-action btn-main has-loading' disabled={this.state.loading} onClick={this.confirmItem.bind(this)}>実行する</button>
            </div>
          </ShowIf>
        </td>
        <td>
          <ShowIf condition={Item.staff_confirm == true && Item.admin_confirm == true}>
            <div className='wrap-button-action'>
              <a className='item-link-action btn-main' href={URL_PDF_REMUNERATION}>PDF</a>
            </div>
          </ShowIf>
          <ShowIf condition={Item.staff_confirm != true || Item.admin_confirm != true}>
            <div className='wrap-button-action'>{`---`}</div>
          </ShowIf>
        </td>
        <td>
          <div className='wrap-button-action'>
            <span className='item-link-action btn-main' onClick={this.viewDaily.bind(this)}>編集</span>
          </div>
        </td>
      </tr>
    );
  }
}

ListItem.defaultProps = {
  dataSelected: []
}
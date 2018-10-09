import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { StaffPays } from 'api';
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
      dataSelected: this.props.dataSelected,
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataSelected != this.props.dataSelected) {
      this.state.dataSelected = nextProps.dataSelected;
      this.setState({...this.state})
    }
  }

  confirmItem() {
    this.state.loading = true;
    this.setState({...this.state})
    let params = {
      staff_pays: [
        {
          staff_id: this.props.item.staff_id,
          year: this.props.item.year,
          month: this.props.item.month
        }
      ]
    }
    StaffPays.actions.confirm.request('', params).then(res => {
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

  itemComfirm() {
    this.props.itemComfirm(this.props.count);
  }

  checkValue() {
    let item = this.props.item;
    let index = this.state.dataSelected.findIndex(itemX => itemX.staff_id == item.staff_id && itemX.month == item.month && itemX.year == item.year)

    if(index != -1) {
      return true
    } else {
      return false
    }
  }

  onChange(e) {
    this.props.onItemCheck(this.props.item);
  }

  render() {
    let Item = this.props.item;
    let token = cookie.load('accessToken');
    let URL_PDF_REMUNERATION = String(API_URL) + "/staff-pays/download-pdf?staff_id=" + Item.staff_id + "&month=" + Item.month + "&year=" + Item.year + "&type=1" + "&token=" + token;
    let URL_PDF_INVOICE = String(API_URL) + "/staff-pays/download-pdf?staff_id=" + Item.staff_id + "&month=" + Item.month + "&year=" + Item.year + "&type=2" + "&token=" + token;


    return (
      <tr className={this.checkValue() ? 'item-checked' : ''}>
        <td>
          <ShowIf condition={Item.admin_confirm != true}>
            <div className="item-check-box pr0">
              <input type="checkbox" className="form-checkbox" id={`Item${this.props.count}`} onChange={this.onChange.bind(this)} name={`Item${this.props.count}`} checked={this.checkValue()}/>
              <label className="checkmark"></label>
            </div>
          </ShowIf>
        </td>
        <td>{Item.year ? Item.year : ''}年{Item.month ? Item.month : ''}月</td>
        <td>{Item.staff_id ? Item.staff_id : ''}</td>
        <td>{Item.staff_name ? Item.staff_name : ''}</td>
        <td>{Item.wage_type && Item.wage_type == 1 ? '時給' : '日給'} ¥{Item.wage ? Item.wage : ''}</td>
        <td>{Item.working_hours ? Item.working_hours : ''}{Item.wage_type && Item.wage_type == 1 ? 'h' : 'd'}</td>
        <td>{`¥${Item.total_wage ? Item.total_wage : ''}`}</td>
        <td>
          <ShowIf condition={Item.admin_confirm != true}>
            <div className='wrap-button-action'>
              <button className='item-link-action btn-main has-loading' disabled={this.state.loading} onClick={this.confirmItem.bind(this)}>実行する</button>
            </div>
          </ShowIf>
          <ShowIf condition={Item.admin_confirm == true}>
            <div className='wrap-button-action'>{`済`}</div>
          </ShowIf>
        </td>
        <td>
          <ShowIf condition={Item.admin_confirm == true}>
            <div className='wrap-button-action'>
              <a className='item-link-action btn-main' href={URL_PDF_REMUNERATION}>PDF</a>
            </div>
          </ShowIf>
          <ShowIf condition={Item.admin_confirm != true}>
            <div className='wrap-button-action'>---</div>
          </ShowIf>
        </td>
        <td>
          <ShowIf condition={Item.admin_confirm == true}>
            <div className='wrap-button-action'>
              <a className='item-link-action btn-main' href={URL_PDF_INVOICE}>PDF</a>
            </div>
          </ShowIf>
          <ShowIf condition={Item.admin_confirm != true}>
            <div className='wrap-button-action'>---</div>
          </ShowIf>
        </td>
      </tr>
    );
  }
}

ListItem.defaultProps = {
  dataSelected: []
}
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';

export default class ListItemDay extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }

  checkSchedule(date) {
    let toDay = (new Date()).getTime();
    let schedule = (moment(date)._d).getTime();
    if(schedule < toDay) {
      return ('---')
    } else {
      return date
    }
  }

  render() {
    let Item = this.props.item;
    return (
      <tr>
        <td>{Item.date ? moment(String(Item.date)).format('YYYY年MM月DD日') : ''}</td>
        <td>{Item.staff_id ? Item.staff_id : ''}</td>
        <td>{Item.staff_name ? Item.staff_name : ''}</td>
        <td>{Item.wage_type && Item.wage_type == 1 ? '時給' : '日給'} ¥{Item.wage ? Item.wage : ''}</td>
        <td>{Item.working_hours ? Item.working_hours : ''}{Item.wage_type && Item.wage_type == 1 ? 'h' : 'd'}</td>
        <td>{`¥${Item.total_wage ? Item.total_wage : ''}`}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/staffPays/${Item.id}`}>編集</Link>
            <button className='item-link-action btn-danger' onClick={this.deleteItem.bind(this)}>削除</button>
          </div>
        </td>
      </tr>
    );
  }
}

ListItemDay.defaultProps = {
  deleteItem: function() {}
}
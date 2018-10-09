import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';

export default class ListItemDay extends Component {

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
        <td>{Item.wage_type && Item.wage_type == 1 ? '時給 ' : '日給 '}¥{Item.wage ? Item.wage : ''}</td>
        <td>{Item.working_hours ? Item.working_hours : ''}{Item.wage_type && Item.wage_type == 1 ? 'h' : 'd'}</td>
        <td>{`¥${Item.total_wage ? Item.total_wage : ''}`}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/staff/staffPays/${Item.id}`}>編集</Link>
          </div>
        </td>
      </tr>
    );
  }
}

ListItemDay.defaultProps = {
  deleteItem: function() {}
}
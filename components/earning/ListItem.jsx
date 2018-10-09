import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';
import {getPrice} from 'constants/money';

export default class ListItem extends Component {

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
        <td>
          <ShowIf condition={this.props.type_view == 'MONTHLY'}><span>{Item.year ? Item.year : ''}年{Item.month ? Item.month : ''}月</span></ShowIf>
          <ShowIf condition={this.props.type_view != 'MONTHLY'}><span>{Item.date ? moment(Item.date).format('YYYY年MM月DD日') : ''}</span></ShowIf>
        </td>
        <td>{Item.studio_name ? Item.studio_name : ''}</td>
        <td>{Item.booking_total_price ? "¥" + getPrice(Item.booking_total_price) : 0}</td>
        <td>{Item.order_total_price ? "¥" + getPrice(Item.order_total_price) : 0}</td>
        <td>{Item.earnings ? "¥" + getPrice(Item.earnings) : ''}</td>
      </tr>
    );
  }
}

ListItem.defaultProps = {
  deleteItem: function() {}
}
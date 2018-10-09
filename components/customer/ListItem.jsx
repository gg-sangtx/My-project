import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id, this.props.item.last_name, this.props.item.first_name);
  }

  render() {
    let Item = this.props.item;
    let ItemChildren = ''
    if (Item.children) {
      ItemChildren = Item.children.map(item => {
        return (
          <p>{`${item.name} (${moment(item.birthday).format('YYYY年MM月DD日生')})`}</p>
        )
      })
    }
    return (
      <tr>
        <td>{Item.id ? Item.id : ''}</td>
        <td>
          {Item.last_name ? ' ' + Item.last_name : ''} &nbsp;
          {Item.first_name ? Item.first_name : ''}
        </td>
        <td>{Item.email ? Item.email : ''}</td>
        <td>
          {Item.tel_1 ? Item.tel_1 : ''}
          {Item.tel_2 ? '-' + Item.tel_2 : ''}
          {Item.tel_3 ? '-' + Item.tel_3 : ''}
        </td>
        <td>
          {ItemChildren}
        </td>
        <td>{Item.past_booking_date ? Item.past_booking_date : '-'}</td>
        <td>{Item.next_booking_date ? Item.next_booking_date : '-'}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/customers/${Item.id}`}>編集</Link>
            <button className='item-link-action btn-danger' onClick={this.deleteItem.bind(this)}>削除</button>
          </div>
        </td>
      </tr>
    );
  }
}

ListItem.defaultProps = {
  deleteItem: function() {}
}
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }
  render() {
    let Item = this.props.item;
    return (
      <tr>
        <td>{Item.id ? Item.id : ''}</td>
        <td>{Item.code ? Item.code : ''}</td>
        <td>{Item.name ? Item.name : ''}</td>
        <td>{Item.weekday_price ? '¥'+ Item.weekday_price : '¥0'}</td>
        <td>{Item.holiday_price ? '¥'+ Item.holiday_price : '¥0'}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/plans/${Item.id}`}>編集</Link>
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

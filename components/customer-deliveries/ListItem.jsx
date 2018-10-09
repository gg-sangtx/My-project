import React, { Component } from 'react';
import moment from 'moment';

export default class ListItem extends Component {

  deleteItem(e) {
    e.preventDefault();
    this.props.deleteItem(this.props.item.id);
  }

  editItem(e) {
    e.preventDefault();
    this.props.editItem(this.props.item)
  }

  render() {
    let Item = this.props.item;
    return (
      <tr>
        <td>
          {Item.last_name ? ' ' + Item.last_name : ''} &nbsp;
          {Item.first_name ? Item.first_name : ''}
        </td>
        <td><p>{Item.address1 ? Item.address1 : ''}</p><p>{Item.address2 ? Item.address2 : ''}</p></td>
        <td>
          {Item.tel1 ? Item.tel1 : ''}
          {Item.tel2 ? '-' + Item.tel2 : ''}
          {Item.tel3 ? '-' + Item.tel3 : ''}
        </td>
        <td>
          <div className='wrap-button-action'>
            <button className='item-link-action btn-main' onClick={this.editItem.bind(this)}>編集</button>
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
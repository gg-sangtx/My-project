import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }

  render() {
    let Item = this.props.item;
    return (
      <tr>
        <td>{Item.category_value ? Item.category_value : ''}</td>
        <td>{Item.question ? Item.question : ''}</td>
        <td>{Item.answer ? Item.answer : ''}</td>
        <td>{Item.sort_value ? Item.sort_value : ''}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/faqs/${Item.id}`}>編集</Link>
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
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

const dataStatus  = [
  {id: 1, name: '確認待ち'},
  {id: 2, name: '公開'},
  {id: 3, name: '非公開'},
  {id: 4, name: '保留'},
];
const dataCategory = [
  {id: 1, name: '撮影レポート'},
  {id: 2, name: 'お客様レビュー'},
];

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }
  render() {
    let Item = this.props.item;

    let itemStatus = dataStatus.filter(state => {
      return state.id == Item.status
    });

    let itemCategory = dataCategory.filter(state => {
      return state.id == Item.category_id
    });
    
    let newDataTag = '';
    if(Item.tags && Item.tags.length > 0) {
      let dataTag = Item.tags.map(item => {
        newDataTag += ' ' + item.text;
      })
    }
    return (
      <tr>
        <td>{Item.open_time}</td>
        <td>{itemCategory.length > 0 ? itemCategory[0].name : ''}</td>
        <td>{Item.plan_name}</td>
        <td>{Item.studio_name}</td>
        <td>{Item.booking_code}</td>
        <td>{Item.customer_name}</td>
        <td>{newDataTag}</td>
        <td>{itemStatus.length > 0 ? itemStatus[0].name : ''}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/reviews/${Item.id}`}>編集</Link>
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
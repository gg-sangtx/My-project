import React, { Component } from 'react';
import {Link} from 'react-router-dom';

const dataStatus  = [
  {id: 1, name: '公開'},
  {id: 2, name: '非公開'}
]

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }
  render() {
    let Item = this.props.item;

    let data = dataStatus.filter(state => {
      return state.id == Item.status
    });
    return (
      <tr>
        <td>{Item.id}</td>
        <td>{Item.open_time}</td>
        <td>{Item.close_time}</td>
        <td>{
          data.length > 0 ? data[0].name : '---'
        }</td>
        <td>
          <div className="box-img-list"><img src={Item.main_image_url} /></div></td>
        <td>{Item.title}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/news/${Item.id}`}>編集</Link>
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
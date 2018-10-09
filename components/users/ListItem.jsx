import React, { Component } from 'react';
import {Link} from 'react-router-dom';

const listRole = [
  {id:'1', value: '管理者'},
  {id:'2', value: '本社運営者'},
  {id:'3', value: '店舗運営者'},
  {id:'4', value: '印刷業者'},
]

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }
  render() {
    let Item = this.props.item;
    let Authority = listRole.filter(state => {
      return state.id == Item.authority
    })
    return (
      <tr>
        <td>{Item.id}</td>
        <td>{Item.name}</td>
        <td>{Item.email}</td>
        <td>{Authority.length > 0 ? Authority[0].value : '---'}</td>
        <td>{
          Item.studios.map((item, i) => {
            return (<p key={i}>{item.name}</p>)
          })
        }</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/users/${Item.id}`}>編集</Link>
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
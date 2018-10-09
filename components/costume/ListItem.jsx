import React, { Component } from 'react';
import {Link} from 'react-router-dom';

const dataStyle = [
  {value: 1, name: '洋装'},
  {value: 2, name: '和装'}
]

const dataSex = [
  {value: 0, name: 'ユニセックス'},
  {value: 1, name: '男の子'},
  {value: 2, name: '女の子'}
]

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }
  render() {
    let Item = this.props.item;
    let data = dataStyle.filter(state => {
      return state.value == Item.type
    });

    let valueSex = dataSex.filter(state => {
      return state.value == Item.sex
    });

    let url_img = Item.costume_images.length > 0 ? Item.costume_images[0].image_url : "";

    return (
      <tr>
        <td>{Item.id}</td>
        <td><div className ="box-img-list">
          <img src={url_img} />
        </div></td>
        <td>{Item.code}</td>
        <td>{data.length > 0 ? data[0].name : '---'}</td>
        <td>{valueSex.length > 0 ? valueSex[0].name : '---'}</td>
        <td>{Item.name}</td>
        <td>
          {
            Item.studios.map((item, index) => {
              return (
                <p>{item.name}</p>
              );
            })
          }
        </td>
        <td>
          {
            Item.costume_sizes.map((item, index) => {
              return (
                <p>{item.value}</p>
              );
            })
          }
        </td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/costumes/${Item.id}`}>編集</Link>
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

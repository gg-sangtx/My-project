import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';

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
    let ListJanCode = Item.skus.map(item => {
      return (
        <p className='mb5'>{item.product_sku.jan_code}</p>
      )
    });
    let ListProductCode = Item.skus.map(item => {
      return (
        <p className='mb5'>{item.product_sku.product_code}</p>
      )
    });
    let ListSize = Item.skus.map(item => {
      return (
        <p className='mb5'>{item.value}</p>
      )
    });
    return (
      <tr>
        <td>
          <div className='box-img-list'>
            <img src={Item.images.length > 0 ? Item.images[0].url : ''}/>
          </div>
        </td>
        <td>{Item.product_code ? Item.product_code : ''}</td>
        <td>{Item.name ? Item.name : ''}</td>
        <td>¥{Item.price ? Item.price : ''}/¥{Item.real_price ? Item.real_price : ''}</td>
        <td>{ListSize}</td>
        <td>{ListProductCode}</td>
        <td>{ListJanCode}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/products/${Item.id}`}>編集</Link>
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
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';

export default class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }

  render() {
    let Item = this.props.item;
    return (
      <tr>
        <td>{Item.order_number}</td>
        <td>{Item.booking_id}</td>
        <td>{Item.order_date}</td>
        <td>{Item.product_names}</td>
        <td>{Item.customer_name}</td>
        <td>
        {
          Item.deliveries.map((item, index) => {
            return(
              <p className='mb0' style={{fontWeight: 400}} key={index}>{item.status_value}</p>
            )
          })
        }
        </td>
        <td>
        {
          Item.deliveries.map((item, index) => {
            return(
              <p className='mb0' style={{fontWeight: 400}} key={index}>{item.send_date}</p>
            )
          })
        }
        </td>
        <td>
        {
          Item.deliveries.map((item, index) => {
            return(
              <p className='mb0' style={{fontWeight: 400}} key={index}>{item.delivery_date}</p>
            )
          })
        }
        </td>
        <td>
        {
          Item.deliveries.map((item, index) => {
            return(
              <p className='mb0' style={{fontWeight: 400}} key={index}>{item.voucher_number}</p>
            )
          })
        }
        </td>
        <td>
          <ShowIf condition={true}>
            <div className='wrap-button-action'>
              <Link className='item-link-action btn-main' to={`/orders/${Item.id}`}>編集</Link>
            </div>
          </ShowIf>
        </td>
      </tr>
    );
  }
}

ListItem.defaultProps = {
  deleteItem: function() {}
}
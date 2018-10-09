import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }

  checkStatus(status) {
    switch(status) {
      case 1:
        return '撮影前';
      case 2:
        return 'キャンセル済み';
      case 3:
        return '撮影後';
      default:
        return '写真公開済み'
    }
  }

  getTime(date, minutes) {
    let newDate = new Date(date);
    let hours = (minutes / 60);
    let newMoment = moment(date).add(hours, 'hours');
    return newMoment._d;
  }

  goToPhoto() {
    this.props.dispatch({type: 'BOOKING_PHOTO', idBooking: this.props.item.id});
    this.props.history.push(`/bookings/${this.props.item.id}/photos`);
  }

  goToOderList() {
    let dataSearch = {
      booking_code: this.props.item.booking_code
    }
    this.props.dispatch({type: 'UPDATE_ORDER_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'ORDER_GO_BACK'});
    this.props.history.push(`/orders`);
  }

  goToAddOrder() {
    this.props.dispatch({type: 'ADD_NEW_ORDER', booking_code: this.props.item.booking_code});
    this.props.dispatch({type: 'GO_TO_ADD_NEW_ORDER', booking_code: this.props.item.booking_code});
    this.props.history.push(`/orders/create`);
  }

  replaceTag(tag) {
    return tagsToReplace[tag] || tag;
  }

  safe_tags_replace(str) {
    return String(str).replace(/[&<>]/g, this.replaceTag);
  }

  render() {
    let Item = this.props.item;
    let content = Item.costume_names ? this.safe_tags_replace(Item.costume_names) : '';
    return (
      <tr>
        <td>
          <p className='mb0'>{Item.booking_date_time ? moment(Item.booking_date_time).format('YYYY年M月D日') : ''}</p>
          <p className='mb0'>{Item.booking_date_time ? (moment(Item.booking_date_time).format('HH:mm') + '~' + moment(this.getTime(Item.booking_date_time, Item.booking_minutes)).format('HH:mm')) : ''}</p>
        </td>
        <td>{Item.booking_code ? Item.booking_code : ''}-{Item.branch_number ? Item.branch_number : ''}</td>
        <td>{Item.booking_status_id ? this.checkStatus(Item.booking_status_id) : ''}</td>
        <td>{Item.customer_name ? Item.customer_name : ''}</td>
        <td>
          {Item.customer_tel1 ? Item.customer_tel1 : ''}
          {Item.customer_tel2 ? '-' + Item.customer_tel2 : ''}
          {Item.customer_tel3 ? '-' + Item.customer_tel3 : ''}
        </td>
        <td>{Item.studio_name ? Item.studio_name : ''}</td>
        <td>{Item.staff_names ? Item.staff_names : ''}</td>
        <td><p className='mb0' dangerouslySetInnerHTML={{__html: content.replace(/\n/gi, '<br/>')}}/></td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/bookings/${Item.id}`}>編集</Link>
            <ShowIf condition={Item.booking_status_id != 2}>
              <span className='item-link-action btn-main' onClick={this.goToPhoto.bind(this)}>写真編集</span>
            </ShowIf>
            <ShowIf condition={Item.booking_status_id == 3 || Item.booking_status_id == 4}>
              <span className='item-link-action btn-main' onClick={this.goToAddOrder.bind(this)}>受注追加</span>
            </ShowIf>
            <ShowIf condition={Item.booking_status_id == 3 || Item.booking_status_id == 4}>
              <span className='item-link-action btn-main' onClick={this.goToOderList.bind(this)}>受注一覧</span>
            </ShowIf>
            <ShowIf condition={Item.booking_status_id != 2}>
              <button className='item-link-action btn-danger' onClick={this.deleteItem.bind(this)}>キャンセル</button>
            </ShowIf>
          </div>
        </td>
      </tr>
    );
  }
}

ListItem.defaultProps = {
  deleteItem: function() {}
}

export default connect()(withRouter(ListItem));
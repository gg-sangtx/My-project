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
    this.props.history.push(`/staff/bookings/${this.props.item.id}/photos`);
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
        <td>{Item.booking_date_time ? (moment(Item.booking_date_time).format('YYYY年M月D日 HH:mm') + '~' + moment(this.getTime(Item.booking_date_time, Item.booking_minutes)).format('HH:mm')) : ''}</td>
        <td>{Item.booking_code ? Item.booking_code : ''}</td>
        <td>{Item.booking_status_id ? this.checkStatus(Item.booking_status_id) : ''}</td>
        <td>{Item.studio_name ? Item.studio_name : ''}</td>
        <td>{Item.customer_name ? Item.customer_name : ''}</td>
        <td><p className='mb0' dangerouslySetInnerHTML={{__html: content.replace(/\n/gi, '<br/>')}}/></td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/staff/bookings/${Item.id}`}>編集</Link>
            <ShowIf condition={Item.booking_status_id == 3 || Item.booking_status_id == 4}>
              <span className='item-link-action btn-main' onClick={this.goToPhoto.bind(this)}>写真編集</span>
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
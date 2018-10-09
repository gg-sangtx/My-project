import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';

const dataChooseCategory = [
                              {id: 1, value: '予約'},
                              {id: 2, value: 'クリーニング'},
                            ]
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
    let Category = dataChooseCategory.filter(state => {
      return state.id == Item.type
    })
    return (
      <tr>
        <td>
          {
            Item.date && Item.start_time && Item.end_time &&
            (Item.date + ' ' + Item.start_time + ' ~ ' + Item.end_time)
          }
          {
            Item.date && (Item.start_time == null || Item.end_time == null) ? Item.date + ' ' + '終日' : ''
          }
        </td>
        <td>{Item.costume_code ? Item.costume_code : ''}</td>
        <td>
          {Item.costume_name ? Item.costume_name : ' '}&nbsp;
          {Item.costume_size_value ? Item.costume_size_value : ''}
        </td>
        <td>{Item.studio_code ? Item.studio_code : '---'}</td>
        <td>{Item.studio_name ? Item.studio_name : '---'}</td>
        <td>{Category.length > 0 ? Category[0].value : '---'}</td>
        <td>
          <ShowIf condition={Item.type != 1}>
            <div className='wrap-button-action'>
              <Link className='item-link-action btn-main' to={`/costumeLocks/${Item.id}`}>編集</Link>
              <button className='item-link-action btn-danger' onClick={this.deleteItem.bind(this)}>削除</button>
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
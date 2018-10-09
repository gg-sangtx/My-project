import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import {option} from "constants/option";
import moment from 'moment';
import {DateTimeSecondFormat} from 'constants/datetime';

export default class ListItem extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataTypes: option.couponsType ? option.couponsType : [],
      dataStatus: option.couponsStatus ? option.couponsStatus : []
    }
  }

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }

  toJSDate(dateTime) {
    let newDate = dateTime.split(" ");
    let date = newDate[0].split("-");
    return { date: date, time: newDate[1] };
  }
  
  render() {
    let Item = this.props.item;
    let dateStartTimeCovert = '';
    let dateEndTimeCovert = '';
    let Type = this.state.dataTypes.filter(state => {
      return state.key == Item.type
    });
    let Status = this.state.dataStatus.filter(state => {
      return state.key == Item.status
    });
    if (Item.start_time == null ) {
       dateStartTimeCovert = '';
    } else {
      let dateStartTimeString = this.toJSDate(Item.start_time);
      if(dateStartTimeString && dateStartTimeString.date){
        dateStartTimeCovert = dateStartTimeString.date[0] + '年' + dateStartTimeString.date[1] + '月' + dateStartTimeString.date[2] + '日' + ' ' + dateStartTimeString.time;
      }
    }
    if (Item.end_time == null ) {
      dateEndTimeCovert = '';
    } else {
      let dateEndTimeString = this.toJSDate(Item.end_time);
      if(dateEndTimeString && dateEndTimeString.date){
        dateEndTimeCovert = dateEndTimeString.date[0] + '年' + dateEndTimeString.date[1] + '月' + dateEndTimeString.date[2] + '日' + ' ' + dateEndTimeString.time;
      }
    }
    return (
      <tr>
        <td>{Item.id ? Item.id : ''}</td>
        <td>{Item.code ? Item.code : ''}</td>
        <td>{Item.name ? Item.name : ''}</td>
        <td>{Type.length > 0 ? Type[0].name : ''}</td>
        <td>{Status.length > 0 ? Status[0].name : ''}</td>
        <td>{Item.start_time ? dateStartTimeCovert : ''}</td>
        <td>{Item.end_time ? dateEndTimeCovert : ''}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/coupons/${Item.id}`}>編集</Link>
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

import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import moment from 'moment';
import {connect} from 'react-redux';

class ListItem extends Component {

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
    return (
      <tr>
        <td>{Item.id ? Item.id : ''}</td>
        <td>{Item.name ? Item.name : ''}</td>
        <td>{Item.name_kana ? Item.name_kana : ''}</td>
        <td>{Item.type && this.props.dataType.length > 0 ? this.props.dataType[this.props.dataType.findIndex(item => item.key == Item.type)].value : ''}</td>
        <td>{Item.email ? Item.email : ''}</td>
        <td>{Item.tel ? Item.tel : ''}</td>
        <td>{Item.studios_can_work && Item.studios_can_work.length > 0 ? (Item.studios_can_work.map(studio => {
              return ( <p>{studio.name}</p>)
            })) : null}
        </td>
        <td>{Item.date_time_schedule ? this.checkSchedule(Item.date_time_schedule) : '---'}</td>
        <td>
          <div className='wrap-button-action'>
            <Link className='item-link-action btn-main' to={`/staffs/${Item.id}`}>編集</Link>
            <button className='item-link-action btn-danger' onClick={this.deleteItem.bind(this)}>削除</button>
          </div>
        </td>
      </tr>
    );
  }
}

ListItem.defaultProps = {
  deleteItem: function() {},
  dataType: []
}

function BindStateToProps(state) {
  return {
    dataType: state.systemData.typeStaff
  }
}

export default connect(BindStateToProps)(ListItem);
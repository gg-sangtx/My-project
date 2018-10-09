import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ShowIf} from 'components/utils';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';

class ListItem extends Component {

  deleteItem() {
    this.props.deleteItem(this.props.item.id);
  }

  gotoSchedule() {
    let dataSearch = {
      studios_worked: [this.props.item.id]
    }
    this.props.dispatch({type: 'UPDATE_STAFF_SCHEDULE_SEARCH', dataSearch: dataSearch});
    this.props.dispatch({type: 'STAFF_SCHEDULE_GO_BACK'});
    this.props.history.push('/staff-schedules')
  }

  render() {
    let Item = this.props.item;
    return (
      <tr>
        <td>{Item.id}</td>
        <td>{Item.code}</td>
        <td>{Item.name}</td>
        <td>{Item.prefecture}</td>
        <td>
          <p>{Item.address1}</p>
          <ShowIf condition={Item.address2}>
            <p>{Item.address2}</p>
          </ShowIf>
        </td>
        <td>{Item.tel}</td>
        <td>
          <div className='wrap-button-action'>
            <span className='item-link-action btn-main' onClick={this.gotoSchedule.bind(this)}>スケジュール確認</span>
            <Link className='item-link-action btn-main' to={`/studios/${Item.id}`}>編集</Link>
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

export default connect()(withRouter(ListItem));
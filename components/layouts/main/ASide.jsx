'use strict';
import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout, staffLogout} from 'base/actions';
import {withRouter} from 'react-router-dom';
import MenuConfig from 'constants/MenuConfig';
import {ShowIf} from 'components/utils';
import moment from 'moment';

const arrayUrl = {
  'data': [
    '/news',
    '/resources'
  ]
}

class ASide extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      idBooking: this.props.idBooking
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.idBooking != this.props.idBooking) {
      this.state.idBooking = nextProps.idBooking;
      this.setState({...this.state})
    }
  }

  checkactive(index) {
    let isActive = false;
    let Menu = [];
    if (this.props.isStaff == true) {
      Menu = MenuConfig.Staff
    } else {
      Menu = MenuConfig.Admin
    }
    if(Menu[index] && Menu[index].child.length > 0) {
      Menu[index].child.map((SubItem) => {
        if(location.pathname == SubItem.link) {
          isActive = true;
        }
      });
    }
    if(Menu[index] && Menu[index].link == location.pathname) {
      isActive = true;
    }
    return isActive;
  }

  checkActiveSubmenu(link) {
    let isActive = false;
    if(location.pathname == link) {
      isActive = true;
    }
    return isActive;
  }

  handleLogout(e) {
    e.preventDefault();
    this.state.loading = true;
    let User = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    this.setState({...this.state});
    if (User && User.type_user == 'staff') {
      this.props.dispatch(staffLogout()).then(() => {
        this.props.history.push('/staff/login');
      });
    } else {
      this.props.dispatch(logout()).then(() => {
        this.props.history.push('/login');
      });
    }
    return;
  }

  onClickMenu(type) {
    if(type == 'UPDATE_BOOKING_SEARCH' || type == 'UPDATE_STAFF_BOOKING_SEARCH') {
      this.props.dispatch({type: type, dataSearch: {booking_date_from: moment().startOf('day')}});
    } else {
      this.props.dispatch({type: type, dataSearch: {}});
    }
  }

  render() {
    let Menu = [];
    if (this.props.isStaff == true) {
      Menu = MenuConfig.Staff
    } else {
      Menu = MenuConfig.Admin
    }
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <ShowIf condition={this.props.isBooking != true}>
            <ul className="sidebar-menu">
              {
                Menu.map((Item, i) => {
                  return(
                    <li className={`treeview${this.checkactive(i) ? ' active' : ''}${this.props.active && this.props.active.length > 0 && this.props.active[0] == i ? ' active' : ''}`} key={i}>
                      <Link to={Item.link} onClick={this.onClickMenu.bind(this, Item.type)}>
                        <i className={Item.icon ? Item.icon : ''}></i>
                        <span>{Item.menuName}</span>
                      </Link>
                      {
                        Item.child && Item.child.length > 0 ? (
                          <ul className="treeview-menu">
                          {
                            Item.child.map((SubItem, j) => {
                              return(
                                <li onClick={this.onClickMenu.bind(this, Item.type)} className={`treeview ${this.checkActiveSubmenu(SubItem.link) ? 'current' : ''} ${this.props.active && this.props.active.length > 1 && this.props.active[0] == i && this.props.active[1] == j ? ' current' : ''}`} key={j}>
                                  <Link to={SubItem.link}>
                                    <i className={SubItem.icon ? SubItem.icon : ''}></i>
                                    <span>{SubItem.menuName}</span>
                                  </Link>
                                </li>
                              )
                            })
                          }
                          </ul>
                        ) : null
                      }
                    </li>
                  )
                })
              }
              <li className="treeview">
                <Link to="#" className={`has-loading${this.state.loading ? ' loading' : ''}`} onClick={this.handleLogout.bind(this)}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>ログアウトする</span>
                </Link>
              </li>
            </ul>
          </ShowIf>
          <ShowIf condition={this.props.isBooking == true}>
            <ul className="sidebar-menu">
              <li className={`treeview active`}>
                <Link to={`${this.props.isStaffMenu == true ? '/staff/bookings/' : /bookings/}${this.state.idBooking}/photos`} onClick={this.onClickMenu.bind(this, 'UPDATE_BOOKING_PHOTO_SEARCH')}>
                  <i className={`fas fa-camera-retro`}></i>
                  <span>写真情報</span>
                </Link>
                <ul className="treeview-menu">
                  <li onClick={this.onClickMenu.bind(this, 'UPDATE_BOOKING_PHOTO_SEARCH')} className={`treeview ${this.checkActiveSubmenu(`${this.props.isStaffMenu == true ? '/staff/bookings/' : /bookings/}${this.state.idBooking}/photos`) ? 'current' : ''}`}>
                    <Link to={`${this.props.isStaffMenu == true ? '/staff/bookings/' : /bookings/}${this.state.idBooking}/photos`}>
                      <span>写真情報一覧</span>
                    </Link>
                  </li>
                  <li onClick={this.onClickMenu.bind(this, 'UPDATE_BOOKING_PHOTO_SEARCH')} className={`treeview ${this.checkActiveSubmenu(`${this.props.isStaffMenu == true ? '/staff/bookings/' : /bookings/}${this.state.idBooking}/photos/delete`) ? 'current' : ''} ${this.checkActiveSubmenu(`${this.props.isStaffMenu == true ? '/staff/bookings/' : /bookings/}${this.state.idBooking}/photos/download`) ? 'current' : ''}`}>
                    <Link to={`${this.props.isStaffMenu == true ? '/staff/bookings/' : /bookings/}${this.state.idBooking}/photos/delete`}>
                      <span>削除</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </ShowIf>
        </section>
      </aside>
    );
  }
}

ASide.defaultProps = {
  isStaff: false,
  isStaffMenu: false,
  idBooking: ''
}

function bindStateToProps(state) {
  return {
    idBooking: state.booking.idBooking
  }
}

export default connect(bindStateToProps)(withRouter(ASide));

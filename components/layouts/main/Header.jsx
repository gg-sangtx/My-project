'use strict';
import React from 'react';
import {Link, NavLink} from 'react-router-dom';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.setContentWrapperMinHeight(document.getElementsByClassName('main-header')[0].clientHeight);
  }

  render() {
    let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    return (
      <header className="main-header">
        <h1 className='logo' id='logo'>
          <Link to={this.props.isStaff == true ? '/staff/bookings' : '/'} className="logo-link">
            <img src={require('assets/images/logo-mini.png')} className='logo-image mini' title='Studio MARLMARL'/>
            <img src={require('assets/images/logo.svg')} className='logo-image' title='Studio MARLMARL'/>
          </Link>
        </h1>
        <nav className="navbar navbar-static-top">
          <Link to="#" className="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span className="sr-only">Toggle navigation</span>
          </Link>
          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li className="dropdown user user-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <span className="hidden-xs">{userInfo.name ? userInfo.name : ''}</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

Header.defaultProps = {
  isStaff: false
}

export default Header;

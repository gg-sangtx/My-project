import { Auth, Staff } from 'api';
import cookie from 'react-cookie';

function logout() {
  return function(dispatch) {
    return Auth.actions.signout.request().then(response => {
      cookie.remove('accessToken', {path: '/'});
      localStorage.removeItem('userInfo');
    }).catch(err => {
      cookie.remove('accessToken', {path: '/'});
      localStorage.removeItem('userInfo');
      return
    });
  }
}

function staffLogout() {
  return function(dispatch) {
    return Staff.actions.signout.request().then(response => {
      cookie.remove('accessToken', {path: '/'});
      localStorage.removeItem('userInfo');
    }).catch(err => {
      cookie.remove('accessToken', {path: '/'});
      localStorage.removeItem('userInfo');
      return
    });
  }
}

export {logout, staffLogout};

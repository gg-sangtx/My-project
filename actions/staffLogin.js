import { Staff } from 'api';
import cookie from 'react-cookie';

function staffLogin(username, password) {
  return function(dispatch) {
    let params = {
      email: username, 
      password: password
    }
    return Staff.actions.signin.request('',params).then(res => {
      if (res && res.data) {
        cookie.remove('accessToken', {path: '/'});
        let expires = {path: '/', maxAge: 3600*24*30}

        cookie.save('accessToken', res.data.data.token, expires);
        return dispatch(getStaffInfo());
      } else {
        return {
          isAuthenticated: false,
          data: res.response
        }
      }
    }).catch( (errors) => {
      return {
        isAuthenticated: false,
        data: errors.response
      }
    });
  }
}

function getStaffInfo() {
  return function(dispatch) {
    return Staff.actions.me.request().then(res => {
       if (res.data.data.staff) {
        let userData = res.data.data.staff;
        localStorage.setItem('userInfo', JSON.stringify(userData));
        return {
          isAuthenticated: true
        };
       } else {
         return {
           isAuthenticated: false
         };
       }
    }).catch( (errors) => {
      return {
        isAuthenticated: false,
        data: errors
      }
   });
  }
}

export {staffLogin, getStaffInfo}

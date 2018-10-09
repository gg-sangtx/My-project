import { Auth, Users } from 'api';
import cookie from 'react-cookie';

function login(username, password, isRememberMe) {
  return function(dispatch) {
    let params = {
      email: username, 
      password: password
    }
    return Auth.actions.signin.request('',params).then(res => {
      if (res && res.data) {
        let expires = {path: '/', maxAge: 3600*24*30}

        cookie.save('accessToken', res.data.data.token, expires);
        return dispatch(getUserInfo());
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

function getUserInfo() {
  return function(dispatch) {
    return Users.actions.me.request().then(res => {
       if (res.data.data.user.authority) {
        let userData = res.data.data.user;
        localStorage.setItem('userInfo', JSON.stringify(userData));
        return {
          isAuthenticated: true
        };
       }
       else {
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

export {login, getUserInfo}

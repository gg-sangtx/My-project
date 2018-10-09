import axios from 'axios';
import cookie from 'react-cookie';
import * as CONFIG from 'constants/config';

export default function customFetch(url, options) {

  let at = cookie.load('accessToken');
  return new Promise((resolve, reject) => {
    if (at) {
      axios({
        url: url,
        data: options.data,
        method: options.method,
        auth: {
          username: CONFIG.USER_BASIC_AUTH,
          password: CONFIG.PASSWORD_BASIC_AUTH
        },
        headers: {
          'Content-Type': 'application/json',
          'JWTAuthorization': `Bearer ${at}`,
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    } else {
      axios({
        url: url,
        data: options.data,
        method: options.method,
        auth: {
          username: CONFIG.USER_BASIC_AUTH,
          password: CONFIG.PASSWORD_BASIC_AUTH
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    }
  });
}

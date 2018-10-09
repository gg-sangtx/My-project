import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const staffPayForStaff = reduxApi({
  list: {
    url: `/staff/staff-pays`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },  
  confirm: {
    url: `/staff/staff-pays/confirm`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  detail: {
    url: `/staff/staff-pays/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default staffPayForStaff;
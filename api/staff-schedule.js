import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const staffSchedule = reduxApi({
  list: {
    url: `/staff-schedules`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  edit: {
    url: `/staff-schedules`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  getStaff: {
    url: `/staffs`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default staffSchedule;
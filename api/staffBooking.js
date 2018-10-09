import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const staffBooking = reduxApi({
  list: {
    url: `/staff/bookings`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },  
  listCalendar: {
    url: `/staff/staff-schedules`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  detail: {
    url: `/staff/bookings/:id`,
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

export default staffBooking;
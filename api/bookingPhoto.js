import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const bookingPhoto = reduxApi({
  get: {
    url: `/booking-photos`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  edit: {
    url: `/booking-photos`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  delete: {
    url: `/booking-photos`,
    options: (url, params, getState) => {
      return {
        method: 'DELETE',
        data: params
      };
    }
  },
  staffList: {
    url: `/staff/booking-photos`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  staffEdit: {
    url: `/staff/booking-photos`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  staffDelete: {
    url: `/staff/booking-photos`,
    options: (url, params, getState) => {
      return {
        method: 'DELETE',
        data: params
      };
    }
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default bookingPhoto;
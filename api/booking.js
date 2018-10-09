import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const booking = reduxApi({
  list: {
    url: `/bookings`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  detail: {
    url: `/bookings/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  edit: {
    url: `/bookings/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  cancelBooking: {
    url: `/bookings-cancel`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  getPlanOption: {
    url: `/plan-options?limit=0`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  getCostumes: {
    url: `/costumes?limit=0`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  getPlan: {
    url: `/plans?limit=0`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  getBookingHours: {
    url: `/booking/booking-hours`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  checkBookingTime: {
    url: `/bookings-check-valid-date-time`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  checkCoupons: {
    url: `/coupons/detail`,
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

export default booking;
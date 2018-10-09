import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';
import { API_URL } from 'base/constants/config';

const Order = reduxApi({
  list: {
    url: `/orders`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  create: {
    url: `/orders/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },

  detail: {
    url: `/orders/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  update: {
    url: `/orders/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },

  cancel: {
    url: `/orders-cancel/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },

  getBooking: {
    url: `/bookings/detail`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  getProduct: {
    url: `/products/detail`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  getListImage: {
    url: `/products/detail`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  getListBookingProduct: {
    url: `/booking-products`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  createBookingProduct: {
    url: `/booking-products/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },

  editBookingProduct: {
    url: `/booking-products/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },

  deleteBookingProduct: {
    url: `/booking-products/:id`,
    options: (url, params, getState) => {
      return {
        method: 'DELETE',
        data: params
      };
    }
  },

})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default Order;
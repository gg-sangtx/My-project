import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';
import { API_URL } from 'base/constants/config';

const Coupons = reduxApi({
  listCoupon: {
    url: `/coupons`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  getCoupons: {
    url: `/coupons/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  postCoupons: {
    url: `/coupons/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  updateCoupons: {
    url: `/coupons/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  deleteCoupons: {
    url: `/coupons/:id`,
    options: (url, params, getState) => {
      return {
        method: 'DELETE',
        data: params
      };
    }
  },
  listStudio: {
    url: `/studios`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: {
          limit: 0,
          isSubList: 1
        }
      };
    }
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default Coupons;

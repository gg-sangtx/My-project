import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const customerDelivery = reduxApi({
  list: {
    url: `/customer-deliveries`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  update: {
    url: `/customer-deliveries/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  create: {
    url: `/customer-deliveries/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  delete: {
    url: `/customer-deliveries/:id`,
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

export default customerDelivery;
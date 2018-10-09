import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';
import { API_URL } from 'base/constants/config';

const costumes = reduxApi({
  list: {
    url: `/costumes`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  
  postCostume: {
    url: `/costumes/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },

  getCostume: {
    url: `/costumes/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  getCostumeEdit: {
    url: `/costumes/:id`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  
  updateCostume: {
    url: `/costumes/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  deleteCostume: {
    url: `/costumes/:id`,
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

export default costumes;
import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';
import { API_URL } from 'base/constants/config';

const CostumeLocks = reduxApi({
  list: {
    url: `/costume-locks`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  getCostumeLocks: {
    url: `/costume-locks/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  postCostumeLocks: {
    url: `/costume-locks/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  updateCostumeLocks: {
    url: `/costume-locks/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  deleteCostumeLocks: {
    url: `/costume-locks/:id`,
    options: (url, params, getState) => {
      return {
        method: 'DELETE',
        data: params
      };
    }
  },
  listDataCostume: {
    url: `/studios/getCostumes/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: {
          limit: 0,
          isSubList: 1
        }
      };
    }
  },
  allDataCostume: {
    url: `/costumes?is_sub_list=1`,
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

export default CostumeLocks;
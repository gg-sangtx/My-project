import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const earning = reduxApi({
  list: {
    url: `/earnings`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  chart: {
    url: `/earnings/graph`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  getPrduct: {
    url: `/products`,
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

export default earning;
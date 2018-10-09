import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';
import { API_URL } from 'base/constants/config';

const Reviews = reduxApi({
  list: {
    url: `/reviews`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  
  postReviews: {
    url: `/reviews/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },

  getReviews: {
    url: `/reviews/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },

  getReviewsEdit: {
    url: `/reviews/:id`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  
  updateReviews: {
    url: `/reviews/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  deleteReviews: {
    url: `/reviews/:id`,
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

export default Reviews;
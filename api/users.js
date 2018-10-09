import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const users = reduxApi({
  me: {
    url: `/admin/me`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  list: {
    url: `/admin/users`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  getUser: {
    url: `/admin/users/:id`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  createUser: {
    url: `/admin/users/create`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  updateUser: {
    url: `/admin/users/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  deleteUser: {
    url: `/admin/users/:id`,
    options: (url, params, getState) => {
      return {
        method: 'DELETE',
        data: params
      };
    }
  },
  updatePassword: {
    url: `/admin/password/reset/:id`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  createPassword: {
    url: `/admin/password`,
    options: (url, params, getState) => {
      return {
        method: 'PATCH',
        data: params
      };
    }
  },
  resetPassword: {
    url: `/admin/password/forgot`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
        data: params
      };
    }
  },
  checkUpdatePassword: {
    url: `/admin/verify`,
    options: (url, params, getState) => {
      return {
        method: 'POST',
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

export default users;
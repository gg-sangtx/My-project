import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';
import { API_URL } from 'base/constants/config';

const system = reduxApi({
  prefectures: {
    url: `/common/prefectures`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  authorities: {
    url: `/common/authorities`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  fixedHolidays: {
    url: `/common/fixed-holidays`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  bookingHours: {
    url: `/booking/booking-hours`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  staffs: {
    url: `/staffs`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  typeStaff: {
    url: `/common/types-staff`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  typeWage: {
    url: `/common/types-wage`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: params
      };
    }
  },
  studioCanWork: {
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
  },

  listDataCostume: {
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
  },

  uploadFile: {
    url: `/file/upload-file`,
    options: (url, _params, getState) => {
      let formData = new FormData();
      formData.append(_params.field, _params.file);
      if(_params.is_need_origin_name == true) {
        formData.append('is_need_origin_name', '1');
      }
      return {
        method: 'POST',
        data: formData
      };
    }
  },
  listSize: {
    url: `/costume-sizes`,
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
  listCategory: {
    url: `/common/categories-faq`,
    options: (url, params, getState) => {
      return {
        method: 'GET',
        data: {
          limit: 0
        }
      };
    }
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default system;
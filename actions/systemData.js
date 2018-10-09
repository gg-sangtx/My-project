import {System} from 'api';
import {connect} from 'react-redux';

function updateSystemData(key) {
  return function(dispatch) {
    switch (key) {
    case 'listStudio':
      return dispatch(listStudio());
    case 'listDataCostume':
      return dispatch(listDataCostume());
    case 'studioCanWork':
      return dispatch(studioCanWork());
    default:
      return dispatch(listStudio());
    }
  }
}

function studioCanWork(type, key) {
  return function(dispatch) {
    return System.actions.studioCanWork.request().then(res => {
       if (res.data) {
        return {
          data: res.data.data.studios.data
        };
       } else {
         return {
           data: null
         };
       }
    }).catch( (errors) => {
      return {
        data: null,
      }
    });
  };
}

function listStudio() {
  return function(dispatch) {
    return System.actions.listStudio.request().then(res => {
       if (res.data) {
        return {
          data: res.data.data.studios.data
        };
       } else {
         return {
           data: null
         };
       }
    }).catch( (errors) => {
      return {
        data: null,
      }
    });
  };
}

function listDataCostume() {
  return function(dispatch) {
    return System.actions.listDataCostume.request().then(res => {
       if (res.data) {
        return {
          data: res.data.data.costumes.data
        };
       } else {
         return {
           data: null
         };
       }
    }).catch( (errors) => {
      return {
        data: null,
      }
    });
  };
}

export {updateSystemData}
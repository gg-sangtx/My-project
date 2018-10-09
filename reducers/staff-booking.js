import moment from 'moment';

let initialState = {
  data: [],
  dataSearch: {
    booking_date_from: moment().startOf('day')
  },
  goBack: false,
  pageData: 0,
  idBooking: null
}

function staffBooking(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_STAFF_BOOKING_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_STAFF_BOOKING_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'STAFF_BOOKING_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'STAFF_BOOKING_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'STAFF_BOOKING_PHOTO':
      newState.idBooking = action.idBooking;
      return newState;
    case 'REMOVE_STAFF_BOOKING':
      return state.data.filter(item => item.id != action.staffId);
    default:
      return state;
  }
}

export { staffBooking }
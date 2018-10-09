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

function booking(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_BOOKING_LIST':
      newState.data = action.staff;
      return newState;
    case 'UPDATE_BOOKING_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_BOOKING_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'BOOKING_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'BOOKING_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'BOOKING_PHOTO':
      newState.idBooking = action.idBooking;
      return newState;
    case 'REMOVE_BOOKING':
      return state.data.filter(item => item.id != action.staffId);
    default:
      return state;
  }
}

export { booking }
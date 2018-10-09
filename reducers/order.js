import moment from 'moment';

let initialState = {
  data: [],
  dataSearch: {
    booking_date_from: moment().startOf('day')
  },
  goBack: false,
  pageData: 0,
  booking_code: null,
  goToBooking: false
}

function order(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_ORDER_LIST':
      newState.data = action.order;
      return newState;
    case 'UPDATE_ORDER_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_ORDER_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'ORDER_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'ORDER_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_ORDER':
      return state.data.filter(item => item.id != action.orderId);
    case 'ADD_NEW_ORDER':
      newState.booking_code = action.booking_code
      return newState;
    case 'GO_TO_ADD_NEW_ORDER':
      newState.goToBooking = true
      return newState;
    case 'RESET_GO_TO_ADD_NEW_ORDER':
      newState.booking_code = null;
      newState.goToBooking = false
      return newState;
    default:
      return state;
  }
}

export { order }
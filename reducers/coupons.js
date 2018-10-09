let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listCoupons(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_COUPON_LIST':
      newState.data = action.coupons;
      return newState;
    case 'UPDATE_COUPON_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_COUPON_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'COUPON_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'COUPON_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_COUPON':
      return state.data.filter(item => item.id != action.couponsId);
    default:
      return state;
  }
}

export { listCoupons }

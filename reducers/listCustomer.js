let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listCustomer(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_CUSTOMER_LIST':
      newState.data = action.customers;
      return newState;
    case 'UPDATE_CUSTOMER_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_CUSTOMER_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'CUSTOMER_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'CUSTOMER_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_CUSTOMER':
      return state.data.filter(item => item.id != action.faqId);
    default:
      return state;
  }
}

export { listCustomer }
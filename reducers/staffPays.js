let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function staffPays(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_STAFF_PAY_LIST':
      newState.data = action.staffPays;
      return newState;
    case 'UPDATE_STAFF_PAY_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_STAFF_PAY_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'STAFF_PAY_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'STAFF_PAY_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_STAFF_PAGE':
      return state.data.filter(item => item.id != action.staffPayId);
    default:
      return state;
  }
}

export { staffPays }
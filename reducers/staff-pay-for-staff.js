let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function staffPayForStaff(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_STAFF_PAY_FOR_STAFF_LIST':
      newState.data = action.staffPays;
      return newState;
    case 'UPDATE_STAFF_PAY_FOR_STAFF_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_STAFF_PAY_FOR_STAFF_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'STAFF_PAY_FOR_STAFF_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'STAFF_PAY_FOR_STAFF_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_STAFF_PAY_FOR_STAFF':
      return state.data.filter(item => item.id != action.staffId);
    default:
      return state;
  }
}

export { staffPayForStaff }
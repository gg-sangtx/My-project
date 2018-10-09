let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listStaff(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_STAFF_LIST':
      newState.data = action.staff;
      return newState;
    case 'UPDATE_STAFF_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_STAFF_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'STAFF_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'STAFF_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_STAFF':
      return state.data.filter(item => item.id != action.staffId);
    default:
      return state;
  }
}

export { listStaff }
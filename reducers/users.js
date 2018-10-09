let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0  
}

function listUsers(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_USER_LIST':
      newState.data = action.users;
      return newState;
    case 'UPDATE_USER_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_USER_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'USER_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'USER_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_USER':
      return newState.data.filter(item => item.id != action.usersID);
    default:
      return state;
  }
}

export { listUsers }
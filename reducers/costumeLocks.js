let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listCostumeLocks(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_COSTUMELOCK_LIST':
      newState.data = action.costumelocks;
      return newState;
    case 'UPDATE_COSTUMELOCK_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_COSTUMELOCK_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'COSTUMELOCK_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'COSTUMELOCK_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_COSTUMELOCK':
      return state.data.filter(item => item.id != action.costumeLocksId);
    default:
      return state;
  }
}

export { listCostumeLocks }
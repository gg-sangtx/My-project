let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listCostumes(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_COSTUME_LIST':
      newState.data = action.costumes;
      return newState;
    case 'UPDATE_COSTUME_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_COSTUME_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'COSTUME_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'COSTUME_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_COSTUME':
      return state.data.filter(item => item.id != action.costumeId);
    default:
      return state;
  }
}

export { listCostumes }
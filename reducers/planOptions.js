let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listPlanOptions(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_PLANOPTIONS_LIST':
      newState.data = action.plans;
      return newState;
    case 'UPDATE_PLANOPTIONS_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_PLANOPTIONS_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'PLANOPTIONS_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'PLANOPTIONS_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_PLANOPTIONS':
      return state.data.filter(item => item.id != action.plansId);
    default:
      return state;
  }
}

export { listPlanOptions }

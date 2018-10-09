let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listPlans(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_PLANS_LIST':
      newState.data = action.plans;
      return newState;
    case 'UPDATE_PLANS_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_PLANS_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'PLANS_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'PLANS_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_PLANS':
      return state.data.filter(item => item.id != action.plansId);
    default:
      return state;
  }
}

export { listPlans }
